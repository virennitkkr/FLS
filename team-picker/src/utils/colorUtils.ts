export function generateColors(n: number): string[] {
  const colors: string[] = []
  for (let i = 0; i < n; i++) {
    const hue = Math.round((360 / n) * i)
    colors.push(`hsl(${hue} 70% 60%)`)
  }
  return colors
}

export function getWinnerColor(winnerName: string, names: string[]): string {
  if (names.length === 0) return '#f093fb'
  const idx = names.indexOf(winnerName)
  if (idx === -1) return '#f093fb'
  const colors = generateColors(names.length)
  return colors[idx]
}
