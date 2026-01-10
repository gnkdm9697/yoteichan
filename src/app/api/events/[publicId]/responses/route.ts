import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// リクエストボディの型
interface CreateResponseRequest {
  name: string
  answers: Record<string, 'ok' | 'maybe' | 'ng'>
}

// バリデーション
function validateRequest(body: CreateResponseRequest): string | null {
  if (!body.name || body.name.trim() === '') {
    return '名前は必須です'
  }
  if (body.name.length > 50) {
    return '名前は50文字以内で入力してください'
  }
  if (!body.answers || Object.keys(body.answers).length === 0) {
    return '回答は1つ以上必要です'
  }
  const validStatuses = ['ok', 'maybe', 'ng']
  for (const status of Object.values(body.answers)) {
    if (!validStatuses.includes(status)) {
      return '無効な回答ステータスです'
    }
  }
  return null
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params
    const body: CreateResponseRequest = await request.json()

    // バリデーション
    const validationError = validateRequest(body)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // イベント取得
    const { data: event, error: eventError } = await getSupabase()
      .from('events')
      .select('id')
      .eq('public_id', publicId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    const name = body.name.trim()

    // 既存回答を削除
    const { error: deleteError } = await getSupabase()
      .from('responses')
      .delete()
      .eq('event_id', event.id)
      .eq('name', name)

    if (deleteError) {
      console.error('Response deletion failed:', deleteError)
      return NextResponse.json(
        { error: '回答の保存に失敗しました' },
        { status: 500 }
      )
    }

    // 新しい回答を挿入
    const responsesToInsert = Object.entries(body.answers).map(
      ([dateOptionId, status]) => ({
        event_id: event.id,
        date_option_id: dateOptionId,
        name,
        status,
      })
    )

    const { error: insertError } = await getSupabase()
      .from('responses')
      .insert(responsesToInsert)

    if (insertError) {
      console.error('Response insertion failed:', insertError)
      return NextResponse.json(
        { error: '回答の保存に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
