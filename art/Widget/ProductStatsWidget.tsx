import React, { useEffect, useState } from 'react'
import { Card, Text, Stack } from '@sanity/ui'
import { groq } from 'next-sanity'
import { sanityClient } from '../sanityClient'  // ✅ Make sure this path is correct

type Stats = {
  pneuCount: number
  jenteCount: number
  mixtCount: number
}

const query = groq`
  {
    "pneuCount": count(*[_type == "pneu"]),
    "jenteCount": count(*[_type == "jente"]),
    "mixtCount": count(*[_type == "mixt"])
  }
`

export default function ProductStatsWidget(): JSX.Element {
  const [stats, setStats] = useState<Stats>({
    pneuCount: 0,
    jenteCount: 0,
    mixtCount: 0,
  })

  useEffect(() => {
    sanityClient.fetch<Stats>(query).then((data: React.SetStateAction<Stats>) => setStats(data))
  }, [])

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={3}>
        <Text size={2} weight="semibold">
          Product Statistics
        </Text>
        <Text>Pneus: {stats.pneuCount}</Text>
        <Text>Jentes: {stats.jenteCount}</Text>
        <Text>Mixt: {stats.mixtCount}</Text>
      </Stack>
    </Card>
  )
}
