import { Fragment, useMemo } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import type { EndpointGroups } from '@/types'

function Sidebar({ groups }: { groups: EndpointGroups }) {
  const { t } = useModuleTranslation()
  const { module, updateFilter } = useFilter()

  const total = Object.values(groups).reduce(
    (sum, group) => sum + group.routes.length,
    0
  )

  const categories = useMemo(() => {
    const result = new Map<string, [string, EndpointGroups[string]][]>()

    const entries = [...Object.entries(groups)].sort((a, b) =>
      a[1].displayName.localeCompare(b[1].displayName)
    )

    for (const entry of entries) {
      const category = entry[1].category
      const list = result.get(category)

      if (list) {
        list.push(entry)
      } else {
        result.set(category, [entry])
      }
    }

    return new Map(
      [...result.entries()].sort(([a], [b]) => {
        if (a === 'Core') {
          return -1
        }

        if (b === 'Core') {
          return 1
        }

        return a.localeCompare(b)
      })
    )
  }, [groups])

  return (
    <SidebarWrapper>
      <SidebarItem
        active={module === ''}
        icon="tabler:apps"
        label={t('sidebar.all')}
        namespace={false}
        number={total}
        onClick={() => updateFilter('module', '')}
      />
      <SidebarDivider />
      {[...categories.entries()].map(([category, entries]) => (
        <Fragment key={category}>
          <SidebarTitle label={category} namespace={false} />
          {entries.map(([key, group]) => (
            <SidebarItem
              key={key}
              active={module === key}
              icon={group.icon}
              label={group.displayName}
              namespace={false}
              number={group.routes.length}
              onClick={() => updateFilter('module', key)}
            />
          ))}
          <SidebarDivider />
        </Fragment>
      ))}
    </SidebarWrapper>
  )
}

export default Sidebar
