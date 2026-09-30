import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  Flex,
  Icon,
  Stack,
  Text,
  WithDivide,
  surface
} from '@lifeforge/ui'

import { useEndpointDetail } from '../providers/EndpointDetailProvider'

function EndpointOverview() {
  const { t } = useModuleTranslation()
  const { endpoint } = useEndpointDetail()

  const flags = [
    !endpoint.noAuth && { icon: 'tabler:lock', label: t('badges.auth') },
    endpoint.encrypted && { icon: 'tabler:key', label: t('badges.encrypted') },
    endpoint.isDownloadable && {
      icon: 'tabler:download',
      label: t('badges.downloadable')
    },
    endpoint.media &&
      Object.keys(endpoint.media).length > 0 && {
        icon: 'tabler:paperclip',
        label: t('badges.media')
      }
  ].filter(Boolean) as { icon: string; label: string }[]

  return (
    <Stack gap="sm">
      <Flex align="center" gap="sm">
        <Icon icon="tabler:info-circle" size="1.5em" />
        <Text size="xl" weight="semibold">
          {t('detail.overview')}
        </Text>
      </Flex>
      <Text color="muted">{endpoint.description}</Text>
      {flags.length > 0 && (
        <Card bg={surface.light} gap="none" p="none" r="lg">
          {flags.map(flag => (
            <WithDivide key={flag.icon}>
              <Flex align="center" gap="md" p="md">
                <Icon icon={flag.icon} />
                <Text color="muted">{flag.label}</Text>
              </Flex>
            </WithDivide>
          ))}
        </Card>
      )}
    </Stack>
  )
}

export default EndpointOverview
