import z from 'zod'

import { ModuleRegistry, traceRouteStack } from '@lifeforge/server-utils'

import forge from '../forge'

const endpointSchema = z.object({
  method: z.string(),
  path: z.string(),
  description: z.string(),
  noAuth: z.boolean(),
  encrypted: z.boolean(),
  isDownloadable: z.boolean(),
  media: z
    .record(
      z.string(),
      z.object({
        optional: z.boolean(),
        multiple: z.boolean().optional()
      })
    )
    .nullable(),
  input: z.object({
    query: z.record(z.string(), z.any()).optional(),
    body: z.record(z.string(), z.any()).optional()
  }),
  output: z.union([z.literal('custom'), z.record(z.string(), z.any())])
})

type Endpoint = z.infer<typeof endpointSchema>

type EndpointGroup = {
  displayName: string
  icon: string
  category: string
  routes: Endpoint[]
}

export const list = forge
  .query({
    description: 'List all registered routes',
    input: {},
    output: {
      OK: z.record(
        z.string(),
        z.object({
          displayName: z.string(),
          icon: z.string(),
          category: z.string(),
          routes: z.array(endpointSchema)
        })
      )
    }
  })
  .callback(async ({ req, response }) => {
    const modules = new Map(ModuleRegistry.list.map(m => [m.id, m]))
    const modulesByName = new Map(
      ModuleRegistry.list.map(m => [m.name.replace(/^@lifeforge\//, ''), m.id])
    )

    const groups: Record<string, EndpointGroup> = {
      core: {
        displayName: 'Core',
        icon: 'tabler:box',
        category: 'Core',
        routes: []
      }
    }

    const buildEndpoint = (
      route: ReturnType<typeof traceRouteStack>[number],
      path: string
    ): Endpoint => ({
      method: route.method,
      path,
      description: route.description,
      noAuth: route.noAuth ?? false,
      encrypted: route.encrypted ?? false,
      isDownloadable: route.isDownloadable ?? false,
      media: (route.media as Endpoint['media']) ?? null,
      input: (route.input as Endpoint['input'] | undefined) ?? {},
      output: (route.output as Endpoint['output'] | undefined) ?? 'custom'
    })

    const seen = new Set<string>()

    for (const route of traceRouteStack(req.app._router.stack)) {
      const match = route.path.match(/^modules\/([a-f0-9]{64})(?:\/(.*))?$/)

      let moduleId = match?.[1]
      let relativePath = match ? (match[2] ?? '') : route.path

      if (!match && route.callerModule?.source === 'app') {
        moduleId = modulesByName.get(route.callerModule.id)
        relativePath = route.path.split('/').slice(1).join('/')
      }

      const module = moduleId ? modules.get(moduleId) : undefined

      if (!module) {
        groups.core?.routes.push(buildEndpoint(route, route.path))

        continue
      }

      const key = `${module.id}|${route.method}|${relativePath}`

      if (seen.has(key)) {
        continue
      }

      seen.add(key)

      groups[module.id] ??= {
        displayName: module.displayName,
        icon: module.icon,
        category: module.category,
        routes: []
      }

      groups[module.id]?.routes.push(buildEndpoint(route, relativePath))
    }

    return response.ok(groups)
  })
