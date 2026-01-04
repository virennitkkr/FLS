
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Confetti from 'react-confetti'

type Props = {
  names: string[]
  startSignal?: number
  onWinner?: (name: string) => void
  onSelected?: (name: string | null, color?: string) => void
}

function generateColors(n: number) {
  // Spinning wheel colors pattern from the image
  const modernPalette = [
    '#FF6B7A',  // Coral Red
    '#FFFFFF',  // White
    '#89B5F5',  // Light Blue
    '#F4AF5A',  // Orange
    '#89B5F5',  // Light Blue
    '#FF6B7A',  // Coral Red
    '#FFFFFF',  // White
    '#FF6B7A',  // Coral Red
    '#F4AF5A',  // Orange
    '#89B5F5',  // Light Blue
    '#FFFFFF',  // White
    '#FF6B7A',  // Coral Red
  ]
  
  const colors: string[] = []
  for (let i = 0; i < n; i++) {
    colors.push(modernPalette[i % modernPalette.length])
  }
  return colors
}

export default function Wheel({ names = [], startSignal, onWinner, onSelected }: Props) {
  const namesSafe = useMemo(() => (names && names.length ? names : ['Game Over']), [names])
  const [selected, setSelected] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wheelSize, setWheelSize] = useState(460)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastStartSignalRef = useRef<number>(0)
  const onWinnerRef = useRef(onWinner)
  const timersRef = useRef<number[]>([])
  const spinAudioRef = useRef<HTMLAudioElement | null>(null)

  const colors = useMemo(() => generateColors(namesSafe.length), [namesSafe])

  // Initialize spinning and result audio
  useEffect(() => {
    spinAudioRef.current = new Audio('/sounds/Runner.ogg')
    spinAudioRef.current.loop = true
    spinAudioRef.current.volume = 0.3
    return () => {
      if (spinAudioRef.current) {
        spinAudioRef.current.pause()
        spinAudioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth || 0
      const target = Math.min(460, Math.max(260, Math.floor(width * 0.9)))
      setWheelSize(target)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Keep onWinner ref in sync
  useEffect(() => {
    onWinnerRef.current = onWinner
  }, [onWinner])

  useEffect(() => {
    // Only spin if startSignal is greater than the last one we processed
    if (startSignal == null || startSignal <= lastStartSignalRef.current) return
    if (namesSafe.length === 0) return

    // Update the ref to track this signal
    lastStartSignalRef.current = startSignal

    console.log('🎡 Wheel starting spin with signal:', startSignal, 'namesSafe:', namesSafe)

    // pick random index
    const idx = Math.floor(Math.random() * namesSafe.length)
    const winnerName = namesSafe[idx]
    const sliceAngle = 360 / namesSafe.length
    const centerAngle = idx * sliceAngle + sliceAngle / 2

    // spins and randomness - spin more for drama
    const spins = Math.floor(Math.random() * 5) + 8 // 8..12 spins for more spinning
    // Labels are positioned with -90 offset (angle - 90), so:
    // We need to rotate wheel so that: (centerAngle - 90) becomes 0 (top)
    // Which means: rotation = spins * 360 + (90 - centerAngle)
    const target = spins * 360 + (90 - centerAngle)

    // animate
    setSelected(null)
    if (onSelected) onSelected(null, undefined)
    setConfetti(false)

    // Ensure reset to zero has no animation, then re-enable animation for the spin
    setIsAnimating(false)
    setRotation(0)
    // use a slight delay to ensure re-render and CSS pickup
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setIsAnimating(true)
        setRotation(target)
      })
    )

    // duration proportional to spins (use fixed duration)
    const duration = 4 // Fixed 4 second spin

    console.log('🎡 Winner INDEX:', idx, 'Name:', winnerName)
    console.log('🎡 sliceAngle:', sliceAngle, 'centerAngle:', centerAngle)
    console.log('🎡 Spins:', spins, 'Target rotation:', target)
    console.log('🎡 Names:', namesSafe)

    const endTimer = window.setTimeout(() => {
      console.log('🏆 Spin ended, selected name is:', winnerName)
      console.log('🏆 Final rotation:', rotation, 'Modulo 360:', rotation % 360)
      
      // Play result sound (Runner.ogg is stopped in App component via onWinner callback)
      const resultAudio = new Audio('/sounds/Result.ogg')
      resultAudio.volume = 0.5
      resultAudio.play().catch(err => console.log('Result audio play failed:', err))
      
      setIsAnimating(false)
      setSelected(winnerName)
      if (onSelected) onSelected(winnerName, colors[idx])
      setConfetti(true)
      
      // Call onWinner callback using ref
      console.log('📞 About to call onWinner with:', winnerName, 'onWinner exists?', !!onWinnerRef.current)
      if (onWinnerRef.current) {
        console.log('📞 Calling onWinner callback with:', winnerName)
        try {
          onWinnerRef.current(winnerName)
          console.log('✅ onWinner callback executed successfully')
        } catch (err) {
          console.log('❌ Error calling onWinner:', err)
        }
      } else {
        console.log('⚠️ onWinner callback is not defined!')
      }
      
      // Audio playback handled by parent component (to avoid autoplay restrictions)
      console.log('🎵 Parent should handle audio playback for:', winnerName)
      
      setTimeout(() => setConfetti(false), 3500)
    }, duration * 1000)
    // keep timer id so it isn't cancelled by subsequent effect runs
    timersRef.current.push(endTimer)

    // NOTE: do NOT clear this timer here — if a new spin starts we still want
    // the previous spin to finish and call its winner callback. We'll clear
    // outstanding timers on component unmount instead.
  }, [startSignal, namesSafe])

  // cleanup all outstanding timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => clearTimeout(id))
      timersRef.current = []
    }
  }, [])

  // build conic-gradient background
  const sliceAngle = 360 / namesSafe.length
  const gradParts = namesSafe.map((_, i) => {
    const start = i * sliceAngle
    const end = start + sliceAngle
    return `${colors[i]} ${start}deg ${end}deg`
  })
  const gradient = `conic-gradient(${gradParts.join(', ')})`

  return (
    <div style={{ marginTop: 12 }} ref={containerRef}>
      <div style={{ padding: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #E8F4F8 0%, #B8D8E8 100%)' }}>
        {/* <div style={{ fontSize: 14, color: '#667eea', fontWeight: 600, marginBottom: 12 }}>🎯 FLS Spinning Wheel</div> */}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
          <div style={{ position: 'relative', width: wheelSize + 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {/* Top red pointer indicator */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -10,
                transform: 'translateX(-50%)',
                width: 20,
                height: 50,
                background: 'linear-gradient(180deg, #E74C3C 0%, #C0392B 100%)',
                clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                borderRadius: '8px 8px 0 0',
                zIndex: 30,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            ><div style={{
                position: 'absolute',
                left: '50%',
                top: 8,
                transform: 'translateX(-50%)',
                width: 16,
                height: 16,
                background: '#E74C3C',
                borderRadius: '50%',
                zIndex: 31,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }} />
            </div>

            {/* Blue rim with colored studs */}
            <div style={{
              position: 'relative',
              width: wheelSize,
              height: wheelSize,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2E86DE 0%, #1E5A9E 100%)',
              padding: 18,
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
            }}>
              {/* Colored studs around the rim */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 360) / 8
                const rad = (angle - 90) * (Math.PI / 180)
                const studRadius = (wheelSize - 22) / 2
                const x = wheelSize / 2 + Math.cos(rad) * studRadius
                const y = wheelSize / 2 + Math.sin(rad) * studRadius
                const studColors = ['#FF6B7A', '#F4AF5A', '#FF6B7A', '#F4AF5A', '#FF6B7A', '#F4AF5A', '#FF6B7A', '#F4AF5A']
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      transform: 'translate(-50%, -50%)',
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: studColors[i],
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.5)',
                    }}
                  />
                )
              })}

              {/* Inner wheel with segments */}
              <div
                style={{
                  width: wheelSize - 36,
                  height: wheelSize - 36,
                  borderRadius: '50%',
                  background: gradient,
                  transition: isAnimating ? 'transform 4s cubic-bezier(.17,.67,.12,1)' : 'none',
                  transform: `rotate(${rotation}deg)`,
                  position: 'relative',
                  boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.2), 0 8px 25px rgba(0,0,0,0.2)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 3D Segments with shadows and highlights */}
                {namesSafe.map((_, i) => {
                  const angle = i * sliceAngle
                  return (
                    <div
                      key={`segment-3d-${i}`}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '50%',
                        height: '50%',
                        transformOrigin: '0% 0%',
                        transform: `rotate(${angle}deg) skewY(0deg)`,
                        overflow: 'hidden',
                        pointerEvents: 'none',
                      }}
                    >
                      {/* 3D shadow overlay for depth */}
                      <div style={{
                        position: 'absolute',
                        width: '200%',
                        height: '200%',
                        background: `linear-gradient(${angle + 45}deg, rgba(0,0,0,0.15) 0%, transparent 30%, rgba(255,255,255,0.1) 70%, transparent 100%)`,
                        transformOrigin: '0% 0%',
                        pointerEvents: 'none',
                      }} />
                    </div>
                  )
                })}
                
                {/* Segment dividers with 3D effect */}
                {namesSafe.map((_, i) => {
                  const angle = i * sliceAngle
                  return (
                    <div
                      key={`divider-${i}`}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 3,
                        height: '50%',
                        background: 'linear-gradient(180deg, rgba(46, 134, 222, 0.9) 0%, rgba(46, 134, 222, 0.4) 100%)',
                        transformOrigin: '50% 0%',
                        transform: `rotate(${angle}deg)`,
                        boxShadow: '1px 0 3px rgba(0,0,0,0.3), -1px 0 3px rgba(255,255,255,0.2)',
                      }}
                    />
                  )
                })}

                {/* Text labels on segments */}
                {namesSafe.map((n, i) => {
                  const angle = i * sliceAngle + sliceAngle / 2
                  const rad = (angle - 90) * (Math.PI / 180)
                  const r = (wheelSize - 120) / 2
                  const x = (wheelSize - 36) / 2 + Math.cos(rad) * r
                  const y = (wheelSize - 36) / 2 + Math.sin(rad) * r
                  
                  // Text color based on segment background
                  const textColor = colors[i] === '#FFFFFF' ? '#E74C3C' : colors[i] === '#89B5F5' ? '#2E5090' : '#FFFFFF'
                  
                  // During animation: move to center, then fade out
                  const centerX = (wheelSize - 36) / 2
                  const centerY = (wheelSize - 36) / 2
                  const animX = isAnimating ? centerX : x
                  const animY = isAnimating ? centerY : y
                  
                  return (
                    <div
                      key={n}
                      style={{
                        position: 'absolute',
                        left: animX,
                        top: animY,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        pointerEvents: 'none',
                        textAlign: 'center',
                        color: textColor,
                        fontWeight: 700,
                        textShadow: colors[i] === '#FFFFFF' ? '0 1px 2px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.5)',
                        fontSize: '0.95em',
                        whiteSpace: 'nowrap',
                        width: 'auto',
                        opacity: isAnimating ? 0 : 1,
                        transition: isAnimating 
                          ? 'left 0.4s ease-in, top 0.4s ease-in, opacity 0.3s ease-out 0.3s'
                          : 'left 0.5s ease-out, top 0.5s ease-out, opacity 0.5s ease-in 0.3s',
                      }}
                    >
                      {n}
                    </div>
                  )
                })}

                {/* Blue center hub with white star */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2E86DE 0%, #1E5A9E 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4), inset 0 2px 6px rgba(255,255,255,0.3)',
                  }}
                >
                  <div style={{
                    fontSize: '2.5em',
                    color: '#FFFFFF',
                    textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  }}>
                    {isAnimating ? '⚡' : selected ? '✨' : '★'}
                  </div>
                </div>
              </div>
            </div>

            {/* Connection piece from wheel to base - positioned behind wheel */}
            <div style={{
              position: 'absolute',
              bottom: -25,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 49,
              height: 28,
              background: 'linear-gradient(180deg, #89B5F5 0%, #6B9FE8 100%)',
              borderRadius: '0 0 8px 8px',
              zIndex: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)',
            }} />
          </div>
          
          {/* Main base stand - wide rectangular platform below everything */}
          <div style={{
            marginTop: 10,
            width: 266,
            height: 38.5,
            background: 'linear-gradient(135deg, #2E86DE 0%, #1E5A9E 100%)',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35), inset 0 3px 8px rgba(255,255,255,0.2)',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Top highlight on base */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
              borderRadius: '14px 14px 0 0',
            }} />
            
            {/* Bottom shadow on base */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 100%)',
              borderRadius: '0 0 14px 14px',
            }} />
          </div>

          <div style={{ marginTop: 24, fontSize: 13, color: '#2E5090', textAlign: 'center', fontWeight: 500 }}>
            {namesSafe.length > 0 && <div>👥 {namesSafe.join(' • ')}</div>}
          </div>
        </div>
      </div>
      {confetti && <Confetti style={{ pointerEvents: 'none', zIndex: 5 }} />}
    </div>
  )
}
