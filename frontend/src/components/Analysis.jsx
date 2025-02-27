'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const RecommendationMeter = ({ score }) => {
  const percentage = score * 100
  const getColor = (score) => {
    if (score < 0.33) return 'bg-red-500'
    if (score < 0.66) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="w-full">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/20">
              Recommendation Score
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-primary">
              {score.toFixed(4)}
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondary">
          <div style={{ width: `${percentage}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getColor(score)}`}></div>
        </div>
      </div>
    </div>
  )
}

export default function RecommendationForm() {
  const [tickers, setTickers] = useState('')
  const [riskFreeRate, setRiskFreeRate] = useState(0.02)
  const [marketReturn, setMarketReturn] = useState(0.07)
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickers: tickers.split(',').map((t) => t.trim()),
          risk_free_rate: parseFloat(riskFreeRate),
          market_return: parseFloat(marketReturn),
        }),
      })

      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const prepareChartData = (value, label) => [
    { name: label, value: value }
  ]

  return (
    <div className="min-h-screen w-full p-6 flex justify-center items-start bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-6xl mx-auto p-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Stock Recommendation</CardTitle>
          <CardDescription className="text-lg">Enter stock tickers and parameters to get recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tickers">Stock Tickers</Label>
              <Input
                id="tickers"
                type="text"
                value={tickers}
                onChange={(e) => setTickers(e.target.value)}
                placeholder="Enter tickers, e.g., AAPL, MSFT"
                required
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="riskFreeRate">Risk-Free Rate</Label>
                <Input
                  id="riskFreeRate"
                  type="number"
                  value={riskFreeRate}
                  onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
                  step="0.01"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketReturn">Market Return</Label>
                <Input
                  id="marketReturn"
                  type="number"
                  value={marketReturn}
                  onChange={(e) => setMarketReturn(parseFloat(e.target.value))}
                  step="0.01"
                  className="w-full"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Getting Recommendations...' : 'Get Recommendation'}
            </Button>
          </form>
          {recommendations && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((r) => (
                  <Card key={r.ticker} className="overflow-hidden">
                    <CardHeader className="bg-primary/10">
                      <CardTitle>{r.ticker}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Tabs defaultValue="charts" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="charts">Charts</TabsTrigger>
                          <TabsTrigger value="details">Details</TabsTrigger>
                        </TabsList>
                        <TabsContent value="charts">
                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <ChartContainer
                              config={{
                                capm: {
                                  label: "CAPM Return",
                                  color: "hsl(var(--primary))",
                                },
                              }}
                              className="h-48"
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={prepareChartData(r.capm_return, 'CAPM Return')}>
                                  <XAxis dataKey="name" />
                                  <YAxis domain={[-5, 25]} tickFormatter={(value) => `${value}%`} />
                                  <ChartTooltip content={<ChartTooltipContent />} />
                                  <Bar dataKey="value" fill="var(--color-capm)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </ChartContainer>
                            <ChartContainer
                              config={{
                                sharpe: {
                                  label: "Sharpe Ratio",
                                  color: "hsl(var(--secondary))",
                                },
                              }}
                              className="h-48"
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={prepareChartData(r.sharpe_ratio, 'Sharpe Ratio')}>
                                  <XAxis dataKey="name" />
                                  <YAxis domain={[-1, 4]} />
                                  <ChartTooltip content={<ChartTooltipContent />} />
                                  <Bar dataKey="value" fill="var(--color-sharpe)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </ChartContainer>
                          </div>
                        </TabsContent>
                        <TabsContent value="details">
                          <div className="space-y-2">
                            <p><strong>CAPM Return:</strong> {r.capm_return.toFixed(4)}</p>
                            <p><strong>Sharpe Ratio:</strong> {r.sharpe_ratio.toFixed(4)}</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <div className="mt-4">
                        <RecommendationMeter score={r.recommendation_score} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}