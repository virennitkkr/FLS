import React, { useEffect, useState, useRef } from 'react'

type Props = {
  onVoiceCommand: () => void
}

export default function VoiceControl({ onVoiceCommand }: Props) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const recognitionRef = useRef<any>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Check browser support for Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      console.log('🎤 Speech Recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      console.log('🎤 Listening...')
      setIsListening(true)
      setError('')
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      const fullText = (finalTranscript || interimTranscript).toLowerCase().trim()
      setTranscript(fullText)

      console.log('🎤 Heard:', fullText)

      // Check for "start the game" or similar commands
      if (
        finalTranscript &&
        (fullText.includes('start the game') ||
          fullText.includes('start game') ||
          fullText.includes("let's start the game") ||
          fullText.includes("let's start") ||
          fullText.includes('select the lucky winner') ||
          fullText.includes('select lucky winner') ||
          fullText.includes('pick the winner') ||
          fullText.includes('pick winner') ||
          fullText.includes('begin') ||
          fullText === 'start')
      ) {
        console.log('🎤 Voice command detected! Starting game...')
        setTranscript('Command detected! ✅')
        onVoiceCommand()
        // Stop listening after command
        setTimeout(() => {
          recognition.stop()
        }, 500)
      }
    }

    recognition.onerror = (event: any) => {
      console.log('🎤 Speech recognition error:', event.error)
      setError(`Error: ${event.error}`)
    }

    recognition.onend = () => {
      console.log('🎤 Stopped listening')
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [onVoiceCommand])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setError('')
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  if (!isSupported) {
    return null // Voice not supported, don't show button
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={startListening}
          disabled={isListening}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: isListening ? '#e74c3c' : '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: isListening ? 'not-allowed' : 'pointer',
            fontSize: 12,
            opacity: isListening ? 0.7 : 1,
          }}
        >
          {isListening ? '🎤 Listening...' : '🎤 Start Listening'}
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: '#95a5a6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: !isListening ? 'not-allowed' : 'pointer',
            fontSize: 12,
            opacity: !isListening ? 0.5 : 1,
          }}
        >
          Stop Listening
        </button>
      </div>
      {transcript && (
        <div
          style={{
            marginTop: 8,
            padding: 8,
            backgroundColor: '#ecf0f1',
            borderRadius: 6,
            fontSize: 12,
            color: '#2c3e50',
            fontWeight: 500,
          }}
        >
          Heard: "{transcript}"
        </div>
      )}
      {error && (
        <div
          style={{
            marginTop: 8,
            padding: 8,
            backgroundColor: '#fadbd8',
            borderRadius: 6,
            fontSize: 12,
            color: '#c0392b',
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
