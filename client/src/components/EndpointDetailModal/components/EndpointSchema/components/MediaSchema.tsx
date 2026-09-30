import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Flex, Stack, Text, surface } from '@lifeforge/ui'

import type { Endpoint } from '@/types'

function MediaSchema({ media }: { media: NonNullable<Endpoint['media']> }) {
  const { t } = useModuleTranslation()

  return (
    <Card bg={surface.light}>
      <Stack gap="md">
        {Object.entries(media).map(([name, config]) => (
          <Flex key={name} align="baseline" gap="sm" justify="between">
            <Text as="code" weight="semibold">
              {name}
            </Text>
            <Flex align="center" gap="md">
              <Text as="code" color="blue-500">
                {config.multiple ? 'file[]' : 'file'}
              </Text>
              <Text
                color={config.optional ? 'muted' : 'dangerous'}
                size="sm"
                weight="semibold"
              >
                {config.optional ? t('detail.optional') : t('detail.required')}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Stack>
    </Card>
  )
}

export default MediaSchema
