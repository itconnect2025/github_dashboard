import { useEffect, useState } from 'react'

interface HealthStatus {
  status: string
  timestamp: string
  uptime: number
  database: string
  environment: string
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">DevStats</h1>
        <p className="text-gray-400 mb-8">GitHub Development Statistics Dashboard</p>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Backend Health Check</h2>

          {loading && <p className="text-gray-400">Loading...</p>}

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded p-4">
              <p className="text-red-200">Error: {error}</p>
            </div>
          )}

          {health && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${health.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>
                  {health.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Database:</span>
                <span className={`font-semibold ${health.database === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                  {health.database}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Environment:</span>
                <span className="font-semibold">{health.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime:</span>
                <span className="font-semibold">{Math.floor(health.uptime)}s</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Phase 1: Basic Infrastructure - Complete ✅</p>
          <p className="mt-2">Next: Phase 2 - GitHub Integration</p>
        </div>
      </div>
    </div>
  )
}

export default App
