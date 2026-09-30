import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import { list } from './routes/list'

const routes = forgeRouter({ list })

writeContractFileToClient(routes, import.meta.dirname)

export default routes
