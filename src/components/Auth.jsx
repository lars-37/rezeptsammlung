import { useState } from 'react'

export default function Auth({ onLogin, signIn, signUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password)
        setMessage('Registrierung erfolgreich! Prüfe deine E-Mails zur Bestätigung.')
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-ci-600 text-center mb-2">Rezeptsammlung</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          {isSignUp ? 'Neuen Account erstellen' : 'Anmelden'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ci-300"
              placeholder="deine@email.de"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ci-300"
              placeholder="Mindestens 6 Zeichen"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
          {message && <p className="text-green-600 text-sm bg-green-50 p-2 rounded">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ci-500 text-white py-2 rounded-lg hover:bg-ci-600 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? '...' : isSignUp ? 'Registrieren' : 'Anmelden'}
          </button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
          className="w-full text-center text-sm text-ci-500 hover:text-ci-700 mt-4"
        >
          {isSignUp ? 'Bereits einen Account? → Anmelden' : 'Noch keinen Account? → Registrieren'}
        </button>
      </div>
    </div>
  )
}
