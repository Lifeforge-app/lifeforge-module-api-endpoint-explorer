import { Box, Flex, Icon, ModalHeader, Stack, Text } from '@lifeforge/ui'

import type { Endpoint } from '@/types'

import EndpointOverview from './components/EndpointOverview'
import EndpointSchema from './components/EndpointSchema'
import TryItRunner from './components/TryItRunner'
import { EndpointDetailProvider } from './providers/EndpointDetailProvider'

function EndpointDetailModal({
  data: { endpoint, moduleKey, moduleName, moduleIcon },
  onClose
}: {
  data: {
    endpoint: Endpoint
    moduleKey: string
    moduleName: string
    moduleIcon: string
  }
  onClose: () => void
}) {
  return (
    <EndpointDetailProvider
      endpoint={endpoint}
      moduleKey={moduleKey}
      moduleName={moduleName}
      moduleIcon={moduleIcon}
    >
      <Box minWidth={{ base: '100%', md: '40rem' }}>
        <ModalHeader
          icon={endpoint.method === 'GET' ? 'tabler:search' : 'tabler:pencil'}
          namespace={false}
          title={
            <Stack gap="xs" minWidth="0">
              <Flex
                align="center"
                gap="xs"
                style={{
                  marginLeft: '-0.125em'
                }}
              >
                <Icon icon={moduleIcon} color="muted" size="1em" />
                <Text color="muted" size="sm" weight="medium">
                  {moduleName}
                </Text>
              </Flex>
              <Flex align="center" gap="sm" minWidth="0">
                <Text
                  as="span"
                  color={endpoint.method === 'GET' ? 'blue-500' : 'green-500'}
                  size="lg"
                  transform="uppercase"
                  weight="bold"
                >
                  {endpoint.method}
                </Text>
                <Text as="code" size="lg" truncate>
                  {endpoint.path}
                </Text>
              </Flex>
            </Stack>
          }
          onClose={onClose}
        />
        <Stack gap="2xl">
          <EndpointOverview />
          <TryItRunner />
          <EndpointSchema />
        </Stack>
      </Box>
    </EndpointDetailProvider>
  )
}

export default EndpointDetailModal
