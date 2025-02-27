'use client'

import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

Chart.register(...registerables)

const API_KEY = 'e8f295e14c1f13fd4cae2b5b' // Replace with your actual API key

export default function Compare() {
  const [ticker1, setTicker1] = useState('AAPL')
  const [ticker2, setTicker2] = useState('TSLA')
  const [period, setPeriod] = useState('1mo')
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [summary1, setSummary1] = useState('')
  const [summary2, setSummary2] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [exchangeRate, setExchangeRate] = useState(80)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExchangeRate()
  }, [])

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`)
      const rate = response.data.conversion_rates.INR
      setExchangeRate(rate)
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    }
  }

  const fetchStockData = async (ticker, setData, setSummary) => {
    try {
      const response = await axios.get(`http://localhost:8080/https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${period}&interval=1d`)
      const chartData = response.data.chart.result[0]

      if (!chartData || !chartData.indicators || !chartData.indicators.quote[0]) {
        throw new Error('Invalid data format')
      }

      const prices = chartData.indicators.quote[0].close || []
      const volume = chartData.indicators.quote[0].volume || []
      const dates = chartData.timestamp.map(ts => new Date(ts * 1000).toLocaleDateString())

      const firstPrice = prices[0]
      const lastPrice = prices[prices.length - 1]
      const highPrice = Math.max(...prices)
      const lowPrice = Math.min(...prices)
      const totalVolume = volume.reduce((acc, val) => acc + val, 0)
      const averageVolume = (totalVolume / volume.length).toFixed(2)
      const averagePrice = (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2)

      const priceChange = lastPrice - firstPrice
      const percentageChange = ((priceChange / firstPrice) * 100).toFixed(2)
      const trend = priceChange > 0 ? 'Upward' : priceChange < 0 ? 'Downward' : 'No Change'
      const lastPriceInINR = (lastPrice * exchangeRate).toFixed(2)
      const priceChangeInINR = (priceChange * exchangeRate).toFixed(2)

      const summary = `
        Summary for ${ticker}:
        - Current Price: $${lastPrice.toFixed(2)} (₹${lastPriceInINR})
        - Opening Price: $${firstPrice.toFixed(2)}
        - Price Change: $${priceChange.toFixed(2)} (₹${priceChangeInINR}) (${percentageChange}%)
        - High: $${highPrice.toFixed(2)}, Low: $${lowPrice.toFixed(2)}
        - Average Price: $${averagePrice}
        - Volume: ${totalVolume.toLocaleString()}, Average Daily Volume: ${averageVolume}
        - Trend: ${trend}
        - Period: ${period === '1mo' ? 'Last Month' : 'Last Year'}
      `

      setSummary(summary)

      setData({
        labels: dates,
        datasets: [{
          label: `${ticker} Stock Price`,
          data: prices,
          fill: false,
          borderColor: ticker === ticker1 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          tension: 0.1
        }]
      })

      return prices
    } catch (error) {
      console.error('Error fetching stock data:', error)
      setData(null)
      return null
    }
  }

  const predictPrice = (prices) => {
    const sum = prices.slice(-5).reduce((a, b) => a + b, 0)
    return sum / 5
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const prices1 = await fetchStockData(ticker1, setData1, setSummary1)
      const prices2 = await fetchStockData(ticker2, setData2, setSummary2)

      if (prices1 && prices2) {
        const predictedPrice1 = predictPrice(prices1)
        const predictedPrice2 = predictPrice(prices2)

        const predictedPrice1InINR = (predictedPrice1 * exchangeRate).toFixed(2)
        const predictedPrice2InINR = (predictedPrice2 * exchangeRate).toFixed(2)

        setRecommendation(`Predicted Prices:
          - ${ticker1}: $${predictedPrice1.toFixed(2)} (₹${predictedPrice1InINR})
          - ${ticker2}: $${predictedPrice2.toFixed(2)} (₹${predictedPrice2InINR})
          ${predictedPrice1 > predictedPrice2 ? `Consider buying ${ticker1}.` : `Consider buying ${ticker2}.`}
        `)
      }
    } catch (error) {
      setError("Failed to fetch stock data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Stock Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <Input
                type="text"
                value={ticker1}
                onChange={(e) => setTicker1(e.target.value)}
                placeholder="Enter first stock ticker"
              />
              <Input
                type="text"
                value={ticker2}
                onChange={(e) => setTicker2(e.target.value)}
                placeholder="Enter second stock ticker"
              />
              <Select value={period} onValueChange={setPeriod}>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Fetching Data...' : 'Fetch Data'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{ticker1} Stock Data</CardTitle>
          </CardHeader>
          <CardContent>
            {data1 && <Line data={data1} />}
            <h4 className="mt-4 font-bold">Key Takeaways:</h4>
            <pre className="whitespace-pre-wrap">{summary1}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{ticker2} Stock Data</CardTitle>
          </CardHeader>
          <CardContent>
            {data2 && <Line data={data2} />}
            <h4 className="mt-4 font-bold">Key Takeaways:</h4>
            <pre className="whitespace-pre-wrap">{summary2}</pre>
          </CardContent>
        </Card>
      </div>

      {recommendation && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-bold">{recommendation}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}