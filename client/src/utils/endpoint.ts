import type { Endpoint, JSONSchema } from '@/types'

export function getEndpointId(moduleKey: string, endpoint: Endpoint): string {
  return `${moduleKey}|${endpoint.method}|${endpoint.path}`
}

export function buildFullPath(moduleKey: string, path: string): string {
  if (moduleKey === 'core') {
    return `/${path}`.replace(/\/+/g, '/')
  }

  return `/modules/${moduleKey}/${path}`.replace(/\/+/g, '/')
}

export function buildExample(schema?: JSONSchema): unknown {
  if (!schema || typeof schema !== 'object') {
    return undefined
  }

  if (schema.default !== undefined) {
    return schema.default
  }

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum[0]
  }

  switch (schema.type) {
    case 'object': {
      const properties = (schema.properties ?? {}) as Record<string, JSONSchema>
      const result: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(properties)) {
        result[key] = buildExample(value)
      }

      return result
    }

    case 'array':
      return []

    case 'string':
      return schema.format === 'date-time' ? new Date().toISOString() : ''

    case 'integer':
    case 'number':
      return 0

    case 'boolean':
      return false

    default:
      return undefined
  }
}

export function buildCurl({
  method,
  url,
  body
}: {
  method: string
  url: string
  body?: unknown
}): string {
  const parts = [`curl -X ${method.toUpperCase()} '${url}'`]

  if (body !== undefined) {
    parts.push(`-H 'Content-Type: application/json'`)
    parts.push(`-d '${JSON.stringify(body)}'`)
  }

  return parts.join(' \\\n  ')
}

export function buildFetch({
  method,
  url,
  body
}: {
  method: string
  url: string
  body?: unknown
}): string {
  const lines = [`fetch('${url}', {`, `  method: '${method.toUpperCase()}'`]

  if (body !== undefined) {
    lines[lines.length - 1] += ','
    lines.push(`  headers: { 'Content-Type': 'application/json' },`)
    lines.push(`  body: JSON.stringify(${JSON.stringify(body, null, 2)})`)
  }

  lines.push('})')

  return lines.join('\n')
}
