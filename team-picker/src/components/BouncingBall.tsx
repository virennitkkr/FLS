import React, { useEffect, useState } from 'react'

type Props = {
  name: string | null
  isShowing: boolean
}

export default function BouncingBall({ name, isShowing }: Props) {
  const [ballStyle, setBallStyle] = useState<React.CSSProperties>({
    opacity: 0,
  })

  useEffect(() => {
    if (!isShowing || !name) {
      setBallStyle({ opacity: 0 })
      return
    }

    // Animate ball bounce-in
    setBallStyle({
      opacity: 1,
    })
  }, [isShowing, name])

  if (!isShowing || !name) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes bounce {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes bounce-loop {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-30px);
          }
        }

        .bouncing-ball {
          animation: bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
                    bounce-loop 0.8s ease-in-out 0.6s infinite;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 32px;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
          text-align: center;
          padding: 20px;
          word-wrap: break-word;
        }
      `}</style>
      <div className="bouncing-ball">{name}</div>
    </div>
  )
}
