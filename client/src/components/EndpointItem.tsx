import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Card,
  ContextMenu,
  ContextMenuItem,
  Flex,
  IconTooltip,
  Stack,
  TAILWIND_PALETTE,
  TagChip,
  Text,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import type { Endpoint } from '@/types'
import {
  buildCurl,
  buildFetch,
  buildFullPath,
  getEndpointId
} from '@/utils/endpoint'

const METHOD_COLORS: Record<string, string> = {
  GET: TAILWIND_PALETTE.blue[500],
  POST: TAILWIND_PALETTE.green[500]
}

function EndpointItem({
  endpoint,
  moduleKey,
  displayPath,
  onSelect
}: {
  endpoint: Endpoint
  moduleKey: string
  displayPath?: string
  onSelect: () => void
}) {
  const { t } = useModuleTranslation()

  const fullPath = buildFullPath(moduleKey, endpoint.path)
  const url = forgeAPI.untyped(fullPath).endpoint
  const methodColor =
    METHOD_COLORS[endpoint.method] ?? TAILWIND_PALETTE.yellow[500]

  const badges = [
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

  const segments = (displayPath ?? endpoint.path).split('/')
  const lastSegment = segments.pop()

  const copy = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success(t('messages.copied'))
  }

  return (
    <Card
      isInteractive
      align="center"
      direction="row"
      gap="lg"
      justify="between"
      onClick={onSelect}
    >
      <Stack flex="1" gap="sm" minWidth="0">
        <Flex align="center" gap="md" minWidth="0">
          <TagChip
            as="span"
            color={methodColor}
            label={endpoint.method}
            size="base"
            variant="outlined"
          />
          <Text truncate as="code" color="muted" size="lg">
            {segments.join('/')}
            <Text color="primary">/{lastSegment}</Text>
          </Text>
        </Flex>
        {endpoint.description && (
          <Text color="muted" lineClamp={2}>
            {endpoint.description}
          </Text>
        )}
      </Stack>
      <Flex align="center" flexShrink="0" gap="md">
        {badges.length > 0 && (
          <Flex align="center" gap="sm">
            {badges.map(badge => (
              <IconTooltip
                key={badge.icon}
                icon={badge.icon}
                id={`${getEndpointId(moduleKey, endpoint)}-${badge.icon}`}
              >
                {badge.label}
              </IconTooltip>
            ))}
          </Flex>
        )}
        <Box onClick={e => e.stopPropagation()}>
          <ContextMenu align="end">
            <ContextMenuItem
              icon="tabler:link"
              label={t('actions.copyPath')}
              namespace={false}
              onClick={() => copy(fullPath)}
            />
            <ContextMenuItem
              icon="tabler:terminal-2"
              label={t('actions.copyCurl')}
              namespace={false}
              onClick={() => copy(buildCurl({ method: endpoint.method, url }))}
            />
            <ContextMenuItem
              icon="tabler:code"
              label={t('actions.copyFetch')}
              namespace={false}
              onClick={() => copy(buildFetch({ method: endpoint.method, url }))}
            />
          </ContextMenu>
        </Box>
      </Flex>
    </Card>
  )
}

export default EndpointItem
