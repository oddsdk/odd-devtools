<script lang="ts">
  import { onDestroy } from 'svelte'

  import './panel/panel.css'
  import {
    clearMessages as clear,
    connectionStore,
    messageStore,
    searchTermStore,
    themeStore
  } from './panel'
  import { allNamespace, namespaceToString } from '../namespace'
  import { hasMatchingTerm, type Message } from '../message'
  import Messages from './panel/Messages.svelte'
  import Namespaces from './panel/Namespaces.svelte'
  import Nav from './panel/Nav.svelte'

  let messages: Message[] = []
  let filteredMessages = []
  let selectedNamespace

  const unsubscribeMessages = messageStore.subscribe(store => {
    messages = store
  })

  function handleNamespaceChange(event: CustomEvent<{ namespace: string }>) {
    const { namespace } = event.detail

    selectedNamespace = namespace
  }

  function clearMessages(event: CustomEvent<{ namespace: string }>) {
    const { namespace } = event.detail

    clear(namespace)
  }

  $: {
    filteredMessages = messages
      .filter(message =>
        selectedNamespace === allNamespace.namespace
          ? true
          : namespaceToString(message.state.app.namespace) === selectedNamespace
      )
      .filter(message =>
        hasMatchingTerm(
          { detail: message.detail, state: message.state },
          $searchTermStore
        )
      )
  }

  onDestroy(unsubscribeMessages)
</script>

<div class:dark={$themeStore === 'dark'}>
  <div
    class="h-screen w-screen overflow-y-hidden grid grid-rows-[32px_auto] text-gray-400 dark:text-gray-200 bg-gray-100 dark:bg-gray-500"
  >
    <Nav connection={$connectionStore} on:clear={clearMessages} />
    <div
      class="grid grid-cols-[1fr_4fr] divide-x divide-gray-200 dark:divide-gray-400"
    >
      <Namespaces
        messages={filteredMessages}
        on:change={handleNamespaceChange}
        on:clear={clearMessages}
      />
      <Messages messages={filteredMessages} />
    </div>
  </div>
</div>
