import { Box, Flex, Icon, Stack, Text } from '@lifeforge/ui'

import type { Endpoint, EndpointGroups } from '@/types'

import EndpointItem from './EndpointItem'

function groupBySubpath(routes: Endpoint[]): Map<string, Endpoint[]> {
  const groups = new Map<string, Endpoint[]>()

  for (const route of routes) {
    const [first, ...rest] = route.path.split('/')
    const key = rest.length > 0 ? first : ''

    const existing = groups.get(key)

    if (existing) {
      existing.push(route)
    } else {
      groups.set(key, [route])
    }
  }

  return groups
}

function EndpointList({
  groups,
  onSelect
}: {
  groups: EndpointGroups
  onSelect: (moduleKey: string, endpoint: Endpoint) => void
}) {
  return (
    <Stack gap="2xl" mb="2xl">
      {Object.entries(groups).map(([moduleKey, group]) => (
        <Stack key={moduleKey} as="section" gap="lg">
          <Flex align="center" gap="sm">
            <Icon icon={group.icon} size="1.5em" />
            <Text as="h2" size="2xl" weight="medium">
              {group.displayName}
              <Text color="muted" ml="sm" size="base">
                ({group.routes.length})
              </Text>
            </Text>
          </Flex>
          {[...groupBySubpath(group.routes).entries()].map(
            ([subpath, routes]) => (
              <Stack key={subpath || '_'} gap="sm">
                {subpath !== '' && (
                  <Flex align="center" gap="sm">
                    <Box
                      bg="custom-500"
                      height="1rem"
                      r="full"
                      width="0.25rem"
                    />
                    <Text color="muted" size="lg" weight="semibold">
                      {subpath}
                    </Text>
                  </Flex>
                )}
                {routes.map(endpoint => (
                  <EndpointItem
                    key={`${endpoint.method}-${endpoint.path}`}
                    displayPath={
                      subpath
                        ? endpoint.path.slice(subpath.length + 1)
                        : endpoint.path
                    }
                    endpoint={endpoint}
                    moduleKey={moduleKey}
                    onSelect={() => onSelect(moduleKey, endpoint)}
                  />
                ))}
              </Stack>
            )
          )}
        </Stack>
      ))}
    </Stack>
  )
}

export default EndpointList
