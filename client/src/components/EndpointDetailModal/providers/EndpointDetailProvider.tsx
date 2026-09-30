import { createContext, useContext, type ReactNode } from 'react'

import type { Endpoint } from '@/types'

type EndpointDetailContextValue = {
  endpoint: Endpoint
  moduleKey: string
  moduleName: string
  moduleIcon: string
}

const EndpointDetailContext =
  createContext<EndpointDetailContextValue | null>(null)

export function useEndpointDetail(): EndpointDetailContextValue {
  const context = useContext(EndpointDetailContext)

  if (!context) {
    throw new Error(
      'useEndpointDetail must be used within an EndpointDetailProvider'
    )
  }

  return context
}

export function EndpointDetailProvider({
  endpoint,
  moduleKey,
  moduleName,
  moduleIcon,
  children
}: EndpointDetailContextValue & {
  children: ReactNode
}) {
  return (
    <EndpointDetailContext
      value={{ endpoint, moduleKey, moduleName, moduleIcon }}
    >
      {children}
    </EndpointDetailContext>
  )
}
