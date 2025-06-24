"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugAPI() {
  const [apiUrl, setApiUrl] = useState("")
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get the API URL from environment variable
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")
  }, [])

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(apiUrl + "/health-check/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      setTestResult(data)
    } catch (err: any) {
      console.error("API test failed:", err)
      setError(err.message || "Failed to connect to API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>API Connection Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">API URL:</p>
            <code className="bg-muted p-2 rounded block">{apiUrl}</code>
          </div>

          <Button onClick={testConnection} disabled={loading} className="w-full">
            {loading ? "Testing Connection..." : "Test API Connection"}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
              <div className="mt-2">
                <p className="font-bold">Troubleshooting:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Is your Django server running?</li>
                  <li>Is CORS properly configured in Django?</li>
                  <li>Is the API URL correct?</li>
                  <li>Is there a network firewall blocking requests?</li>
                </ul>
              </div>
            </div>
          )}

          {testResult && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
              <p className="font-bold">Success!</p>
              <p>API connection established.</p>
              <div className="mt-2">
                <p className="font-bold">Response:</p>
                <pre className="bg-muted p-2 rounded text-sm overflow-auto max-h-40">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
