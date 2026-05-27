import { useState, useEffect } from 'react'
import './App.css'
import Weather from './Weather'
import Diary from './Diary'

const TITLES = [
  { minStreak: 0,   icon: '🌱', name: 'Beginner',     desc: 'Keep going for 3 days!' },
  { minStreak: 3,   icon: '🔥', name: '3-Day Flame',  desc: 'Reach 7 days next!' },
  { minStreak: 7,   icon: '⚡', name: 'Week Warrior', desc: 'Aim for 30 days!' },
  { minStreak: 14,  icon: '💪', name: 'Steadfast',    desc: 'Almost at 30 days!' },
  { minStreak: 30,  icon: '🏆', name: 'Habit Master', desc: 'You are unstoppable!' },
  { minStreak: 60,  icon: '👑', name: 'Legend',       desc: 'Truly legendary!' },
  { minStreak: 100, icon: '🌟', name: '100-Day King', desc: '100 days achieved!' },
]

const DEFAULT_HABITS = {
  morning: [
    { id: 1, text: 'Water', time: '07:00', done: false },
    { id: 2, text: 'Stretch', time: '07:15', done: false },
    { id: 3, text: 'Check tasks', time: '07:30', done: false },
  ],
  night: [
    { id: 4, text: 'Prepare tomorrow', time: '22:00', done: false },
    { id: 5, text: 'Put down phone', time: '22:30', done: false },
  ]
}

function getTitle(streak) {
  let t = TITLES[0]
  for (const tt of TITLES) if (streak >= tt.minStreak) t = tt
  return t
}

function load(key, fallback) {
  try {
    const s = localStorage.getItem(key)
    return s ? JSON.parse(s) : fallback
  } catch { return fallback }
}

export default function App() {
  const [page, setPage] = useState('home')
  const [tab, setTab] = useState('morning')
  const [habits, setHabits] = useState(() => load('habits', DEFAULT_HABITS))
  const [streak] = useState(() => load('streak', 1))
  const [input, setInput] = useState('')
  const [time, setTime] = useState('07:00')

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const currentHabits = habits[tab]
  const title = getTitle(streak)

  function addHabit() {
    if (!input.trim()) return
    const newHabit = { id: Date.now(), text: input, time, done: false }
    setHabits({
      ...habits,
      [tab]: [...habits[tab], newHabit].sort((a, b) => a.time.localeCompare(b.time))
    })
    setInput('')
  }

  function toggleHabit(id) {
    setHabits({
      ...habits,
      [tab]: habits[tab].map(h => h.id === id ? { ...h, done: !h.done } : h)
    })
  }

  function deleteHabit(id) {
    setHabits({
      ...habits,
      [tab]: habits[tab].filter(h => h.id !== id)
    })
  }

  const morningRate = habits.morning.length
    ? Math.round(habits.morning.filter(h => h.done).length / habits.morning.length * 100) : 0
  const nightRate = habits.night.length
    ? Math.round(habits.night.filter(h => h.done).length / habits.night.length * 100) : 0

  return (
    <div className="app">
      <nav className="nav">
        <button className={page === 'home'  ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('home')}>Home</button>
        <button className={page === 'stats' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('stats')}>Stats</button>
        <button className={page === 'diary' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('diary')}>Diary</button>
        <button className={page === 'badge' ? 'nav-btn active' : 'nav-btn'} onClick={() => setPage('badge')}>Badge</button>
      </nav>

      <div className="page">
        {page === 'home' && (
          <div>
            <Weather />
            <div className="title-card">
              <div className="title-icon">{title.icon}</div>
              <div className="title-text">
                <div className="title-label">Current Title</div>
                <div className="title-name">{title.name}</div>
                <div className="title-desc">{title.desc}</div>
              </div>
              <div className="streak-box">
                <div className="streak-num">{streak}</div>
                <div className="streak-label">day streak</div>
              </div>
            </div>

            <div className="tabs">
              <button className={tab === 'morning' ? 'tab active' : 'tab'} onClick={() => { setTab('morning'); setTime('07:00') }}>Morning</button>
              <button className={tab === 'night'   ? 'tab active' : 'tab'} onClick={() => { setTab('night');   setTime('22:00') }}>Night</button>
            </div>

            <div className="add-row">
              <input type="text" className="add-input" placeholder="Add habit..." value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()} />
              <input type="time" className="add-time" value={time} onChange={e => setTime(e.target.value)} />
              <button className="add-btn" onClick={addHabit}>+</button>
            </div>

            <div className="habit-list">
              {currentHabits.length === 0 && <div className="empty">No habits yet</div>}
              {currentHabits.map(h => (
                <div key={h.id} className="habit-item">
                  <button className={h.done ? 'check-btn done' : 'check-btn'} onClick={() => toggleHabit(h.id)}>
                    {h.done && (
                      <svg viewBox="0 0 12 12" fill="none" width="11" height="11">
                        <polyline points="1.5,6 5,9.5 10.5,2.5" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    )}
                  </button>
                  <div className="habit-info" onClick={() => toggleHabit(h.id)}>
                    <div className={h.done ? 'habit-name done' : 'habit-name'}>{h.text}</div>
                    <div className="habit-time">{h.time}</div>
                  </div>
                  <button className="delete-btn" onClick={() => deleteHabit(h.id)}>x</button>
                </div>
              ))}
            </div>

            <div className="stats-card">
              <div className="stats-label">Today</div>
              <div className="stats-row">
                <div className="stat"><div className="stat-val">{morningRate}%</div><div className="stat-sub">Morning</div></div>
                <div className="stat-div"></div>
                <div className="stat"><div className="stat-val">{nightRate}%</div><div className="stat-sub">Night</div></div>
                <div className="stat-div"></div>
                <div className="stat"><div className="stat-val">{streak}</div><div className="stat-sub">🔥 streak</div></div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: Math.round((morningRate + nightRate) / 2) + '%' }}></div>
              </div>
            </div>
          </div>
        )}

        {page === 'stats' && <div className="page-title">Stats coming soon</div>}
        {page === 'diary' && <Diary morningRate={morningRate} nightRate={nightRate} streak={streak} />}
        {page === 'badge' && <div className="page-title">Badges coming soon</div>}
      </div>
    </div>
  )
}