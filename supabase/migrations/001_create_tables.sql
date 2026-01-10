-- events テーブル
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(10) NOT NULL UNIQUE,
  passphrase VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- date_options テーブル
CREATE TABLE date_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- responses テーブル
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  date_option_id UUID NOT NULL REFERENCES date_options(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('ok', 'maybe', 'ng')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_date_options_event_id ON date_options(event_id);
CREATE INDEX idx_responses_event_id ON responses(event_id);
CREATE INDEX idx_responses_date_option_id ON responses(date_option_id);
CREATE INDEX idx_events_public_id ON events(public_id);

-- 同一イベントの同一名の回答は候補日ごとに1つ
CREATE UNIQUE INDEX idx_responses_unique ON responses(event_id, date_option_id, name);

-- RLS有効化
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（すべて公開）
CREATE POLICY "events_all" ON events FOR ALL USING (true);
CREATE POLICY "date_options_all" ON date_options FOR ALL USING (true);
CREATE POLICY "responses_all" ON responses FOR ALL USING (true);
