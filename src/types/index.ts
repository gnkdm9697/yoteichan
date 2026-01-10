/**
 * アプリケーション用型定義
 */

// 回答ステータス
export type ResponseStatus = 'ok' | 'maybe' | 'ng'

// イベント型
export interface Event {
  id: string
  publicId: string
  passphrase: string
  title: string
  location: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

// 日程候補型
export interface DateOption {
  id: string
  eventId: string
  date: Date
  startTime: string | null
  endTime: string | null
  title: string | null
  createdAt: Date
}

// 回答型
export interface Response {
  id: string
  eventId: string
  dateOptionId: string
  name: string
  status: ResponseStatus
  createdAt: Date
  updatedAt: Date
}

// イベント作成用入力型
export interface CreateEventInput {
  title: string
  location?: string
  description?: string
  dateOptions: CreateDateOptionInput[]
}

// 日程候補作成用入力型
export interface CreateDateOptionInput {
  date: Date
  startTime?: string
  endTime?: string
  title?: string
}

// 回答作成用入力型
export interface CreateResponseInput {
  eventId: string
  name: string
  responses: {
    dateOptionId: string
    status: ResponseStatus
  }[]
}

// イベント詳細（関連データ含む）
export interface EventWithDetails extends Event {
  dateOptions: DateOption[]
  responses: Response[]
}

// 1人の参加者の全回答
export interface ParticipantResponse {
  name: string
  answers: Record<string, ResponseStatus> // date_option_id -> status
}

// ステータス集計用
export interface StatusCount {
  ok: number
  maybe: number
  ng: number
}
