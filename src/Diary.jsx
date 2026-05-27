import { useState, useEffect } from 'react'

const MOODS = ['', '😞', '😕', '😐', '🙂', '😄']
const MOOD_LABELS = ['', 'Tough', 'Meh', 'Okay', 'Good', 'Great']

function loadDiary() {
  try {
    const saved = localStorage.getItem('diary')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function Diary({ morningRate, nightRate, streak }) {
  const [entries, setEntries] = useState(loadDiary)
  const [mood, setMood] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    localStorage.setItem('diary', JSON.stringify(entries))
  }, [entries])

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
  })

  function save() {
    if (!text.trim() && mood === 0) return
    const entry = {
      id: Date.now(),
      date: now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      mood: mood || 3,
      text: text.trim() || '(no text)',
      morningRate,
      nightRate,
    }
    setEntries([entry, ...entries])
    setText('')
    setMood(0)
  }

  return (
    <div>
      <div className="diary-header">
        <div className="diary-title">Today's Reflection</div>
        <div className="diary-date">{dateStr}</div>
      </div>

      <div className="mood-card">
        <div className="mood-label">How do you feel today?</div>
        <div className="mood-row">
          {[5, 4, 3, 2, 1].map(m => (
            <div
              key={m}
              className={`mood-btn ${mood === m ? 'selected' : ''}`}
              onClick={() => setMood(mood === m ? 0 : m)}
            >
              <div className="mood-emoji">{MOODS[m]}</div>
              <div className="mood-text">{MOOD_LABELS[m]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="diary-summary-card">
        <div className="diary-summary-label">Today's Achievement</div>
        <div className="diary-summary-row">
          <span>🌅 Morning <strong>{morningRate}%</strong></span>
          <span>🌙 Night <strong>{nightRate}%</strong></span>
          <span>🔥 <strong>{streak} day streak</strong></span>
        </div>
      </div>

      <textarea
        className="diary-textarea"
        placeholder="How was your day? Any habits you noticed, thoughts for tomorrow..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button className="diary-save-btn" onClick={save}>Save Entry</button>

      {entries.length > 0 && (
        <div className="diary-history">
          <div className="diary-history-title">Past Entries</div>
          {entries.map(e => (
            <div key={e.id} className="diary-entry">
              <div className="diary-entry-header">
                <div className="diary-entry-date">{e.date}</div>
                <div className="diary-entry-meta">
                  <span className="diary-entry-rates">🌅{e.morningRate}% 🌙{e.nightRate}%</span>
                  <span className="diary-entry-mood">{MOODS[e.mood]}</span>
                </div>
              </div>
              <div className="diary-entry-text">{e.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}