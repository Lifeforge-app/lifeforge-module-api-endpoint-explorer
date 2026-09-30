import type { JSONSchema } from '@/types'

import { type ResolvedSchema, resolveSchema } from './resolveSchema'

export function getTypeLabel(schema: ResolvedSchema): string {
  if (Array.isArray(schema.enum)) {
    return 'enum'
  }

  if (schema.type === 'string' && schema.format === 'binary') {
    return 'file'
  }

  if (schema.type === 'array' && schema.items) {
    return `array<${getTypeLabel(resolveSchema(schema.items as JSONSchema))}>`
  }

  if (schema.variants) {
    return [
      ...new Set(
        schema.variants.map(variant => getTypeLabel(resolveSchema(variant)))
      )
    ].join(' | ')
  }

  return schema.type ?? 'any'
}

const TYPE_COLORS = {
  'purple-500': ['object', 'array'],
  'green-600': ['string'],
  'yellow-600': ['number', 'integer'],
  'orange-500': ['boolean']
} as const

type TypeColor = keyof typeof TYPE_COLORS

export function getTypeColor(label: string) {
  return (
    (Object.keys(TYPE_COLORS) as TypeColor[]).find(color =>
      TYPE_COLORS[color].some(prefix => label.startsWith(prefix))
    ) ?? 'bg-500'
  )
}

export function getVariantLabel(schema: ResolvedSchema): string | undefined {
  if (!schema.properties) {
    return undefined
  }

  for (const value of Object.values(schema.properties)) {
    if (value.const !== undefined) {
      return String(value.const)
    }

    const enumValues = value.enum as unknown[] | undefined

    if (Array.isArray(enumValues) && enumValues.length === 1) {
      return String(enumValues[0])
    }
  }

  return undefined
}
