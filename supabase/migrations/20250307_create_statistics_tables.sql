-- Ziyaretçi sayılarını tutacak tablo
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beğenileri tutacak tablo
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İstatistik görünümü
CREATE OR REPLACE VIEW statistics AS
SELECT
  (SELECT COUNT(*) FROM questions) AS total_questions,
  (SELECT SUM(count) FROM visitors) AS total_visitors,
  (SELECT COUNT(*) FROM likes) AS total_likes;

-- İndeksler
CREATE INDEX IF NOT EXISTS visitors_date_idx ON visitors(date);
CREATE INDEX IF NOT EXISTS likes_question_id_idx ON likes(question_id);
