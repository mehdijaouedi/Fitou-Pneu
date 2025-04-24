import React, { useEffect, useState } from 'react'
import { Card, Text, Stack, Grid, Flex, Box, Spinner } from '@sanity/ui'
import { groq } from 'next-sanity'
import { sanityClient } from '../sanityClient'

type InventoryStats = {
  pneuCount: number
  jenteCount: number
  mixtCount: number
  totalValue: number
}

type SalesStats = {
  dailySales: {
    date: string
    count: number
    amount: number
  }[]
  totalSales: number
  totalAmount: number
  averageSaleAmount: number
  topSellingProduct: {
    name: string
    type: string
    count: number
  }
}

type Stats = {
  inventory: InventoryStats
  sales: SalesStats
}

const query = groq`
  {
    "inventory": {
      "pneuCount": count(*[_type == "pneu"]),
      "jenteCount": count(*[_type == "jente"]),
      "mixtCount": count(*[_type == "mixt"]),
      "totalValue": 0
    },
    "sales": {
      "totalSales": count(*[_type == "sale" && status == "completed"]),
      "totalAmount": 0,
      "averageSaleAmount": 0
    }
  }
`

export default function InventorySalesWidget(): JSX.Element {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    // First do a simple test query to check connection
    sanityClient.fetch(`*[_type == "pneu"][0...1]`)
      .then(() => {
        // If test query succeeds, proceed with main query
        sanityClient.fetch(query)
          .then((data) => {
            try {
              setStats({
                inventory: {
                  pneuCount: data.inventory?.pneuCount || 0,
                  jenteCount: data.inventory?.jenteCount || 0,
                  mixtCount: data.inventory?.mixtCount || 0,
                  totalValue: data.inventory?.totalValue || 0
                },
                sales: {
                  dailySales: [],
                  totalSales: data.sales?.totalSales || 0,
                  totalAmount: data.sales?.totalAmount || 0,
                  averageSaleAmount: data.sales?.averageSaleAmount || 0,
                  topSellingProduct: {
                    name: '',
                    type: '',
                    count: 0
                  }
                }
              })
              setLoading(false)
            } catch (err) {
              console.error('Error processing stats data:', err)
              setError('Failed to process statistics. Please try again later.')
              setLoading(false)
            }
          })
          .catch((err) => {
            console.error('Error fetching stats:', err)
            setError('Failed to load statistics. Please try again later.')
            setLoading(false)
          })
      })
      .catch(err => {
        console.error('Initial connection test failed:', err)
        setError('Failed to connect to database. Please check your connection.')
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return ''
    }
  }

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND' }).format(amount)
    } catch (e) {
      return '0 TND'
    }
  }

  if (loading) {
    return (
      <Card padding={4} radius={2} shadow={1}>
        <Flex align="center" justify="center" style={{ height: '200px' }}>
          <Spinner size={3} />
        </Flex>
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding={4} radius={2} shadow={1}>
        <Text size={1} style={{ color: 'red' }}>{error}</Text>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card padding={4} radius={2} shadow={1}>
        <Text size={1}>No data available. Add products and sales to see statistics.</Text>
      </Card>
    )
  }

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Text size={2} weight="semibold">
          Inventory & Sales Statistics
        </Text>
        
        {/* Inventory Statistics */}
        <Box>
          <Text size={1} weight="semibold" style={{ marginBottom: '1rem' }}>
            Current Inventory
          </Text>
          <Grid columns={4} gap={3}>
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={0}>Pneus</Text>
                <Text size={2} weight="semibold">{stats.inventory.pneuCount}</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={0}>Jentes</Text>
                <Text size={2} weight="semibold">{stats.inventory.jenteCount}</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={0}>Mixt</Text>
                <Text size={2} weight="semibold">{stats.inventory.mixtCount}</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={0}>Total Value</Text>
                <Text size={2} weight="semibold">{formatCurrency(stats.inventory.totalValue)}</Text>
              </Stack>
            </Card>
          </Grid>
        </Box>

        {/* Sales Statistics */}
        <Box>
          <Text size={1} weight="semibold" style={{ marginBottom: '1rem' }}>
            Sales Overview
          </Text>
          <Grid columns={4} gap={3}>
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={0}>Total Sales</Text>
                <Text size={2} weight="semibold">{stats.sales.totalSales}</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={0}>Total Revenue</Text>
                <Text size={2} weight="semibold">{formatCurrency(stats.sales.totalAmount)}</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={0}>Average Sale</Text>
                <Text size={2} weight="semibold">{formatCurrency(stats.sales.averageSaleAmount)}</Text>
              </Stack>
            </Card>
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={0}>Top Selling Product</Text>
                {stats.sales.topSellingProduct.name ? (
                  <>
                    <Text size={1}>{stats.sales.topSellingProduct.name}</Text>
                    <Text size={0}>{stats.sales.topSellingProduct.count} sold</Text>
                  </>
                ) : (
                  <Text size={1}>No sales data</Text>
                )}
              </Stack>
            </Card>
          </Grid>
        </Box>

        {/* Daily Sales */}
        <Box>
          <Text size={1} weight="semibold" style={{ marginBottom: '1rem' }}>
            Daily Sales (Last 7 Days)
          </Text>
          {stats.sales.dailySales.length > 0 ? (
            <Grid columns={7} gap={2}>
              {stats.sales.dailySales.map((sale, index) => (
                <Card key={index} padding={2} radius={2} shadow={1}>
                  <Stack space={2}>
                    <Text size={0}>{formatDate(sale.date)}</Text>
                    <Text size={1} weight="semibold">{sale.count} sales</Text>
                    <Text size={0}>{formatCurrency(sale.amount)}</Text>
                  </Stack>
                </Card>
              ))}
            </Grid>
          ) : (
            <Card padding={3} radius={2} shadow={1}>
              <Text size={1}>No sales data for the last 7 days</Text>
            </Card>
          )}
        </Box>
      </Stack>
    </Card>
  )
} 