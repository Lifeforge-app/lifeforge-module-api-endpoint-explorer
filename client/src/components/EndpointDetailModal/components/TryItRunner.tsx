/* eslint-disable no-unexpected-multiline */
import { useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Alert,
  Box,
  Button,
  ConfirmationModal,
  Stack,
  Text,
  TextAreaInput,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { buildExample, buildFullPath } from '@/utils/endpoint'

import { useEndpointDetail } from '../providers/EndpointDetailProvider'
import Section from './Section'

function TryItRunner() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const { endpoint, moduleKey } = useEndpointDetail()

  const isGet = endpoint.method === 'GET'
  const hasMedia = !!endpoint.media && Object.keys(endpoint.media).length > 0

  const [input, setInput] = useState(() => ({
    queryText: endpoint.input.query
      ? JSON.stringify(buildExample(endpoint.input.query), null, 2)
      : '',
    bodyText: endpoint.input.body
      ? JSON.stringify(buildExample(endpoint.input.body), null, 2)
      : ''
  }))

  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: unknown }
    | { status: 'error'; error: string }
  >({ status: 'idle' })

  const run = async () => {
    setState({ status: 'loading' })

    try {
      setState({
        status: 'success',
        data: await forgeAPI
          .untyped(buildFullPath(moduleKey, endpoint.path))
          .input(
            input.queryText.trim() ? JSON.parse(input.queryText) : undefined
          )
          [`${isGet ? 'query' : 'mutate'}${endpoint.encrypted ? '' : 'Raw'}`](
            !isGet && input.bodyText.trim()
              ? JSON.parse(input.bodyText)
              : undefined
          )
      })
    } catch (err) {
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : String(err)
      })
    }
  }

  if (hasMedia) {
    return null
  }

  return (
    <Section icon="tabler:player-play" title={t('tryIt.title')}>
      <Stack gap="md">
      {endpoint.input.query && (
        <TextAreaInput
          icon="tabler:filter"
          label={t('tryIt.query')}
          namespace={false}
          placeholder="{}"
          value={input.queryText}
          onChange={value => setInput(prev => ({ ...prev, queryText: value }))}
        />
      )}
      {!isGet && endpoint.input.body && (
        <TextAreaInput
          icon="tabler:braces"
          label={t('tryIt.body')}
          namespace={false}
          placeholder="{}"
          value={input.bodyText}
          onChange={value => setInput(prev => ({ ...prev, bodyText: value }))}
        />
      )}
      <Button
        icon="tabler:player-play"
        loading={state.status === 'loading'}
        width="100%"
        onClick={() =>
          isGet
            ? run()
            : open(ConfirmationModal, {
                title: t('tryIt.confirm.title'),
                description: t('tryIt.confirm.description'),
                confirmationButton: 'confirm',
                onConfirm: run
              })
        }
      >
        tryIt.execute
      </Button>
      {state.status === 'error' && <Alert type="caution">{state.error}</Alert>}
      {state.status === 'success' && (
        <Stack gap="sm">
          <Text color="muted" size="base" weight="medium">
            {t('tryIt.response')}
          </Text>
          <Box
            bg={{ base: 'bg-100', dark: 'bg-800' }}
            maxHeight="24rem"
            overflow="auto"
            p="md"
            r="md"
          >
            <Text as="pre" size="base" whiteSpace="pre-wrap">
              {JSON.stringify(state.data, null, 2)}
            </Text>
          </Box>
          </Stack>
        )}
      </Stack>
    </Section>
  )
}

export default TryItRunner
