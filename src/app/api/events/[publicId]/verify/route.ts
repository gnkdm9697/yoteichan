import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

interface VerifyRequest {
  passphrase: string
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params

    // リクエストボディのパース
    const body: VerifyRequest = await request.json()

    // バリデーション
    if (!body.passphrase) {
      return NextResponse.json(
        { valid: false, error: '合言葉が必要です' },
        { status: 400 }
      )
    }

    // イベント取得（passphraseも含む）
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

    // 合言葉比較
    if (body.passphrase !== event.passphrase) {
      return NextResponse.json(
        { valid: false, error: '合言葉が違います' },
        { status: 401 }
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
