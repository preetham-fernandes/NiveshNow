"use client"

import React from 'react'
import { Line, Pie } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const DashboardMain = () => {
  // Mock data for demonstration
  const totalInvestment = 500000
  const expectedPortfolio = 650000
  const period = 5
  const roi = 30

  const stockRecommendations = [
    { name: 'AAPL', allocation: 15, risk: 'Moderate' },
    { name: 'MSFT', allocation: 12, risk: 'Low' },
    { name: 'AMZN', allocation: 10, risk: 'Moderate' },
    { name: 'GOOGL', allocation: 8, risk: 'Low' },
    { name: 'FB', allocation: 7, risk: 'Moderate' },
    { name: 'TSLA', allocation: 6, risk: 'High' },
    { name: 'NVDA', allocation: 5, risk: 'High' },
    { name: 'JPM', allocation: 5, risk: 'Low' },
    { name: 'JNJ', allocation: 4, risk: 'Low' },
    { name: 'V', allocation: 4, risk: 'Low' },
  ]

  const riskAllocation = {
    labels: ['Low', 'Moderate', 'High'],
    datasets: [
      {
        data: [38, 44, 18],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderColor: ['#388E3C', '#FFA000', '#D32F2F'],
      },
    ],
  }

  const assetAllocation = {
    labels: stockRecommendations.map(stock => stock.name),
    datasets: [
      {
        data: stockRecommendations.map(stock => stock.allocation),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40'
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += context.parsed + '%';
            }
            return label;
          }
        }
      }
    },
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvestment.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expected Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${expectedPortfolio.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Period (Years)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{period}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Return On Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roi}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead>Allocation (%)</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockRecommendations.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>{stock.allocation}%</TableCell>
                  <TableCell>{stock.risk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk-wise Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie data={riskAllocation} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie data={assetAllocation} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardMain