# 設計書: イベント編集時の回答リセット問題修正

## 現在の実装

### API処理フロー（PUT /api/events/[publicId]）

```
1. イベント基本情報を更新（title, location, description）
2. 既存のdate_optionsを全削除 ← 問題の原因
3. 新しいdate_optionsを挿入
4. CASCADE削除により全responsesが削除される
```

### 問題のコード

```typescript
// route.ts line 231-242
const { error: deleteOptionsError } = await getSupabase()
  .from('date_options')
  .delete()
  .eq('event_id', event.id)
```

## 修正方針

### 差分更新アプローチ

候補日を「全削除→全挿入」ではなく、差分で処理する。

```
1. イベント基本情報を更新
2. 既存の候補日IDリストを取得
3. 送信された候補日と比較
   - 既存IDあり → UPDATE（日時変更のみ）
   - 既存IDなし → INSERT（新規追加）
   - 送信になし → DELETE（削除された候補日）
4. 削除された候補日のresponsesのみCASCADE削除
```

## 実装設計

### 1. フロントエンド変更

#### DateOptionEditor.tsx

候補日に`id`フィールドを追加して、既存の候補日を識別できるようにする。

```typescript
interface DateOption {
  id?: string          // 既存の候補日はIDを持つ
  date: string
  startTime: string
  endTime: string
  title: string
}
```

#### EditForm.tsx

- 既存の候補日IDを保持
- 新規追加の候補日はIDなし
- 保存時にIDの有無で新規/既存を判別

### 2. バックエンド変更

#### PUT /api/events/[publicId]

```typescript
// 修正後の処理フロー
async function updateDateOptions(eventId: string, newOptions: DateOption[]) {
  // 1. 既存の候補日を取得
  const { data: existingOptions } = await getSupabase()
    .from('date_options')
    .select('id')
    .eq('event_id', eventId)

  const existingIds = new Set(existingOptions?.map(o => o.id) || [])
  const newIds = new Set(newOptions.filter(o => o.id).map(o => o.id))

  // 2. 削除する候補日（既存にあるが新しいリストにない）
  const toDelete = [...existingIds].filter(id => !newIds.has(id))
  if (toDelete.length > 0) {
    await getSupabase()
      .from('date_options')
      .delete()
      .in('id', toDelete)
  }

  // 3. 更新する候補日（既存にあり、新しいリストにもある）
  const toUpdate = newOptions.filter(o => o.id && existingIds.has(o.id))
  for (const opt of toUpdate) {
    await getSupabase()
      .from('date_options')
      .update({
        date: opt.date,
        start_time: opt.startTime || null,
        end_time: opt.endTime || null,
        title: opt.title || null,
      })
      .eq('id', opt.id)
  }

  // 4. 新規追加する候補日（IDなし）
  const toInsert = newOptions.filter(o => !o.id)
  if (toInsert.length > 0) {
    await getSupabase()
      .from('date_options')
      .insert(toInsert.map(opt => ({
        event_id: eventId,
        date: opt.date,
        start_time: opt.startTime || null,
        end_time: opt.endTime || null,
        title: opt.title || null,
      })))
  }
}
```

### 3. データフロー

```
EditForm
  ↓ dateOptions with id
DateOptionEditor
  ↓ 編集（id保持）
  ↓ 新規追加（idなし）
  ↓ 削除（リストから除外）
EditForm.handleSave()
  ↓ PUT with dateOptions (id付き)
API route.ts
  ↓ 差分計算
  ↓ DELETE/UPDATE/INSERT
Database
```

## 影響範囲

| ファイル | 変更内容 |
|---------|---------|
| `src/app/api/events/[publicId]/route.ts` | 差分更新ロジック実装 |
| `src/components/features/EditForm.tsx` | 候補日IDの保持と送信 |
| `src/components/features/DateOptionEditor.tsx` | 候補日IDの受け渡し |

## リスクと対策

| リスク | 対策 |
|-------|------|
| 既存データとの整合性 | IDがない候補日は新規扱いにする |
| パフォーマンス | 候補日数は通常少ないため問題なし |
| トランザクション | 失敗時はエラーを返し、部分更新を防ぐ |
