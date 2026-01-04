
import React, { useEffect, useRef, useState } from 'react'
import Wheel from './components/Wheel'
import WinnersSidebar from './components/WinnersSidebar'
import BouncingBall from './components/BouncingBall'
import VoiceControl from './components/VoiceControl'
import TermsConditions from './components/TermsConditions'
import PrivacyPolicy from './components/PrivacyPolicy'

const DEFAULT_NAMES = [
  'Shruti',
  'Naman',
  'Keta',
  'Kuldip',
  'Praful',
  'Viren',
  
]

type Winner = {
  name: string
  points: number
  count: number
}

export default function App() {
  const [namesText, setNamesText] = useState(DEFAULT_NAMES.join('\n'))
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES)
  const [spinnyWheelPlayers, setSpinnyWheelPlayers] = useState<string[]>(DEFAULT_NAMES)
  const [chosenOncePlayers, setChosenOncePlayers] = useState<string[]>(DEFAULT_NAMES)
  const [chosenHistory, setChosenHistory] = useState<string[]>([])
  const [mode, setMode] = useState<'points' | 'chosen'>('points')
  const [startKey, setStartKey] = useState(0)
  const [winners, setWinners] = useState<Winner[]>([])
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [showBounce, setShowBounce] = useState(false)
  const [selectedWheelName, setSelectedWheelName] = useState<string | null>(null)
  const [selectedWheelColor, setSelectedWheelColor] = useState<string | undefined>(undefined)
  const [namesLoaded, setNamesLoaded] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const startAudioRef = useRef<HTMLAudioElement | null>(null)

  const totalPlayers = spinnyWheelPlayers.length
  const chosenRemaining = chosenOncePlayers.length
  const chosenProgress = totalPlayers > 0 ? (totalPlayers - chosenRemaining) / totalPlayers : 0

  function loadNames() {
    const parsed = namesText
      .split(/[\,\n]+/)
      .map(s => s.trim())
      .filter(Boolean)
    if (parsed.length > 0) {
      setSpinnyWheelPlayers(parsed)
      setChosenOncePlayers(parsed)
      setChosenHistory([])
      setNames(mode === 'points' ? parsed : parsed)
    } else {
      setSpinnyWheelPlayers(DEFAULT_NAMES)
      setChosenOncePlayers(DEFAULT_NAMES)
      setChosenHistory([])
      setNames(mode === 'points' ? DEFAULT_NAMES : DEFAULT_NAMES)
    }
    setNamesLoaded(true)
  }

  function resetChosenOnce() {
    setChosenOncePlayers(spinnyWheelPlayers)
    setNames(spinnyWheelPlayers)
    setSelectedWheelName(null)
    setChosenHistory([])
    setShowBounce(false)
  }

  function startPlay() {
    // Initialize names once per session
    if (!namesLoaded) loadNames()
    setShowBounce(false)
    setSelectedName(null)
    
    // Create and start playing Runner.ogg with slow speed, gradually increasing
    // Create audio on button click to avoid autoplay policy issues
    if (!startAudioRef.current) {
      startAudioRef.current = new Audio('/sounds/Runner.ogg')
      startAudioRef.current.loop = true
      startAudioRef.current.volume = 0.3
    }
    
    console.log('🎵 Starting Runner.ogg audio')
    startAudioRef.current.playbackRate = 0.6 // Start slow
    startAudioRef.current.currentTime = 0
    startAudioRef.current.play()
      .then(() => {
        console.log('✅ Runner.ogg playing successfully')
        // Gradually increase playback rate over 2 seconds
        let rate = 0.6
        const interval = setInterval(() => {
          rate += 0.04 // Increment rate
          if (rate >= 1.0) {
            rate = 1.0
            clearInterval(interval)
          }
          if (startAudioRef.current) {
            startAudioRef.current.playbackRate = rate
          }
        }, 100) // Update every 100ms
      })
      .catch(err => console.log('❌ Start audio play failed:', err))
    
    setStartKey(k => k + 1)
  }

  function handleWinner(name: string) {
    console.log('🏆 handleWinner called with:', name)
    
    // Stop runner audio after each spin
    if (startAudioRef.current) {
      startAudioRef.current.pause()
      startAudioRef.current.currentTime = 0
    }
    
    setSelectedName(name)
    setShowBounce(true)

    if (mode === 'points') {
      // Points mode: update leaderboard
      setWinners(prev => {
        const existing = prev.find(w => w.name === name)
        const updated = existing
          ? prev.map(w =>
              w.name === name ? { ...w, points: w.points + 5, count: w.count + 1 } : w
            )
          : [...prev, { name, points: 5, count: 1 }]
        console.log('📊 Winners updated:', updated)
        return updated
      })
    } else {
      // Chosen Once mode: remove selected from the wheel list (no points)
      const remaining = chosenOncePlayers.filter(n => n !== name)
      setChosenOncePlayers(remaining)
      setNames(remaining)
      setChosenHistory(prev => [...prev, name])
    }

    // Hide bouncing ball after a short delay
    setTimeout(() => {
      setShowBounce(false)
    }, 1500)
  }

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return

      if (e.key.toLowerCase() === 's') {
        e.preventDefault()
        startPlay()
      }

      if (e.key.toLowerCase() === 'c') {
        e.preventDefault()
        if (mode !== 'chosen') setMode('chosen')
      }

      if (e.key.toLowerCase() === 'r') {
        e.preventDefault()
        if (mode === 'chosen') resetChosenOnce()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [mode, startPlay, resetChosenOnce])

  return (
    <div className="app-shell" style={{ display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #0a0606 0%, #1a0a0a 25%, #2d1515 50%, #4a1a1a 75%, #6b2020 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Cosmic dust effect */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.3), transparent), radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.2), transparent), radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.2), transparent), radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.3), transparent), radial-gradient(2px 2px at 90% 60%, rgba(255, 255, 255, 0.15), transparent), radial-gradient(1px 1px at 33% 50%, rgba(255, 255, 255, 0.2), transparent), radial-gradient(1px 1px at 10% 60%, rgba(255, 255, 255, 0.25), transparent), radial-gradient(2px 2px at 70% 15%, rgba(255, 255, 255, 0.2), transparent)',
        backgroundSize: '200% 200%',
        pointerEvents: 'none',
        opacity: 0.4,
        zIndex: 0
      }} />
      
      {/* Planetary element */}
      <div style={{
        position: 'absolute',
        bottom: '0px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(circle at 50% 100%, rgba(180, 160, 140, 0.4) 0%, rgba(140, 120, 100, 0.3) 30%, transparent 50%)',
        borderRadius: '50% 50% 0 0',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Snowball decorations near footer - left and right */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '24px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.95) 25%, rgba(235,235,235,0.9) 40%, rgba(210,210,210,0.85) 55%, rgba(180,180,180,0.75) 75%, rgba(150,150,150,0.6) 100%)`,
        boxShadow: 'inset -12px -18px 30px rgba(0,0,0,0.35), 0 10px 24px rgba(0,0,0,0.5)',
        filter: 'brightness(0.9)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      
      {/* Left Sidebar - Winners */}
      <WinnersSidebar
        className="sidebar"
        winners={mode === 'points' ? winners : chosenHistory.map((n, idx) => ({ name: n, points: 0, count: idx + 1 }))}
        showPoints={mode === 'points'}
      />

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <div className="grid-panels" style={{ display: 'grid', gridTemplateColumns: '1.2fr 220px', gap: 20, padding: 20, flex: 1 }}>
            {/* Wheel Section (middle) - header moved here and centered */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
              <h1 style={{ margin: 0, color: '#FFD700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 2px 4px rgba(0,0,0,0.8)' }}>🎡 FLS : Fun-Learn-Succeed</h1>
              {/* <div style={{ marginTop: 6, color: '#6c7a89', fontSize: 14, fontWeight: 600 }}>Fun-Learn-Succeed</div> */}
            </div>
            <Wheel
              names={names}
              startSignal={startKey}
              onWinner={handleWinner}
              onSelected={(name, color) => {
                setSelectedWheelName(name)
                setSelectedWheelColor(color)
              }}
            />
          </div>

          {/* Features / Input Section (right) */}
          <div style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', padding: 20, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '1px solid rgba(255, 215, 0, 0.2)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#FFD700', marginBottom: 12, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🎛️ Game Controls</div>
            {/* Mode Toggles inside Game Controls */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <button
                onClick={() => { setMode('points'); setNames(spinnyWheelPlayers); setSelectedWheelName(null); setShowBounce(false); }}
                aria-label="Switch to points mode"
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: mode === 'points' ? '2px solid rgba(255,215,0,0.8)' : '1px solid rgba(255,215,0,0.3)',
                  background: mode === 'points' ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 'rgba(0,0,0,0.4)',
                  color: mode === 'points' ? '#000' : '#FFD700',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                🎯 Spinny Wheels (Points)
              </button>
              <button
                onClick={() => { setMode('chosen'); setNames(chosenOncePlayers); setSelectedWheelName(null); setShowBounce(false); }}
                aria-label="Switch to chosen once mode (shortcut C)"
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: mode === 'chosen' ? '2px solid rgba(255,215,0,0.8)' : '1px solid rgba(255,215,0,0.3)',
                  background: mode === 'chosen' ? 'linear-gradient(135deg, rgba(255,215,0,0.85) 0%, rgba(255,165,0,0.85) 100%)' : 'rgba(0,0,0,0.4)',
                  color: mode === 'chosen' ? '#000' : '#FFD700',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                🔁 Chosen Once (No Repeat)
              </button>
            </div>
            {/* Show textarea and Load Names only when names are NOT yet loaded */}
            {!namesLoaded && (
              <>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#f0e6d2' }}>
                  Mock names (one per line or comma separated)
                </label>
                <textarea
                  value={namesText}
                  onChange={e => setNamesText(e.target.value)}
                  aria-label="Names input"
                  rows={8}
                  style={{
                    width: '100%',
                    padding: 10,
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: 6,
                    fontFamily: 'monospace',
                    fontSize: 14,
                    resize: 'none',
                    marginBottom: 12,
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: '#fff',
                  }}
                />
                <button
                  onClick={loadNames}
                  aria-label="Load names for the wheel"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                    color: '#000',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    borderRadius: 6,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 14,
                    marginBottom: 8,
                    boxShadow: '0 4px 15px rgba(218, 165, 32, 0.3)',
                  }}
                >
                  Load Names
                </button>
              </>
            )}

            {/* Always show Start Play button */}
            <button
              onClick={startPlay}
              aria-label={mode === 'points' ? 'Start play in points mode (shortcut S)' : 'Start play in chosen once mode (shortcut S)'}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                border: '2px solid rgba(255, 215, 0, 0.8)',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 16,
                marginBottom: namesLoaded ? 12 : 8,
                boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {mode === 'points' ? '🎮 Start Play (Points Mode)' : '🔁 Start Play (Chosen Once)'}
            </button>

            {mode === 'chosen' && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 6 }} aria-live="polite">
                  Users remaining: {chosenRemaining} / {totalPlayers || chosenRemaining}
                </div>
                <div
                  role="progressbar"
                  aria-label="Chosen once progress"
                  aria-valuemin={0}
                  aria-valuemax={totalPlayers || chosenRemaining}
                  aria-valuenow={totalPlayers - chosenRemaining}
                  style={{
                    width: '100%',
                    height: 12,
                    background: 'rgba(255, 215, 0, 0.15)',
                    borderRadius: 999,
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, Math.round(chosenProgress * 100)))}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                      transition: 'width 0.25s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Reset Chosen Once */}
            {mode === 'chosen' && (
              <button
                onClick={resetChosenOnce}
                aria-label="Reset chosen once list (shortcut R)"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#FFD700',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                🔄 Reset Chosen Once
              </button>
            )}

            {/* Voice Control */}
            <VoiceControl onVoiceCommand={startPlay} />

            {/* Selected Winner Display */}
            {selectedWheelName && (
              <div style={{
                marginTop: 16,
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                border: '2px solid rgba(255, 215, 0, 0.5)',
              }}>
                <div style={{ fontSize: '0.85em', color: '#FFD700', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🎉 Selected</div>
                <div style={{ 
                  fontSize: '1.4em', 
                  fontWeight: 800, 
                  color: '#FFD700',
                  marginTop: 6,
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                }}>
                  {selectedWheelName}
                </div>
              </div>
            )}

            {mode === 'chosen' && names.length === 0 && (
              <div style={{ marginTop: 12, color: '#FFD700', fontWeight: 700 }}>✔️ All users have been chosen</div>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '28px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <img src="/img/favicon.ico" alt="FLS wheel logo" style={{ width: 38, height: 38, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.35)' }} />
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#FFD700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>
              What You Get
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.12))', border: '1px solid rgba(255, 215, 0, 0.25)', boxShadow: '0 4px 18px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img src="/img/favicon.ico" alt="Dual modes icon" style={{ width: 28, height: 28 }} />
                <div style={{ fontWeight: 800, color: '#FFD700' }}>Dual Modes</div>
              </div>
              <div style={{ color: '#f0e6d2', fontSize: 14 }}>Spin with points leaderboard or one-and-done fairness with removal.</div>
            </div>
            <div style={{ padding: '16px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.12))', border: '1px solid rgba(255, 215, 0, 0.25)', boxShadow: '0 4px 18px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img src="/img/favicon.ico" alt="Fast load icon" style={{ width: 28, height: 28 }} />
                <div style={{ fontWeight: 800, color: '#FFD700' }}>Quick Participant Load</div>
              </div>
              <div style={{ color: '#f0e6d2', fontSize: 14 }}>Paste names (lines or commas), click Load Names, and everyone is instantly ready to play.</div>
            </div>
            <div style={{ padding: '16px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.12))', border: '1px solid rgba(255, 215, 0, 0.25)', boxShadow: '0 4px 18px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img src="/img/favicon.ico" alt="Control icon" style={{ width: 28, height: 28 }} />
                <div style={{ fontWeight: 800, color: '#FFD700' }}>Hands-On or Hands-Free</div>
              </div>
              <div style={{ color: '#f0e6d2', fontSize: 14 }}>Start via button, voice, or shortcut (S). Switch modes with C; reset chosen-once with R.</div>
            </div>
            <div style={{ padding: '16px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.12))', border: '1px solid rgba(255, 215, 0, 0.25)', boxShadow: '0 4px 18px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img src="/img/favicon.ico" alt="Scoreboard icon" style={{ width: 28, height: 28 }} />
                <div style={{ fontWeight: 800, color: '#FFD700' }}>Score & History</div>
              </div>
              <div style={{ color: '#f0e6d2', fontSize: 14 }}>Live leaderboard in points mode; ordered chosen-once history with bounce highlight.</div>
            </div>
            <div style={{ padding: '16px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.12))', border: '1px solid rgba(255, 215, 0, 0.25)', boxShadow: '0 4px 18px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img src="/img/favicon.ico" alt="Accessibility icon" style={{ width: 28, height: 28 }} />
                <div style={{ fontWeight: 800, color: '#FFD700' }}>Accessible by Design</div>
              </div>
              <div style={{ color: '#f0e6d2', fontSize: 14 }}>ARIA-labeled controls, polite updates, and a remaining-progress bar in chosen-once mode.</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          marginTop: '20px'
        }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 700, color: '#FFD700', textAlign: 'center', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>❓ Frequently Asked Questions</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* FAQ 1 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 215, 0, 0.2)'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700, color: '#FFD700' }}>🎡 What is the Wheel Spinner for?</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#f0e6d2', lineHeight: '1.8' }}>
                <li>Make random selection fun and engaging</li>
                <li>Fair and unbiased team selection</li>
                <li>Pick lucky winners from survey attendees during presentations</li>
                <li>Track performance with automatic leaderboard</li>
                <li>Voice control support for hands-free operation</li>
              </ul>
            </div>

            {/* FAQ 2 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 215, 0, 0.2)'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700, color: '#FFD700' }}>🎮 How to use the Wheel Spinner?</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#f0e6d2', lineHeight: '1.6' }}>
                <strong>Step 1:</strong> Enter names (one per line or comma-separated) in the text area on the right panel.
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#f0e6d2', lineHeight: '1.6' }}>
                <strong>Step 2:</strong> Click "Load Names" to save your team members.
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#f0e6d2', lineHeight: '1.6' }}>
                <strong>Step 3:</strong> Click "Start Play" or use voice commands to spin the wheel.
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#f0e6d2', lineHeight: '1.6' }}>
                <strong>Step 4:</strong> Watch the wheel spin and see who gets selected! The leaderboard on the left tracks wins.
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer style={{
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: '#f0e6d2',
          padding: '32px 20px 20px',
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 215, 0, 0.2)',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            maxWidth: '1200px',
            margin: '0 auto 24px'
          }}>
            {/* About Section */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#FFD700' }}>About FLS</div>
              <div style={{ fontSize: 14, color: '#cfc6b0' }}>
                Fun-Learn-Succeed Spinning Wheel - An interactive team picker game that makes selection fun and fair.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#FFD700' }}>Policies</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                <li style={{ marginBottom: '8px' }}>
                  <button onClick={() => setShowTerms(true)} style={{ background: 'none', border: 'none', color: '#ecf0f1', textDecoration: 'none', fontSize: '13px', cursor: 'pointer', padding: 0 }}>❓ FAQ</button>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <button onClick={() => setShowTerms(true)} style={{ background: 'none', border: 'none', color: '#ecf0f1', textDecoration: 'none', fontSize: '13px', cursor: 'pointer', padding: 0 }}>📜 Terms & Conditions</button>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <button onClick={() => setShowPrivacy(true)} style={{ background: 'none', border: 'none', color: '#ecf0f1', textDecoration: 'none', fontSize: '13px', cursor: 'pointer', padding: 0 }}>🔒 Privacy Policy</button>
                </li>
              </ul>
            </div>

            {/* Feedback */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#FFD700' }}>Contact</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="mailto:feedback@flswheel.com" style={{ color: '#cfc6b0', textDecoration: 'none', fontSize: '13px' }}>💬 Send Feedback</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="https://github.com/virennitkkr/SpinningWheel" target="_blank" rel="noopener noreferrer" style={{ color: '#cfc6b0', textDecoration: 'none', fontSize: '13px' }}>🌟 Star on GitHub</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: '1px solid rgba(255, 215, 0, 0.2)',
            paddingTop: '16px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#cfc6b0'
          }}>
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} FLS Spinning Wheel. Made with ❤️ for fun and learning.
            </p>
          </div>
        </footer>
      </div>
    </div>

      {/* Bouncing Ball */}
      <BouncingBall name={selectedName} isShowing={showBounce} />

      {/* Modals */}
      {showTerms && <TermsConditions onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </div>
  )
}
