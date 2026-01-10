import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import type { ResponseStatus, StatusCount } from '@/types'

// PUT リクエストボディ型
interface UpdateEventRequest {
  passphrase: string
  title: string
  location?: string
  description?: string
  dateOptions: {
    date: string
    startTime?: string | null
    endTime?: string | null
  }[]
}

// DELETE リクエストボディ型
interface DeleteEventRequest {
  passphrase: string
}

// 参加者の回答
interface ParticipantAnswers {
  name: string
  answers: Record<string, ResponseStatus>
}

// APIレスポンス型
interface EventResponse {
  id: string
  publicId: string
  title: string
  location: string | null
  description: string | null
  dateOptions: {
    id: string
    date: string
    startTime: string | null
    endTime: string | null
  }[]
  responses: ParticipantAnswers[]
  summary: Record<string, StatusCount>
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params

    // イベント取得
    const { data: event, error: eventError } = await getSupabase()
      .from('events')
      .select('id, public_id, title, location, description')
      .eq('public_id', publicId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    // 日程候補取得
    const { data: dateOptions, error: dateOptionsError } = await getSupabase()
      .from('date_options')
      .select('id, date, start_time, end_time')
      .eq('event_id', event.id)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: true })

    if (dateOptionsError) {
      console.error('Date options fetch failed:', dateOptionsError)
      return NextResponse.json(
        { error: 'イベントの取得に失敗しました' },
        { status: 500 }
      )
    }

    // 回答データ取得
    const { data: rawResponses, error: responsesError } = await getSupabase()
      .from('responses')
      .select('name, date_option_id, status')
      .eq('event_id', event.id)
      .order('name', { ascending: true })

    if (responsesError) {
      console.error('Responses fetch failed:', responsesError)
      return NextResponse.json(
        { error: 'イベントの取得に失敗しました' },
        { status: 500 }
      )
    }

    // 参加者ごとにグループ化
    const participantMap = new Map<string, Record<string, ResponseStatus>>()
    for (const r of rawResponses || []) {
      if (!participantMap.has(r.name)) {
        participantMap.set(r.name, {})
      }
      participantMap.get(r.name)![r.date_option_id] = r.status as ResponseStatus
    }
    const responses: ParticipantAnswers[] = Array.from(participantMap.entries()).map(
      ([name, answers]) => ({ name, answers })
    )

    // 集計計算
    const summary: Record<string, StatusCount> = {}
    for (const opt of dateOptions || []) {
      summary[opt.id] = { ok: 0, maybe: 0, ng: 0 }
    }
    for (const r of rawResponses || []) {
      const status = r.status as ResponseStatus
      if (summary[r.date_option_id]) {
        summary[r.date_option_id][status]++
      }
    }

    // レスポンス
    const response: EventResponse = {
      id: event.id,
      publicId: event.public_id,
      title: event.title,
      location: event.location,
      description: event.description,
      dateOptions: (dateOptions || []).map((opt) => ({
        id: opt.id,
        date: opt.date,
        startTime: opt.start_time,
        endTime: opt.end_time,
      })),
      responses,
      summary,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// イベント更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params
    const body: UpdateEventRequest = await request.json()

    // バリデーション
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'タイトルは必須です' },
        { status: 400 }
      )
    }
    if (!body.dateOptions || body.dateOptions.length === 0) {
      return NextResponse.json(
        { error: '日程候補を1つ以上指定してください' },
        { status: 400 }
      )
    }
    if (!body.passphrase) {
      return NextResponse.json(
        { error: '合言葉を入力してください' },
        { status: 400 }
      )
    }

    // イベント取得
    const { data: event, error: eventError } = await getSupabase()
      .from('events')
      .select('id, passphrase')
      .eq('public_id', publicId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    // 合言葉検証
    if (body.passphrase !== event.passphrase) {
      return NextResponse.json(
        { error: '合言葉が違います' },
        { status: 401 }
      )
    }

    // イベント更新
    const { error: updateError } = await getSupabase()
      .from('events')
      .update({
        title: body.title.trim(),
        location: body.location?.trim() || null,
        description: body.description?.trim() || null,
      })
      .eq('id', event.id)

    if (updateError) {
      console.error('Event update failed:', updateError)
      return NextResponse.json(
        { error: 'イベントの更新に失敗しました' },
        { status: 500 }
      )
    }

    // 既存の日程候補を削除
    const { error: deleteOptionsError } = await getSupabase()
      .from('date_options')
      .delete()
      .eq('event_id', event.id)

    if (deleteOptionsError) {
      console.error('Date options delete failed:', deleteOptionsError)
      return NextResponse.json(
        { error: '日程候補の更新に失敗しました' },
        { status: 500 }
      )
    }

    // 新しい日程候補を作成
    const dateOptionsToInsert = body.dateOptions.map((opt) => ({
      event_id: event.id,
      date: opt.date,
      start_time: opt.startTime || null,
      end_time: opt.endTime || null,
    }))

    const { error: insertOptionsError } = await getSupabase()
      .from('date_options')
      .insert(dateOptionsToInsert)

    if (insertOptionsError) {
      console.error('Date options insert failed:', insertOptionsError)
      return NextResponse.json(
        { error: '日程候補の作成に失敗しました' },
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

// イベント削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params
    const body: DeleteEventRequest = await request.json()

    // バリデーション
    if (!body.passphrase) {
      return NextResponse.json(
        { error: '合言葉を入力してください' },
        { status: 400 }
      )
    }

    // イベント取得
    const { data: event, error: eventError } = await getSupabase()
      .from('events')
      .select('id, passphrase')
      .eq('public_id', publicId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'イベントが見つかりません' },
        { status: 404 }
      )
    }

    // 合言葉検証
    if (body.passphrase !== event.passphrase) {
      return NextResponse.json(
        { error: '合言葉が違います' },
        { status: 401 }
      )
    }

    // イベント削除（CASCADEで関連データも削除される）
    const { error: deleteError } = await getSupabase()
      .from('events')
      .delete()
      .eq('id', event.id)

    if (deleteError) {
      console.error('Event delete failed:', deleteError)
      return NextResponse.json(
        { error: 'イベントの削除に失敗しました' },
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
