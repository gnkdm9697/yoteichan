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
    id?: string // 既存の候補日はIDを持つ
    date: string
    startTime?: string | null
    endTime?: string | null
    title?: string | null
  }[]
}

// DELETE リクエストボディ型
interface DeleteEventRequest {
  passphrase: string
}

// 回答データ（ステータスと備考）
interface AnswerData {
  status: ResponseStatus
  notes: string | null
}

// 参加者の回答
interface ParticipantAnswers {
  name: string
  answers: Record<string, AnswerData>
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
    title: string | null
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
      .select('id, date, start_time, end_time, title')
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
      .select('name, date_option_id, status, notes')
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
    const participantMap = new Map<string, Record<string, AnswerData>>()
    for (const r of rawResponses || []) {
      if (!participantMap.has(r.name)) {
        participantMap.set(r.name, {})
      }
      participantMap.get(r.name)![r.date_option_id] = {
        status: r.status as ResponseStatus,
        notes: r.notes,
      }
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
        title: opt.title,
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

    // 既存の日程候補IDを取得
    const { data: existingOptions, error: fetchOptionsError } = await getSupabase()
      .from('date_options')
      .select('id')
      .eq('event_id', event.id)

    if (fetchOptionsError) {
      console.error('Date options fetch failed:', fetchOptionsError)
      return NextResponse.json(
        { error: '日程候補の取得に失敗しました' },
        { status: 500 }
      )
    }

    const existingIds = new Set(existingOptions?.map((o) => o.id) || [])
    const newIds = new Set(body.dateOptions.filter((o) => o.id).map((o) => o.id))

    // 削除する候補日（既存にあるが新しいリストにない）
    const toDelete = [...existingIds].filter((id) => !newIds.has(id))
    if (toDelete.length > 0) {
      const { error: deleteError } = await getSupabase()
        .from('date_options')
        .delete()
        .in('id', toDelete)

      if (deleteError) {
        console.error('Date options delete failed:', deleteError)
        return NextResponse.json(
          { error: '日程候補の削除に失敗しました' },
          { status: 500 }
        )
      }
    }

    // 更新する候補日（既存にあり、新しいリストにもある）
    const toUpdate = body.dateOptions.filter((o) => o.id && existingIds.has(o.id))
    for (const opt of toUpdate) {
      const { error: updateOptError } = await getSupabase()
        .from('date_options')
        .update({
          date: opt.date,
          start_time: opt.startTime || null,
          end_time: opt.endTime || null,
          title: opt.title || null,
        })
        .eq('id', opt.id!)

      if (updateOptError) {
        console.error('Date option update failed:', updateOptError)
        return NextResponse.json(
          { error: '日程候補の更新に失敗しました' },
          { status: 500 }
        )
      }
    }

    // 新規追加する候補日（IDなし）
    const toInsert = body.dateOptions.filter((o) => !o.id)
    if (toInsert.length > 0) {
      const dateOptionsToInsert = toInsert.map((opt) => ({
        event_id: event.id,
        date: opt.date,
        start_time: opt.startTime || null,
        end_time: opt.endTime || null,
        title: opt.title || null,
      }))

      const { error: insertError } = await getSupabase()
        .from('date_options')
        .insert(dateOptionsToInsert)

      if (insertError) {
        console.error('Date options insert failed:', insertError)
        return NextResponse.json(
          { error: '日程候補の作成に失敗しました' },
          { status: 500 }
        )
      }
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
