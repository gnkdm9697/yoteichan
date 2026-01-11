-- 回答に備考フィールドを追加
-- 回答者が「遅れます」「午後から参加」などのメモを入力できるようにする

ALTER TABLE responses ADD COLUMN notes TEXT DEFAULT NULL;
