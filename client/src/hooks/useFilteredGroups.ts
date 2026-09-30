import { useMemo } from 'react'

import useFilter from '@/hooks/useFilter'
import type { EndpointGroups } from '@/types'

export default function useFilteredGroups(data: EndpointGroups | undefined): {
  filteredGroups: EndpointGroups
  total: number
} {
  const { searchQuery, method, module } = useFilter()

  return useMemo(() => {
    const filteredGroups: EndpointGroups = {}

    let total = 0

    if (data) {
      const q = searchQuery.trim().toLowerCase()

      for (const [key, group] of Object.entries(data)) {
        if (module && key !== module) {
          continue
        }

        const routes = group.routes.filter(route => {
          if (method && route.method !== method) {
            return false
          }

          if (!q) {
            return true
          }

          return (
            route.path.toLowerCase().includes(q) ||
            route.description.toLowerCase().includes(q)
          )
        })

        if (routes.length > 0) {
          filteredGroups[key] = { ...group, routes }
          total += routes.length
        }
      }
    }

    return { filteredGroups, total }
  }, [data, searchQuery, method, module])
}
