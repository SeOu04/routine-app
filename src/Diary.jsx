import { useState, useEffect } from 'react'

const MOODS = ['', '😞', '😕', '😐', '🙂', '😄']
const MOOD_LABELS = ['', 'Tough', 'Meh', 'Okay', 'Good', 'Great']

const DIARY_RANKS = [
  { min: 0,  icon: '📔', name: 'Newcomer',     color: '#78716C' },
  { min: 3,  icon: '✍️',  name: 'Journaler',    color: '#A8A29E' },
  { min: 7,  icon: '📖', name: 'Story Keeper', color: '#60A5FA' },
  { min: 14, icon: '🖊️', name: 'Chronicler',   color: '#34D399' },
  { min: 30, icon: '📜', name: 'Sage Writer',  color: '#FB923C' },
  { min: 60, icon: '🏆', name: 'Legendary',    color: '#FBBF24' },
]

function getDiaryRank(count) {
  let r = DIARY_RANKS[0]
  for (const dr of DIARY_RANKS) if (count >= dr.min) r = dr
  return r
}

function loadDiary() {
  try {
    const saved = localStorage.getItem('diary')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function highlight(text, query) {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark key=${i} style="background:#FB923C;color:#1C1917;border-radius:3px;padding:0 2px">${part}</mark>`
      : part
  ).join('')
}

function DiaryEntryCard({ entry, query }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = entry.text.length > 60
  const preview = isLong && !expanded ? entry.text.slice(0, 60) + '...' : entry.text
  const highlightedText = highlight(preview, query)

  return (
    <div className="diary-entry" onClick={() => isLong && setExpanded(!expanded)}>
      <div className="diary-entry-header">
        <div className="diary-entry-date-time">
          <div className="diary-entry-date">{entry.date}</div>
          {entry.time && <div className="diary-entry-time">{entry.time}</div>}
        </div>
        <div className="diary-entry-meta">
          <span className="diary-entry-rates">🌅{entry.morningRate}% 🌙{entry.nightRate}%</span>
          <span className="diary-entry-mood">{MOODS[entry.mood]}</span>
        </div>
      </div>
      <div
        className="diary-entry-text"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />
      {isLong && (
        <div className="diary-entry-toggle">{expanded ? 'Show less ▲' : 'Read more ▼'}</div>
      )}
    </div>
  )
}

export default function Diary({ morningRate, nightRate, streak }) {
  const [entries, setEntries] = useState(loadDiary)
  const [mood, setMood] = useState(0)
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('diary', JSON.stringify(entries))
  }, [entries])

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
  })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const rank = getDiaryRank(entries.length)

  const filteredEntries = query.trim()
    ? entries.filter(e => e.text.toLowerCase().includes(query.toLowerCase()))
    : entries

  function save() {
    if (!text.trim() && mood === 0) return
    const entry = {
      id: Date.now(),
      date: now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      time: timeStr,
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

      <div className="diary-rank-card">
        <div className="diary-rank-left">
          <div className="diary-rank-icon">{rank.icon}</div>
          <div>
            <div className="diary-rank-label">Diary Rank</div>
            <div className="diary-rank-name" style={{ color: rank.color }}>{rank.name}</div>
          </div>
        </div>
        <div className="diary-rank-right">
          <div className="diary-rank-count" style={{ color: rank.color }}>{entries.length}</div>
          <div className="diary-rank-sub">entries</div>
        </div>
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
      <div className="diary-time-note">Will be saved at {timeStr}</div>

      <button className="diary-save-btn" onClick={save}>Save Entry</button>

      {entries.length > 0 && (
        <div className="diary-history">
          <div className="diary-history-title">
            Past Entries
            <span className="diary-no-delete">🔒 permanent</span>
          </div>

          <div className="diary-search-wrap">
            <input
              type="text"
              className="diary-search"
              placeholder="🔍 Search entries..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <div className="diary-search-result">
                {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>

          {filteredEntries.length === 0 && (
            <div className="diary-no-results">No entries match "{query}"</div>
          )}

          {filteredEntries.map(e => (
            <DiaryEntryCard key={e.id} entry={e} query={query} />
          ))}
        </div>
      )}
    </div>
  )
}