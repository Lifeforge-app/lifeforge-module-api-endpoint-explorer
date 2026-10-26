import {
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  LayoutWithSidebar,
  ModuleHeader,
  Scrollbar,
  WithQueryData,
  useModalStore
} from '@lifeforge/ui'

import EndpointDetailModal from '@/components/EndpointDetailModal'
import EndpointList from '@/components/EndpointList'
import InnerHeader from '@/components/InnerHeader'
import Sidebar from '@/components/Sidebar'
import useFilteredGroups from '@/hooks/useFilteredGroups'
import { forgeAPI } from '@/manifest'
import type { EndpointGroups } from '@/types'

function EndpointExplorerContent({ data }: { data: EndpointGroups }) {
  const { open } = useModalStore()
  const { filteredGroups, total } = useFilteredGroups(data)

  return (
    <LayoutWithSidebar>
      <Sidebar groups={data} />
      <ContentWrapperWithSidebar>
        <InnerHeader totalItemsCount={total} />
        {total > 0 ? (
          <Scrollbar>
            <EndpointList
              groups={filteredGroups}
              onSelect={(moduleKey, endpoint) => {
                open(EndpointDetailModal, {
                  endpoint,
                  moduleKey,
                  moduleName: data[moduleKey]?.displayName ?? moduleKey,
                  moduleIcon: data[moduleKey]?.icon ?? 'tabler:box'
                })
              }}
            />
          </Scrollbar>
        ) : (
          <EmptyStateScreen
            icon="tabler:search-off"
            message={{ id: 'endpoints' }}
          />
        )}
      </ContentWrapperWithSidebar>
    </LayoutWithSidebar>
  )
}

function APIEndpointExplorer() {
  return (
    <>
      <ModuleHeader />
      <WithQueryData contract={forgeAPI.list}>
        {data => <EndpointExplorerContent data={data} />}
      </WithQueryData>
    </>
  )
}

export default APIEndpointExplorer
