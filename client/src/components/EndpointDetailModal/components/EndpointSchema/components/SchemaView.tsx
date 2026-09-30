import { type ReactNode } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { Bordered, Card, Flex, Stack, Text, surface } from '@lifeforge/ui'

import type { JSONSchema } from '@/types'
import { resolveSchema } from '@/utils/resolveSchema'
import { getTypeColor, getTypeLabel, getVariantLabel } from '@/utils/schema'

function Indented({ children }: { children: ReactNode }) {
  return (
    <Bordered
      borderColor={{ base: 'bg-300', dark: 'bg-700' }}
      borderSide="left"
      ml="xs"
      pl="md"
    >
      {children}
    </Bordered>
  )
}

function SchemaView({
  schema,
  name,
  required = false
}: {
  schema: JSONSchema
  name?: string
  required?: boolean
}) {
  const { t } = useModuleTranslation()

  const resolved = resolveSchema(schema)

  const {
    type,
    properties,
    items,
    enum: enumValues,
    description,
    additionalProperties,
    required: requiredKeys,
    variants
  } = resolved

  const isObject =
    type === 'object' && !!properties && Object.keys(properties).length > 0

  const isRecord =
    type === 'object' &&
    !isObject &&
    !!additionalProperties &&
    typeof additionalProperties === 'object'

  const typeLabel = getTypeLabel(resolved)

  const content = (
    <Stack gap="xs">
      <Flex align="baseline" gap="sm" wrap="wrap">
        {name !== undefined && (
          <Text as="code" weight="semibold">
            {name}
          </Text>
        )}
        <Text
          as="code"
          color={getTypeColor(typeLabel)}
          size="base"
          weight="medium"
        >
          {typeLabel}
        </Text>
        {required && (
          <Text color="dangerous" size="sm" weight="semibold">
            {t('detail.required')}
          </Text>
        )}
      </Flex>
      {description && (
        <Text color="muted" size="base">
          {description}
        </Text>
      )}
      {enumValues && (
        <Text as="code" color="muted" size="base">
          {enumValues.map(String).join(' | ')}
        </Text>
      )}
      {isObject && (
        <Indented>
          <Stack gap="md">
            {Object.entries(properties).map(([key, child]) => (
              <SchemaView
                key={key}
                name={key}
                required={requiredKeys.includes(key)}
                schema={child}
              />
            ))}
          </Stack>
        </Indented>
      )}
      {(isRecord || (type === 'array' && items)) && (
        <Indented>
          <SchemaView
            name={isRecord ? '[key]' : '[item]'}
            schema={(isRecord ? additionalProperties : items) as JSONSchema}
          />
        </Indented>
      )}
      {variants && (
        <Stack gap="xs">
          <Text as="code" color="muted" size="sm" weight="medium">
            {t('detail.oneOf')}
          </Text>
          <Indented>
            <Stack gap="md">
              {variants.map((variant, index) => (
                <SchemaView
                  key={index}
                  name={
                    getVariantLabel(resolveSchema(variant)) ??
                    t('detail.variant', { index: index + 1 })
                  }
                  schema={variant}
                />
              ))}
            </Stack>
          </Indented>
        </Stack>
      )}
    </Stack>
  )

  if (name === undefined) {
    return <Card bg={surface.light}>{content}</Card>
  }

  return content
}

export default SchemaView
