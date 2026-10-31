import type { JSONSchema } from '@/types'

export type ResolvedSchema = {
  type?: string
  format?: string
  description?: string
  enum?: unknown[]
  properties?: Record<string, JSONSchema>
  required: string[]
  items?: JSONSchema
  additionalProperties?: JSONSchema
  variants?: JSONSchema[]
}

function flattenAllOf(schema: JSONSchema): JSONSchema {
  if (!Array.isArray(schema.allOf)) {
    return schema
  }

  const resolved: JSONSchema = { ...schema, type: schema.type ?? 'object' }
  const properties: Record<string, JSONSchema> = {
    ...((schema.properties ?? {}) as Record<string, JSONSchema>)
  }
  const required = new Set<string>((schema.required ?? []) as string[])
  const variants: JSONSchema[] = []

  for (const member of schema.allOf as JSONSchema[]) {
    const flattenedMember = flattenAllOf(member)

    Object.assign(
      properties,
      (flattenedMember.properties ?? {}) as Record<string, JSONSchema>
    )

    for (const key of (flattenedMember.required ?? []) as string[]) {
      required.add(key)
    }

    for (const key of ['anyOf', 'oneOf'] as const) {
      if (Array.isArray(flattenedMember[key])) {
        variants.push(...(flattenedMember[key] as JSONSchema[]))
      }
    }
  }

  resolved.properties = properties
  resolved.required = [...required]

  if (variants.length > 0) {
    resolved.anyOf = variants
  }

  delete resolved.allOf

  return resolved
}

export function resolveSchema(schema: JSONSchema): ResolvedSchema {
  const flattened = flattenAllOf(schema)

  return {
    type: flattened.type as string | undefined,
    format: flattened.format as string | undefined,
    description: flattened.description as string | undefined,
    enum: flattened.enum as unknown[] | undefined,
    properties: flattened.properties as Record<string, JSONSchema> | undefined,
    required: (flattened.required ?? []) as string[],
    items: flattened.items,
    additionalProperties: flattened.additionalProperties,
    variants: (flattened.anyOf ?? flattened.oneOf) as JSONSchema[] | undefined
  }
}
