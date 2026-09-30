import { type ReactNode } from 'react'

import { Flex, Icon, Stack, Text } from '@lifeforge/ui'

function Section({
  icon,
  title,
  gap = 'sm',
  children
}: {
  icon: string
  title: string
  gap?: 'sm' | 'lg'
  children: ReactNode
}) {
  return (
    <Stack gap={gap}>
      <Flex align="center" gap="sm">
        <Icon icon={icon} size="1.5em" />
        <Text size="xl" weight="semibold">
          {title}
        </Text>
      </Flex>
      {children}
    </Stack>
  )
}

export default Section
