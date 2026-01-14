import type { ResponseStatus } from '@/types';

// 回答データ
interface AnswerData {
  status: ResponseStatus;
  notes: string | null;
}

// 日程オプション
interface DateOption {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
}

// 参加者の回答
interface ResponseData {
  name: string;
  answers: Record<string, AnswerData>;
}

// 集計データ
interface SummaryData {
  ok: number;
  maybe: number;
  ng: number;
}

// CSV出力オプション
interface CsvExportOptions {
  eventTitle: string;
  dateOptions: DateOption[];
  responses: ResponseData[];
  summary: Record<string, SummaryData>;
}

// ステータス表示
const statusSymbols: Record<ResponseStatus, string> = {
  ok: '○',
  maybe: '△',
  ng: '×',
};

/**
 * CSVフィールドをエスケープ
 * カンマ、改行、ダブルクォートを含む場合はダブルクォートで囲む
 */
function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('\n') || field.includes('"')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * 日付を短縮形式にフォーマット（例: 1/8(水)）
 */
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  return `${month}/${day}(${weekday})`;
}

/**
 * 時間範囲をフォーマット
 */
function formatTimeRange(startTime: string | null, endTime: string | null): string {
  if (!startTime) return '終日';
  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    return `${parseInt(h)}:${m}`;
  };
  if (endTime) {
    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  }
  return formatTime(startTime);
}

/**
 * 回答セルの内容を生成
 */
function formatAnswerCell(answer: AnswerData | undefined): string {
  if (!answer) return '';
  const symbol = statusSymbols[answer.status];
  if (answer.notes) {
    return `${symbol}(${answer.notes})`;
  }
  return symbol;
}

/**
 * ファイル名をサニタイズ
 * ファイル名に使えない文字を除去
 */
function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim() || 'export';
}

/**
 * 回答データをCSV文字列に変換
 */
export function generateResponsesCsv(options: CsvExportOptions): string {
  const { dateOptions, responses, summary } = options;

  // ヘッダー行
  const headers = ['日程', '時間', 'タイトル', '○', '△', '×'];
  const participantNames = responses.map((r) => r.name);
  headers.push(...participantNames);

  // データ行
  const rows: string[][] = [];
  for (const option of dateOptions) {
    const counts = summary[option.id] || { ok: 0, maybe: 0, ng: 0 };
    const row = [
      formatDateShort(option.date),
      formatTimeRange(option.startTime, option.endTime),
      option.title || '',
      String(counts.ok),
      String(counts.maybe),
      String(counts.ng),
    ];

    // 各参加者の回答
    for (const response of responses) {
      const answer = response.answers[option.id];
      row.push(formatAnswerCell(answer));
    }

    rows.push(row);
  }

  // CSV生成（UTF-8 BOM付き）
  const BOM = '\uFEFF';
  const csvContent = [
    headers.map(escapeCSVField).join(','),
    ...rows.map((row) => row.map(escapeCSVField).join(',')),
  ].join('\r\n');

  return BOM + csvContent;
}

/**
 * CSVをダウンロード
 */
export function downloadCsv(content: string, eventTitle: string): void {
  const filename = `${sanitizeFilename(eventTitle)}_回答一覧.csv`;
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
