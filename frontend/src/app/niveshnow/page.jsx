"use client"; // Add this line at the top of your file

import React, { useRef } from 'react'; // Make sure to import useRef if you're using it
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bell, ChevronDown, Download, Settings, HelpCircle, BarChart2, Briefcase, DollarSign, PieChart, RefreshCcw } from 'lucide-react';

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Your component logic remains the same

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
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4 h-screen sticky top-0 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-8">Niveshnow</h1>
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                  <BarChart2 className="w-5 h-5" /> 
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                  <Briefcase className="w-5 h-5" /> 
                  <span>Portfolio</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                  <DollarSign className="w-5 h-5" /> 
                  <span>My Stock</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                  <PieChart className="w-5 h-5" /> 
                  <span>Market Stock</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                  <RefreshCcw className="w-5 h-5" /> 
                  <span>News Update</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-8 sticky top-0 bg-gray-900 z-10 py-4">
            <div className="flex items-center space-x-4">
              <input type="text" placeholder="Search now..." className="bg-gray-800 px-4 py-2 rounded-lg" />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 bg-gray-800 rounded-full"><Bell className="w-5 h-5" /></button>
              <div className="flex items-center space-x-2">
                <img src="/placeholder.svg" alt="User" className="w-8 h-8 rounded-full" />
                <span>Vincentius R</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </header>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export Report</span>
              </button>
            </div>
            <p className="text-gray-400">Overview of notes regarding your investment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg mb-2">Portfolio Value</h3>
              <div className="text-3xl font-bold mb-2">$475,432.98</div>
              <div className="text-green-500">+6.2%</div>
              <div style={{ height: '200px' }}>
                <Line
                  data={{
                    labels: data.map(d => d.name),
                    datasets: [
                      {
                        label: 'Portfolio Value',
                        data: data.map(d => d.value),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: 'white' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      },
                      x: {
                        ticks: { color: 'white' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      },
                    },
                    plugins: {
                      legend: {
                        labels: { color: 'white' },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg mb-4">Watchlist</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img src="/placeholder.svg" alt="Stock" className="w-8 h-8 rounded-full" />
                    <span>AAPL</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold">$193.36</div>
                    <div className="text-green-500">+0.76%</div>
                  </div>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img src="/placeholder.svg" alt="Stock" className="w-8 h-8 rounded-full" />
                    <span>TWTR</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold">$53.70</div>
                    <div className="text-red-500">-0.54%</div>
                  </div>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img src="/placeholder.svg" alt="Stock" className="w-8 h-8 rounded-full" />
                    <span>BMW</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold">$110.19</div>
                    <div className="text-green-500">+1.09%</div>
                  </div>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img src="/placeholder.svg" alt="Stock" className="w-8 h-8 rounded-full" />
                    <span>NYSE</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold">$108.49</div>
                    <div className="text-green-500">+11.83%</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg">Stock Sectors</h3>
              <div className="flex space-x-2">
                <button className="bg-gray-700 p-2 rounded-lg">Filter</button>
                <button className="bg-gray-700 p-2 rounded-lg">Sort</button>
              </div>
            </div>
            <p className="text-gray-400">Sector performance based on your portfolio.</p>
            {/* Chart component can be added here */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
