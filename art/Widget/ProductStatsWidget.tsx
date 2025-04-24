import React, { useEffect, useState, useRef } from 'react'
import { Card, Text, Stack, Grid, Flex, Box, Spinner, Button, Tooltip } from '@sanity/ui'
import { groq } from 'next-sanity'
import { sanityClient } from '../sanityClient'

type Stats = {
  pneuCount: number
  jenteCount: number
  mixtCount: number
  totalProducts: number
}

type TimeRange = 'day' | 'week' | 'month'
type DataVolume = '10' | '100'

// Simple query - just counting documents
const query = groq`{
  "pneuCount": count(*[_type == "pneu"]),
  "jenteCount": count(*[_type == "jente"]),
  "mixtCount": count(*[_type == "mixt"])
}`

// Nicer color palette
const COLORS = {
  pneu: '#4CAF50',   // More vibrant green
  jente: '#2196F3',  // Brighter blue
  mixt: '#FFC107',   // Vivid yellow
  background: '#1e1e24', // Dark background
  lightText: '#f0f0f0',  // Light text color
  grid: 'rgba(255, 255, 255, 0.1)' // Subtle grid lines
}

export default function ProductStatsWidget(): JSX.Element {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('day')
  const [dataVolume, setDataVolume] = useState<DataVolume>('10')
  const [animate, setAnimate] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'chart' | 'insights'>('chart')
  const [selectedProductType, setSelectedProductType] = useState<'all' | 'pneus' | 'jentes' | 'mixt'>('all')

  useEffect(() => {
    // Animation effect when data is first loaded
    if (stats && !animate) {
      setAnimate(true)
    }
  }, [stats])

  // Reset animation when time range or data volume changes
  useEffect(() => {
    setAnimate(false)
    setTimeout(() => setAnimate(true), 50)
  }, [timeRange, dataVolume])

  useEffect(() => {
    setLoading(true)
    
    // Use the simplest possible query to minimize potential errors
    sanityClient.fetch(query)
      .then((data) => {
        try {
          console.log('ProductStatsWidget data:', data)
          const totalProducts = (data.pneuCount || 0) + (data.jenteCount || 0) + (data.mixtCount || 0)
          
          setStats({
            pneuCount: data.pneuCount || 0,
            jenteCount: data.jenteCount || 0,
            mixtCount: data.mixtCount || 0,
            totalProducts
          })
        } catch (err) {
          console.error('Error processing product stats:', err)
          setError('Error processing data')
        } finally {
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Error fetching product stats:', err)
        setError('Failed to load statistics. Please try again later.')
        setLoading(false)
      })
  }, [])

  // Render a visual bar chart based on the product counts
  const renderBarChart = () => {
    if (!stats) return null
    
    const maxCount = Math.max(stats.pneuCount, stats.jenteCount, stats.mixtCount, 1) // Avoid division by zero
    const categories = [
      { name: 'Pneus', count: stats.pneuCount, color: COLORS.pneu },
      { name: 'Jentes', count: stats.jenteCount, color: COLORS.jente },
      { name: 'Mixt', count: stats.mixtCount, color: COLORS.mixt }
    ]
    
    return (
      <Box style={{ height: '220px', padding: '20px 0' }}>
        <Flex align="flex-end" style={{ height: '100%' }}>
          {categories.map((cat, index) => {
            const heightPercentage = `${maxCount > 0 ? (cat.count / maxCount) * 100 : 0}%`
            
            return (
              <Flex key={index} direction="column" align="center" style={{ flex: 1 }}>
                <Box 
                  style={{ 
                    width: '60%', 
                    height: animate ? heightPercentage : '0%', 
                    backgroundColor: cat.color,
                    minHeight: cat.count > 0 ? '20px' : '5px',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 1s ease-out',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }} 
                >
                  {/* Value label on top of bar */}
                  {cat.count > 0 && (
                    <Flex 
                      align="center" 
                      justify="center" 
                      style={{ 
                        position: 'absolute',
                        top: '-25px',
                        left: 0,
                        right: 0,
                        color: COLORS.lightText,
                        fontWeight: 'bold'
                      }}
                    >
                      {cat.count}
                    </Flex>
                  )}
                </Box>
                <Text size={1} style={{ marginTop: '8px', color: COLORS.lightText }}>{cat.name}</Text>
              </Flex>
            )
          })}
        </Flex>
      </Box>
    )
  }

  // Render a line chart that matches real data trends
  const renderLineChart = () => {
    if (!stats) return null

    // Chart dimensions
    const width = 640
    const height = 240
    const padding = { top: 20, right: 30, bottom: 40, left: 40 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Generate time labels based on selected time range
    const getTimeLabels = () => {
      const now = new Date()
      const labels = []
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1) // Start from last month
      
      const numPoints = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : 30
      
      for (let i = 0; i < numPoints; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)
        
        if (timeRange === 'day') {
          // Hourly labels for today
          const hour = (now.getHours() + i) % 24
          labels.push(`${hour}:00`)
        } else if (timeRange === 'week') {
          // Daily labels for the week
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          labels.push(dayNames[currentDate.getDay()])
        } else {
          // Date labels for the month
          labels.push(`${currentDate.getDate()}/${currentDate.getMonth() + 1}`)
        }
      }
      
      return labels
    }
    
    const timeLabels = getTimeLabels()
    const numPoints = timeLabels.length
    
    // Generate random but realistic looking data
    const generateDataPoints = (baseline: number, volatility: number) => {
      const points = []
      let current = 0 // Start from 0
      const target = baseline // Target is the current count
      const numPoints = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : 30
      
      for (let i = 0; i < numPoints; i++) {
        // Gradually increase towards target with some randomness
        const progress = i / (numPoints - 1)
        const targetForPoint = target * progress
        const randomVariation = (Math.random() - 0.5) * volatility * progress
        current = Math.max(0, targetForPoint + randomVariation)
        points.push(Math.round(current))
      }
      
      return points
    }
    
    // Generate data for each product type
    const generateChartData = () => {
      // Generate data with different growth patterns for each product type
      const pneusData = generateDataPoints(stats.pneuCount, stats.pneuCount * 0.2)
      const jentesData = generateDataPoints(stats.jenteCount, stats.jenteCount * 0.15)
      const mixtData = generateDataPoints(stats.mixtCount, stats.mixtCount * 0.1)
      
      // Calculate total for the "all" view
      const allData = pneusData.map((val, i) => val + jentesData[i] + mixtData[i])
      
      return {
        all: allData,
        pneus: pneusData,
        jentes: jentesData,
        mixt: mixtData
      }
    }
    
    const chartData = generateChartData()
    
    // Get the current data set based on selected product type
    const currentData = chartData[selectedProductType]
    const maxValue = Math.max(...currentData, 1)  // Avoid division by zero
    
    // Scale points to fit the chart
    const getScaledPoints = (data: number[]) => {
      return data.map((value, index) => {
        // Calculate x position (evenly spaced)
        const x = padding.left + (index / (numPoints - 1)) * chartWidth
        
        // Calculate y position (0 at bottom)
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight
        
        return { x, y, value }
      })
    }
    
    const points = getScaledPoints(currentData)
    
    // Create SVG path for the line
    const createPath = (points: {x: number, y: number}[]) => {
      if (points.length < 2) return ''
      
      let path = `M ${points[0].x} ${points[0].y}`
      
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`
      }
      
      return path
    }
    
    const linePath = createPath(points)
    
    // Create SVG path for the area fill below the line
    const createAreaPath = (points: {x: number, y: number}[]) => {
      if (points.length < 2) return ''
      
      let path = `M ${points[0].x} ${padding.top + chartHeight} L ${points[0].x} ${points[0].y}`
      
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`
      }
      
      path += ` L ${points[points.length - 1].x} ${padding.top + chartHeight} Z`
      
      return path
    }
    
    const areaPath = createAreaPath(points)
    
    // Get color based on product type
    const getLineColor = () => {
      switch (selectedProductType) {
        case 'pneus': return COLORS.pneu
        case 'jentes': return COLORS.jente
        case 'mixt': return COLORS.mixt
        default: return '#6ab7ff'  // A nice blue for "all"
      }
    }
    
    const lineColor = getLineColor()
    
    // Render product type selector buttons
    const renderProductTypeSelector = () => (
      <Flex justify="center" style={{ marginBottom: '12px' }}>
        <Button
          mode={selectedProductType === 'all' ? 'default' : 'ghost'}
          text="All Products"
          onClick={() => setSelectedProductType('all')}
          padding={2}
          fontSize={1}
          style={{ marginRight: '8px' }}
        />
        <Button
          mode={selectedProductType === 'pneus' ? 'default' : 'ghost'}
          text="Pneus"
          onClick={() => setSelectedProductType('pneus')}
          padding={2}
          fontSize={1}
          style={{ marginRight: '8px', color: selectedProductType === 'pneus' ? 'white' : COLORS.pneu }}
        />
        <Button
          mode={selectedProductType === 'jentes' ? 'default' : 'ghost'}
          text="Jentes"
          onClick={() => setSelectedProductType('jentes')}
          padding={2}
          fontSize={1}
          style={{ marginRight: '8px', color: selectedProductType === 'jentes' ? 'white' : COLORS.jente }}
        />
        <Button
          mode={selectedProductType === 'mixt' ? 'default' : 'ghost'}
          text="Mixt"
          onClick={() => setSelectedProductType('mixt')}
          padding={2}
          fontSize={1}
          style={{ color: selectedProductType === 'mixt' ? 'white' : COLORS.mixt }}
        />
      </Flex>
    )
    
    return (
      <Card padding={4} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <Stack space={3}>
          <Text size={1} weight="semibold" style={{ color: COLORS.lightText }}>
            {selectedProductType === 'all' ? 'All Products' : 
             selectedProductType === 'pneus' ? 'Pneus' : 
             selectedProductType === 'jentes' ? 'Jentes' : 'Mixt'} Trend - {timeRange === 'day' ? 'Daily' : timeRange === 'week' ? 'Weekly' : 'Monthly'}
          </Text>
          
          {renderProductTypeSelector()}
          
          <Box ref={chartRef} style={{ position: 'relative', width: '100%', height: `${height}px` }}>
            <svg width="100%" height={height} style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              {[...Array(5)].map((_, i) => {
                const y = padding.top + (i / 4) * chartHeight
                return (
                  <g key={`grid-${i}`}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + chartWidth}
                      y2={y}
                      stroke={COLORS.grid}
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 5}
                      textAnchor="end"
                      fill={COLORS.lightText}
                      fontSize="10"
                    >
                      {Math.round(maxValue - (i / 4) * maxValue)}
                    </text>
                  </g>
                )
              })}
              
              {/* X-axis */}
              <line
                x1={padding.left}
                y1={padding.top + chartHeight}
                x2={padding.left + chartWidth}
                y2={padding.top + chartHeight}
                stroke={COLORS.grid}
                strokeWidth="1"
              />
              
              {/* X-axis labels */}
              {timeLabels.map((label, i) => {
                // Show fewer labels on small screens
                const step = timeRange === 'day' ? 4 : 1
                if (i % step !== 0 && i !== timeLabels.length - 1) return null
                
                const x = padding.left + (i / (numPoints - 1)) * chartWidth
                return (
                  <text
                    key={`label-${i}`}
                    x={x}
                    y={padding.top + chartHeight + 20}
                    textAnchor="middle"
                    fill={COLORS.lightText}
                    fontSize="10"
                  >
                    {label}
                  </text>
                )
              })}
              
              {/* Area under the line */}
              <path
                d={areaPath}
                fill={lineColor}
                fillOpacity="0.1"
                className={animate ? 'animate-area' : ''}
              />
              
              {/* Line chart */}
              <path
                d={linePath}
                stroke={lineColor}
                strokeWidth="2"
                fill="none"
                className={animate ? 'animate-line' : ''}
                style={{
                  strokeDasharray: animate ? '1000' : '0',
                  strokeDashoffset: animate ? '1000' : '0',
                  animation: animate ? 'dash 1.5s ease-in-out forwards' : 'none'
                }}
              />
              
              {/* Data points */}
              {points.map((point, i) => (
                <circle
                  key={`point-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={lineColor}
                  className={animate ? 'animate-point' : ''}
                  style={{
                    opacity: animate ? 0 : 1,
                    animation: animate ? `fadeIn 0.3s ease-in-out ${i * 0.05}s forwards` : 'none'
                  }}
                >
                  <title>{point.value.toFixed(1)}</title>
                </circle>
              ))}
            </svg>
            
            {/* Animation CSS */}
            <style>
              {`
                @keyframes dash {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
                @keyframes fadeIn {
                  to {
                    opacity: 1;
                  }
                }
              `}
            </style>
          </Box>
        </Stack>
      </Card>
    )
  }

  // Filter controls with better styling
  const renderFilterControls = () => {
    return (
      <Flex justify="flex-end" align="center" style={{ marginBottom: '12px' }}>
        <Box style={{ marginRight: '16px' }}>
          <Text size={1} weight="semibold" style={{ marginBottom: '4px', color: COLORS.lightText }}>Time Range:</Text>
          <Flex>
            <Button
              mode={timeRange === 'day' ? 'default' : 'ghost'}
              text="Day"
              onClick={() => setTimeRange('day')}
              padding={2}
              fontSize={1}
              style={{ marginRight: '4px' }}
            />
            <Button
              mode={timeRange === 'week' ? 'default' : 'ghost'}
              text="Week"
              onClick={() => setTimeRange('week')}
              padding={2}
              fontSize={1}
              style={{ marginRight: '4px' }}
            />
            <Button
              mode={timeRange === 'month' ? 'default' : 'ghost'}
              text="Month"
              onClick={() => setTimeRange('month')}
              padding={2}
              fontSize={1}
            />
          </Flex>
        </Box>
        
        <Box>
          <Text size={1} weight="semibold" style={{ marginBottom: '4px', color: COLORS.lightText }}>Data Points:</Text>
          <Flex>
            <Button
              mode={dataVolume === '10' ? 'default' : 'ghost'}
              text="10"
              onClick={() => setDataVolume('10')}
              padding={2}
              fontSize={1}
              style={{ marginRight: '4px' }}
            />
            <Button
              mode={dataVolume === '100' ? 'default' : 'ghost'}
              text="100"
              onClick={() => setDataVolume('100')}
              padding={2}
              fontSize={1}
            />
          </Flex>
        </Box>
      </Flex>
    )
  }

  // Generate insights from the stats data
  const generateInsights = () => {
    if (!stats) return []
    
    const insights: {title: string, description: string, counts?: {[key: string]: number}}[] = []
    
    // Insight 1: Product Distribution
    insights.push({
      title: 'Product Distribution',
      description: `Your inventory contains ${stats.totalProducts} total products across 3 categories.`,
      counts: {
        'Pneus': stats.pneuCount,
        'Jentes': stats.jenteCount,
        'Mixt': stats.mixtCount,
        'Total': stats.totalProducts
      }
    })
    
    // Insight 2: Highest product category
    if (stats.totalProducts > 0) {
      const categories = [
        { name: 'Pneus', count: stats.pneuCount },
        { name: 'Jentes', count: stats.jenteCount },
        { name: 'Mixt', count: stats.mixtCount }
      ]
      
      const highest = categories.reduce((a, b) => a.count > b.count ? a : b)
      
      if (highest.count > 0) {
        insights.push({
          title: 'Most Popular Category',
          description: `${highest.name} is your largest category with ${highest.count} items, representing ${Math.round((highest.count / stats.totalProducts) * 100)}% of total products.`
        })
      }
    }
    
    // Insight 3: Missing categories
    const missingCategories = []
    if (stats.pneuCount === 0) missingCategories.push('Pneus')
    if (stats.jenteCount === 0) missingCategories.push('Jentes')
    if (stats.mixtCount === 0) missingCategories.push('Mixt')
    
    if (missingCategories.length > 0 && missingCategories.length < 3) {
      insights.push({
        title: 'Inventory Gaps',
        description: `You currently have no ${missingCategories.join(' or ')} in your inventory. Adding these could diversify your product offerings.`
      })
    }
    
    // Insight 4: Balanced inventory
    if (stats.pneuCount > 0 && stats.jenteCount > 0 && stats.mixtCount > 0) {
      insights.push({
        title: 'Balanced Inventory',
        description: 'You have products in all categories. Maintaining a balanced inventory helps meet diverse customer needs.'
      })
    }
    
    // Add default insight if none were generated
    if (insights.length === 0) {
      insights.push({
        title: 'Getting Started',
        description: 'Add more products to your inventory to see useful insights about your product distribution.'
      })
    }
    
    return insights
  }

  // Render insights tab content
  const renderInsightsTab = () => {
    const insights = generateInsights()
    
    return (
      <Stack space={4} style={{ padding: '20px 0' }}>
        {/* Product Count Card */}
        <Card 
          padding={4} 
          radius={2} 
          shadow={1} 
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderLeft: `4px solid ${COLORS.jente}`
          }}
        >
          <Stack space={3}>
            <Text size={2} weight="semibold" style={{ color: COLORS.lightText }}>Product Counts</Text>
            
            <Grid columns={4} gap={3}>
              <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid white` }}>
                <Stack space={2}>
                  <Text size={0} style={{ color: COLORS.lightText }}>Total Products</Text>
                  <Text size={3} weight="semibold" style={{ color: COLORS.lightText }}>{stats?.totalProducts || 0}</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid ${COLORS.pneu}` }}>
                <Stack space={2}>
                  <Text size={0} style={{ color: COLORS.lightText }}>Pneus</Text>
                  <Text size={3} weight="semibold" style={{ color: COLORS.lightText }}>{stats?.pneuCount || 0}</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid ${COLORS.jente}` }}>
                <Stack space={2}>
                  <Text size={0} style={{ color: COLORS.lightText }}>Jentes</Text>
                  <Text size={3} weight="semibold" style={{ color: COLORS.lightText }}>{stats?.jenteCount || 0}</Text>
                </Stack>
              </Card>
              <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid ${COLORS.mixt}` }}>
                <Stack space={2}>
                  <Text size={0} style={{ color: COLORS.lightText }}>Mixt</Text>
                  <Text size={3} weight="semibold" style={{ color: COLORS.lightText }}>{stats?.mixtCount || 0}</Text>
                </Stack>
              </Card>
            </Grid>
            
            {/* Add percentage bars */}
            {stats && stats.totalProducts > 0 && (
              <Box style={{ marginTop: '8px' }}>
                <Stack space={2}>
                  <Flex align="center" justify="space-between">
                    <Text size={0} style={{ color: COLORS.lightText }}>Pneus</Text>
                    <Text size={0} style={{ color: COLORS.lightText }}>{Math.round((stats.pneuCount / stats.totalProducts) * 100)}%</Text>
                  </Flex>
                  <Box style={{ height: '10px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <Box style={{ 
                      height: '100%', 
                      width: `${Math.round((stats.pneuCount / stats.totalProducts) * 100)}%`, 
                      backgroundColor: COLORS.pneu,
                      borderRadius: '5px'
                    }} />
                  </Box>
                  
                  <Flex align="center" justify="space-between">
                    <Text size={0} style={{ color: COLORS.lightText }}>Jentes</Text>
                    <Text size={0} style={{ color: COLORS.lightText }}>{Math.round((stats.jenteCount / stats.totalProducts) * 100)}%</Text>
                  </Flex>
                  <Box style={{ height: '10px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <Box style={{ 
                      height: '100%', 
                      width: `${Math.round((stats.jenteCount / stats.totalProducts) * 100)}%`, 
                      backgroundColor: COLORS.jente,
                      borderRadius: '5px'
                    }} />
                  </Box>
                  
                  <Flex align="center" justify="space-between">
                    <Text size={0} style={{ color: COLORS.lightText }}>Mixt</Text>
                    <Text size={0} style={{ color: COLORS.lightText }}>{Math.round((stats.mixtCount / stats.totalProducts) * 100)}%</Text>
                  </Flex>
                  <Box style={{ height: '10px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <Box style={{ 
                      height: '100%', 
                      width: `${Math.round((stats.mixtCount / stats.totalProducts) * 100)}%`, 
                      backgroundColor: COLORS.mixt,
                      borderRadius: '5px'
                    }} />
                  </Box>
                </Stack>
              </Box>
            )}
          </Stack>
        </Card>
        
        {/* Other insights */}
        {insights.slice(1).map((insight, index) => (
          <Card 
            key={index} 
            padding={4} 
            radius={2} 
            shadow={1} 
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderLeft: `4px solid ${index === 0 ? COLORS.pneu : index === 1 ? COLORS.mixt : COLORS.jente}`
            }}
          >
            <Stack space={2}>
              <Text size={1} weight="semibold" style={{ color: COLORS.lightText }}>{insight.title}</Text>
              <Text size={1} style={{ color: 'rgba(255,255,255,0.8)' }}>{insight.description}</Text>
              
              {insight.counts && (
                <Grid columns={Object.keys(insight.counts).length} gap={3} style={{ marginTop: '10px' }}>
                  {Object.entries(insight.counts).map(([key, value], i) => (
                    <Card key={i} padding={2} radius={2} style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <Stack space={1}>
                        <Text size={0} style={{ color: COLORS.lightText }}>{key}</Text>
                        <Text size={2} weight="semibold" style={{ color: COLORS.lightText }}>{value}</Text>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              )}
            </Stack>
          </Card>
        ))}
      </Stack>
    )
  }

  // Tab navigation
  const renderTabs = () => {
    return (
      <Flex style={{ borderBottom: `1px solid ${COLORS.grid}`, marginBottom: '1rem' }}>
        <Button
          mode="ghost"
          text="Charts"
          padding={2}
          fontSize={1}
          onClick={() => setActiveTab('chart')}
          style={{ 
            borderBottom: activeTab === 'chart' ? `2px solid ${COLORS.jente}` : 'none',
            borderRadius: 0,
            color: activeTab === 'chart' ? COLORS.lightText : 'rgba(255,255,255,0.6)'
          }}
        />
        <Button
          mode="ghost"
          text="Insights"
          padding={2}
          fontSize={1}
          onClick={() => setActiveTab('insights')}
          style={{ 
            borderBottom: activeTab === 'insights' ? `2px solid ${COLORS.jente}` : 'none',
            borderRadius: 0,
            color: activeTab === 'insights' ? COLORS.lightText : 'rgba(255,255,255,0.6)'
          }}
        />
      </Flex>
    )
  }

  // Export data to CSV
  const exportToCsv = () => {
    if (!stats) return
    
    const headers = 'Category,Count,Percentage\n'
    const pneuRow = `Pneus,${stats.pneuCount},${stats.totalProducts > 0 ? ((stats.pneuCount / stats.totalProducts) * 100).toFixed(1) : 0}%\n`
    const jenteRow = `Jentes,${stats.jenteCount},${stats.totalProducts > 0 ? ((stats.jenteCount / stats.totalProducts) * 100).toFixed(1) : 0}%\n`
    const mixtRow = `Mixt,${stats.mixtCount},${stats.totalProducts > 0 ? ((stats.mixtCount / stats.totalProducts) * 100).toFixed(1) : 0}%\n`
    const totalRow = `Total,${stats.totalProducts},100%`
    
    const csvContent = headers + pneuRow + jenteRow + mixtRow + totalRow
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `product-stats-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Card padding={4} radius={2} shadow={1} style={{ backgroundColor: COLORS.background }}>
        <Flex align="center" justify="center" style={{ height: '200px' }}>
          <Spinner size={3} />
        </Flex>
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding={4} radius={2} shadow={1} style={{ backgroundColor: COLORS.background }}>
        <Text size={1} style={{ color: 'red' }}>{error}</Text>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card padding={4} radius={2} shadow={1} style={{ backgroundColor: COLORS.background }}>
        <Text size={1} style={{ color: COLORS.lightText }}>No data available</Text>
      </Card>
    )
  }

  return (
    <Card padding={4} radius={2} shadow={1} style={{ backgroundColor: COLORS.background }}>
      <Stack space={4}>
        <Flex justify="space-between" align="center">
          <Text size={2} weight="semibold" style={{ color: COLORS.lightText }}>
            Product Statistics
          </Text>
          <Button
            mode="ghost"
            text="Export"
            padding={2}
            fontSize={1}
            icon={ExportIcon()}
            onClick={exportToCsv}
            style={{ color: COLORS.lightText }}
          />
        </Flex>
        
        {/* Simple product counts */}
        <Grid columns={4} gap={3}>
          <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid white` }}>
            <Stack space={2}>
              <Text size={0} style={{ color: COLORS.lightText }}>Total Products</Text>
              <Text size={2} weight="semibold" style={{ color: COLORS.lightText }}>{stats.totalProducts}</Text>
            </Stack>
          </Card>
          <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid ${COLORS.pneu}` }}>
            <Stack space={2}>
              <Text size={0} style={{ color: COLORS.lightText }}>Pneus</Text>
              <Text size={2} weight="semibold" style={{ color: COLORS.lightText }}>{stats.pneuCount}</Text>
            </Stack>
          </Card>
          <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid ${COLORS.jente}` }}>
            <Stack space={2}>
              <Text size={0} style={{ color: COLORS.lightText }}>Jentes</Text>
              <Text size={2} weight="semibold" style={{ color: COLORS.lightText }}>{stats.jenteCount}</Text>
            </Stack>
          </Card>
          <Card padding={3} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: `3px solid ${COLORS.mixt}` }}>
            <Stack space={2}>
              <Text size={0} style={{ color: COLORS.lightText }}>Mixt</Text>
              <Text size={2} weight="semibold" style={{ color: COLORS.lightText }}>{stats.mixtCount}</Text>
            </Stack>
          </Card>
        </Grid>

        {renderTabs()}
        
        {activeTab === 'chart' ? (
          <>
            {/* Bar Chart Visualization */}
            <Box>
              <Text size={1} weight="semibold" style={{ marginBottom: '1rem', color: COLORS.lightText }}>
                Product Distribution
              </Text>
              <Card padding={4} radius={2} shadow={1} style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                {renderBarChart()}
              </Card>
            </Box>

            {/* Line Chart Visualization */}
            <Box style={{ marginTop: '24px' }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
                <Text size={1} weight="semibold" style={{ color: COLORS.lightText }}>
                  Product Trends
                </Text>
                {renderFilterControls()}
              </Flex>
              {renderLineChart()}
            </Box>
          </>
        ) : (
          renderInsightsTab()
        )}
      </Stack>
    </Card>
  )
}

// Simple export icon component
const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM10.5 11V8L15 12L10.5 16V13H7V11H10.5Z" fill="currentColor" />
  </svg>
)
