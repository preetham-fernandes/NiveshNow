"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink } from 'lucide-react'

const News = () => {
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      const proxyUrl = 'https://api.allorigins.win/get?url='
      const apiKey = 'dc10ba26624a4550a357e51e3b310dcf95f9550e9b98cd11cf0f19f2f83a00b0'
      const query = 'latest financial news'
      const apiUrl = `https://serpapi.com/search.json?q=${query}&tbm=nws&api_key=${apiKey}`
      const fullUrl = `${proxyUrl}${encodeURIComponent(apiUrl)}`

      try {
        const response = await fetch(fullUrl)
        const data = await response.json()
        const parsedNews = JSON.parse(data.contents)
        setNews(parsedNews?.news_results || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching news:', error)
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <Card className="w-full h-full p-6">
      <h1 className="text-4xl font-bold mb-6">Financial News</h1>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((newsItem, index) => (
              <Card key={index} className="relative overflow-hidden group h-64">
                <img
                  src={newsItem.thumbnail || '/placeholder.svg?height=256&width=384'}
                  alt={newsItem.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 group-hover:bg-opacity-75" />
                <CardContent className="relative h-full flex flex-col justify-end p-4 text-white">
                  <div className="mb-2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                      {newsItem.source}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">{newsItem.title}</h2>
                  <a
                    href={newsItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 hover:text-white flex items-center mt-auto"
                  >
                    Read more <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No news found.</p>
        )}
      </ScrollArea>
    </Card>
  )
}

export default News