import React from 'react'

type Winner = {
  name: string
  points: number
  count: number
}

type Props = {
  winners: Winner[]
  showPoints?: boolean
}

export default function WinnersSidebar({ winners, showPoints = true }: Props) {
  const sortedWinners = showPoints ? [...winners].sort((a, b) => b.points - a.points) : winners

  return (
    <div
      style={{
        width: 220,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 215, 0, 0.2)',
        padding: 20,
        overflowY: 'auto',
        maxHeight: '100vh',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#FFD700', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
        🏆 Score Central
      </div>

      {sortedWinners.length === 0 ? (
        <div style={{ color: '#f0e6d2', fontSize: 14 }}>No winners yet</div>
      ) : (
        <div>
          {sortedWinners.map((winner, idx) => (
            <div
              key={winner.name}
              style={{
                padding: 12,
                marginBottom: 8,
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                borderLeft: `4px solid ${['#ffc107', '#c0c0c0', '#cd7f32'][idx] || '#FFD700'}`,
                border: '1px solid rgba(255, 215, 0, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, color: '#f0e6d2', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {idx === 0 && '🥇 '}{idx === 1 && '🥈 '}{idx === 2 && '🥉 '}
                  {winner.name}
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#f8f1e1', marginTop: 4 }}>
                {showPoints ? (
                  <>
                    {winner.count} {winner.count === 1 ? 'win' : 'wins'} • <strong>{winner.points} pts</strong>
                  </>
                ) : (
                  <>Rank #{winner.count} • Chosen Once</>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
