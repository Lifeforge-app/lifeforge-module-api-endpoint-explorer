import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export type JSONSchema = Record<string, unknown>

export type EndpointGroups = InferOutput<typeof forgeAPI.list>

export type Endpoint = EndpointGroups[string]['routes'][number]
