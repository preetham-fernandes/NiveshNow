"use client"

import React from 'react'
import { Line } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const data = [
  { name: 'May 23', value: 200000 },
  { name: 'Jun 23', value: 300000 },
  { name: 'Jul 23', value: 200000 },
  { name: 'Aug 23', value: 278000 },
  { name: 'Sep 23', value: 189000 },
  { name: 'Oct 23', value: 239000 },
  { name: 'Nov 23', value: 349000 },
  { name: 'Dec 23', value: 278000 },
  { name: 'Jan 24', value: 425290 },
]

const DashboardMain = () => {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Portfolio Value',
        data: data.map(d => d.value),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        ticks: { color: 'hsl(var(--foreground))' },
        grid: { color: 'hsl(var(--border) / 0.2)' },
      },
      x: {
        ticks: { color: 'hsl(var(--foreground))' },
        grid: { color: 'hsl(var(--border) / 0.2)' },
      },
    },
    plugins: {
      legend: {
        labels: { color: 'hsl(var(--foreground))' },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--background))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Your current portfolio value and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$475,432.98</div>
          <div className="flex items-center text-green-500 mt-2">
            <ArrowUpIcon className="w-4 h-4 mr-1" />
            <span>6.2% (since last month)</span>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$500,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+ $30,432.98</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Annual Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">12.5%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Moderate</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardMain