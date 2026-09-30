import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Card, Flex, Stack, Text, surface } from '@lifeforge/ui'

import type { JSONSchema } from '@/types'
import { STATUS_CODES, getStatusColor } from '@/utils/status'

import { useEndpointDetail } from '../../providers/EndpointDetailProvider'
import Section from '../Section'
import MediaSchema from './components/MediaSchema'
import SchemaView from './components/SchemaView'

function EndpointSchema() {
  const { t } = useModuleTranslation()
  const { endpoint } = useEndpointDetail()

  const inputSchemas: { title: string; schema: JSONSchema }[] = []

  if (endpoint.input.query) {
    inputSchemas.push({
      title: t('detail.query'),
      schema: endpoint.input.query
    })
  }

  if (endpoint.input.body) {
    inputSchemas.push({ title: t('detail.body'), schema: endpoint.input.body })
  }

  const hasMedia = !!endpoint.media && Object.keys(endpoint.media).length > 0

  const outputEntries =
    typeof endpoint.output === 'object' ? Object.entries(endpoint.output) : []

  if (inputSchemas.length === 0 && !hasMedia && outputEntries.length === 0) {
    return null
  }

  return (
    <Section gap="lg" icon="tabler:file-code" title={t('detail.schemas')}>
      {inputSchemas.map(({ title, schema }) => (
        <Stack key={title} gap="sm">
          <Text color="muted" size="base" weight="medium">
            {title}
          </Text>
          <SchemaView schema={schema} />
        </Stack>
      ))}
      {hasMedia && (
        <Stack gap="sm">
          <Text color="muted" size="base" weight="medium">
            {t('detail.media')}
          </Text>
          <MediaSchema media={endpoint.media!} />
        </Stack>
      )}
      {outputEntries.length > 0 && (
        <Stack gap="md">
          <Text color="muted" size="base" weight="medium">
            {t('detail.responses')}
          </Text>
          {outputEntries.map(([status, schema]) => (
            <Stack key={status} gap="sm">
              <Flex align="center" gap="sm">
                <Box
                  bg={getStatusColor(status) ?? 'muted'}
                  height="1.25rem"
                  r="full"
                  width="0.25rem"
                />
                <Text as="code" weight="medium">
                  {STATUS_CODES[status]
                    ? `${STATUS_CODES[status]} ${status}`
                    : status}
                </Text>
              </Flex>
              {schema === true ? (
                <Card bg={surface.light}>
                  <Text color="muted" size="base">
                    {t('detail.noContent')}
                  </Text>
                </Card>
              ) : (
                <SchemaView schema={schema as JSONSchema} />
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </Section>
  )
}

export default EndpointSchema
