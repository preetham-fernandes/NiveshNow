'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function Research() {
  const [ticker, setTicker] = useState('') // Set to empty for placeholder
  const [period, setPeriod] = useState('1mo')
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStockData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${period}&interval=1d`
      )

      const result = response.data.chart.result[0]

      if (!result || !result.indicators || !result.indicators.quote || !result.indicators.quote[0]) {
        throw new Error('Invalid data format')
      }

      const prices = result.indicators.quote[0].close || []
      const dates = result.timestamp ? result.timestamp.map(ts => new Date(ts * 1000).toLocaleDateString()) : []

      if (prices.length === 0 || dates.length === 0) {
        throw new Error('No data available')
      }

      setChartData({
        labels: dates,
        datasets: [
          {
            label: `${ticker} Stock Price`,
            data: prices,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1
          }
        ]
      })
    } catch (error) {
      console.error('Error fetching stock data:', error)
      setError(error.message)
      setChartData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchStockData()
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${ticker} Stock Price`,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
  }

  return (
    <Card className="w-full max-w-full mx-auto mt-8"> {/* Spanning full width */}
      <CardHeader>
        <CardTitle className="text-2xl">Research Stock Data</CardTitle> {/* Increase font size */}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <Input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="" // Placeholder kept empty
              className="flex-grow text-lg" // Increased font size
            />
            <Select value={period} onValueChange={setPeriod} className="text-lg">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1w">Last Week</SelectItem>
                <SelectItem value="1mo">Last Month</SelectItem>
                <SelectItem value="3mo">Last 3 Months</SelectItem>
                <SelectItem value="6mo">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="2y">Last 2 Years</SelectItem>
                <SelectItem value="5y">Last 5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-gray-500 text-sm">*NOTE: add '.NS' suffix to research stocks from the Indian stock market
          </div>
          <Button type="submit" className="w-full text-lg" disabled={loading}>
            {loading ? 'Fetching Data...' : 'Fetch Data'}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {chartData && (
          <Card className="mt-8">
            <CardContent>
              <div className="h-[500px]"> {/* Increased chart height */}
                <Line options={chartOptions} data={chartData} />
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
