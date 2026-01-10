import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// リクエストボディの型
interface CreateEventRequest {
  title: string
  passphrase: string
  location?: string
  description?: string
  dateOptions: {
    date: string
    startTime: string | null
    endTime: string | null
    title?: string | null
  }[]
}

// public_id生成（8文字）
function generatePublicId(): string {
  return crypto.randomUUID().substring(0, 8)
}

// バリデーション
function validateRequest(body: CreateEventRequest): string | null {
  if (!body.title || body.title.trim() === '') {
    return 'タイトルは必須です'
  }
  if (body.title.length > 100) {
    return 'タイトルは100文字以内で入力してください'
  }
  if (!body.passphrase || body.passphrase.trim() === '') {
    return '合言葉は必須です'
  }
  if (body.passphrase.length > 50) {
    return '合言葉は50文字以内で入力してください'
  }
  if (!body.dateOptions || body.dateOptions.length === 0) {
    return '日程候補を1つ以上選択してください'
  }
  if (body.location && body.location.length > 200) {
    return '場所は200文字以内で入力してください'
  }
  return null
}

export async function POST(request: Request) {
  try {
    const body: CreateEventRequest = await request.json()

    // バリデーション
    const validationError = validateRequest(body)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const publicId = generatePublicId()

    // イベント作成
    const { data: event, error: eventError } = await getSupabase()
      .from('events')
      .insert({
        public_id: publicId,
        title: body.title.trim(),
        passphrase: body.passphrase,
        location: body.location?.trim() || null,
        description: body.description?.trim() || null,
      })
      .select('id')
      .single()

    if (eventError || !event) {
      console.error('Event creation failed:', eventError)
      // ロールバック不要（まだdate_optionsは作成していない）
      return NextResponse.json(
        { error: 'イベントの作成に失敗しました' },
        { status: 500 }
      )
    }

    // 日程候補作成
    const dateOptionsToInsert = body.dateOptions.map((option) => ({
      event_id: event.id,
      date: option.date,
      start_time: option.startTime || null,
      end_time: option.endTime || null,
      title: option.title || null,
    }))

    const { error: dateOptionsError } = await getSupabase()
      .from('date_options')
      .insert(dateOptionsToInsert)

    if (dateOptionsError) {
      console.error('Date options creation failed:', dateOptionsError)
      // ロールバック: 作成したイベントを削除
      await getSupabase().from('events').delete().eq('id', event.id)
      return NextResponse.json(
        { error: 'イベントの作成に失敗しました' },
        { status: 500 }
      )
    }

    // レスポンス
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const shareUrl = `${baseUrl}/e/${publicId}`

    return NextResponse.json(
      {
        publicId,
        shareUrl,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
