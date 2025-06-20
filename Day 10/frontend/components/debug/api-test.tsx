"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api/client"

export function ApiTest() {
  const [email, setEmail] = useState("kishor@example.com")
  const [password, setPassword] = useState("123456")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const { toast } = useToast()

  const testLogin = async () => {
    setIsLoading(true)
    try {
      const result = await apiClient.login({ email, password })
      setResponse(result)
      toast({
        title: "Success",
        description: "API connection successful!",
      })
    } catch (error: any) {
      console.error("API Test Error:", error)
      setResponse({ error: error.message })
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
        <CardDescription>Test your API connection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="test-email">Email</Label>
          <Input id="test-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="test-password">Password</Label>
          <Input id="test-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button onClick={testLogin} disabled={isLoading} className="w-full">
          {isLoading ? "Testing..." : "Test Login API"}
        </Button>

        {response && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <h4 className="font-semibold mb-2">API Response:</h4>
            <pre className="text-xs overflow-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
