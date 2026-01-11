import { notFound } from 'next/navigation'
import { EventEditSection } from './EventEditSection'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { ResponseStatus } from '@/types'

// APIレスポンス型
interface DateOption {
  id: string
  date: string
  startTime: string | null
  endTime: string | null
  title: string | null
}

// 回答データ（ステータスと備考）
interface AnswerData {
  status: ResponseStatus
  notes: string | null
}

interface ResponseData {
  name: string
  answers: Record<string, AnswerData>
}

interface SummaryData {
  ok: number
  maybe: number
  ng: number
}

interface EventData {
  id: string
  publicId: string
  title: string
  location: string | null
  description: string | null
  dateOptions: DateOption[]
  responses: ResponseData[]
  summary: Record<string, SummaryData>
}

async function getEvent(publicId: string): Promise<EventData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/events/${publicId}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

interface PageProps {
  params: Promise<{ publicId: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { publicId } = await params
  const event = await getEvent(publicId)

  if (!event) {
    notFound()
  }

  return (
    <main className="flex-1 bg-[var(--bg-secondary)] py-10 relative">
      {/* テーマトグル */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto px-5">
        <EventEditSection
          eventId={event.publicId}
          event={{
            title: event.title,
            location: event.location,
            description: event.description,
            dateOptions: event.dateOptions,
            responses: event.responses,
            summary: event.summary,
          }}
        />
      </div>
    </main>
  )
}
