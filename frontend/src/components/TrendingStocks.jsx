'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

export default function TrendingStocks() {
  const [trendingData, setTrendingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTrendingData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://127.0.0.1:5000/api/trending-news')
      console.log("Fetched trending data:", response.data)
      setTrendingData(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching trending data:", error)
      setError("Failed to fetch trending data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingData()
  }, [])

  const renderChangeIcon = (change) => {
    const numericChange = parseFloat(change)
    if (numericChange > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />
    } else if (numericChange < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />
    }
    return null
  }

  return (
    <Card className="w-full h-screen mx-auto mt-0">
      <CardHeader>
        <CardTitle className="text-2xl">Trending Stocks Today</CardTitle> 
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-xl">Loading trending data...</p> 
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : trendingData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">Ticker</TableHead> {/* Increased font size */}
                <TableHead className="text-lg">Price</TableHead> {/* Increased font size */}
                <TableHead className="text-lg">Change</TableHead> {/* Increased font size */}
                <TableHead className="text-lg">Change %</TableHead> {/* Increased font size */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendingData.map((topic, index) => {
                const [name, price, change] = topic.name.split('$')
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-lg">{topic.ticker}</TableCell> {/* Increased font size */}
                    <TableCell className="text-lg">{name.trim()}</TableCell> {/* Increased font size */}
                    <TableCell>
                      <div className="flex items-center">
                        {renderChangeIcon(topic.price)}
                        <span className="ml-1 text-lg">{topic.price}</span> {/* Increased font size */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {renderChangeIcon(topic.change)}
                        <span className={`ml-1 text-lg ${parseFloat(topic.change) < 0 ? 'text-red-500' : 'text-green-500'}`}> {/* Increased font size */}
                          {topic.change}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-xl">No trending topics available.</p> 
        )}
      </CardContent>
    </Card>
  )
}
