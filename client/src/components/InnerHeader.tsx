import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Flex,
  Icon,
  Listbox,
  ListboxOption,
  SearchInput,
  Text,
  useModuleSidebarState
} from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

const METHOD_OPTIONS = [
  { icon: 'tabler:apps', label: 'headers.all', value: '' },
  { icon: 'tabler:search', label: 'GET', value: 'GET' },
  { icon: 'tabler:pencil', label: 'POST', value: 'POST' }
] as const

function InnerHeader({ totalItemsCount }: { totalItemsCount: number }) {
  const { t } = useModuleTranslation()
  const { setIsSidebarOpen } = useModuleSidebarState()
  const { searchQuery, setSearchQuery, method, updateFilter } = useFilter()

  const current =
    METHOD_OPTIONS.find(option => option.value === method) ?? METHOD_OPTIONS[0]

  const currentLabel = current.label.startsWith('headers.')
    ? t(current.label)
    : current.label

  return (
    <>
      <Flex align="center" as="header" justify="between">
        <Flex align="baseline" minWidth="0">
          <Text
            truncate
            as="h1"
            size={{ base: '2xl', xl: '3xl' }}
            weight="semibold"
          >
            {t('headers.endpoints')}
          </Text>
          <Text color="muted" ml="sm" mr="xl">
            ({totalItemsCount})
          </Text>
        </Flex>
        <Button
          display={{ base: 'flex', lg: 'none' }}
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </Flex>
      <Flex align="center" gap="sm" mb="xl" mt="md" wrap="wrap">
        <Listbox
          minWidth="14rem"
          renderContent={() => (
            <Flex align="center" gap="sm">
              <Icon icon={current.icon} />
              <Text weight="medium" whiteSpace="nowrap">
                {currentLabel}
              </Text>
            </Flex>
          )}
          value={method}
          width={{ base: '100%', sm: 'min-content' }}
          onChange={value => updateFilter('method', value)}
        >
          {METHOD_OPTIONS.map(({ icon, label, value }) => (
            <ListboxOption
              key={value}
              icon={icon}
              label={label.startsWith('headers.') ? t(label) : label}
              value={value}
            />
          ))}
        </Listbox>
        <Flex flex="1" minWidth="15rem">
          <SearchInput
            searchTarget="endpoints"
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </Flex>
      </Flex>
    </>
  )
}

export default InnerHeader
