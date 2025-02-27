"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Recommendation from '@/components/Research'
import TrendingStocks from '@/components/TrendingStocks'
import Analysis from '@/components/Analysis'
import News from '@/components/News'
import InvestmentBaskets from '@/components/InvestmentBaskets'
import Professionals from '@/components/Professionals'
import PortfolioCustomization from '@/components/PortfolioCustomization'
import DashboardMain from '@/components/DashboardMain'
import Compare from '@/components/Compare'
import { ModeToggle } from "@/components/ModeToggle";
import { useTheme } from 'next-themes';
import { LayoutDashboard, ChartBar, BarChart3, Newspaper, Briefcase, Users, Sliders, Search} from 'lucide-react'

const features = [
  { name: 'Dashboard', icon: LayoutDashboard, component: DashboardMain },
  { name: 'Research', icon: Search }, // No specific component for Research
  { name: 'Analyse', icon: BarChart3, component: Analysis },
  { name: 'Compare', icon: Users, component: Compare },
  { name: 'News', icon: Newspaper, component: News },
  { name: 'Calculators', icon: Briefcase, component: InvestmentBaskets },
  { name: 'Professionals', icon: Users, component: Professionals },
  { name: 'Portfolio Customization', icon: Sliders, component: PortfolioCustomization },
]

export default function Dashboard() {
  const [activeFeature, setActiveFeature] = useState('Dashboard')
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Function to render the active component based on the selected feature
  const renderActiveComponent = () => {
    if (activeFeature === 'Research') {
      return (
        <>
          <Recommendation />
          <TrendingStocks />
        </>
      );
    }

    // Return the component for the active feature if it's not 'Research'
    const activeFeatureObj = features.find(f => f.name === activeFeature);
    return activeFeatureObj?.component ? React.createElement(activeFeatureObj.component) : <DashboardMain />;
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Card className="w-64 h-full rounded-none border-r">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="text-2xl font-bold mr-10">NiveshNow</CardTitle>
          <ModeToggle />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <nav className="space-y-1 p-2">
              {features.map((feature) => (
                <Button
                  key={feature.name}
                  variant={activeFeature === feature.name ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveFeature(feature.name)}
                >
                  <feature.icon className="mr-2 h-4 w-4" />
                  {feature.name}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </CardContent>
      </Card>

      <main className="flex-1 overflow-auto">
        <Card className="m-6 h-[calc(100vh-3rem)] shadow-none border-0">
          <CardContent>
            {renderActiveComponent()} {/* Render the active component */}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
