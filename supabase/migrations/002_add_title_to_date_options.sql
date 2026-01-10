-- 日程候補にタイトルカラムを追加
-- 用途: 複数日程のイベントで「Day1」「昼の部」などの識別用

ALTER TABLE date_options ADD COLUMN title TEXT;

COMMENT ON COLUMN date_options.title IS '日程候補のタイトル（任意）';
