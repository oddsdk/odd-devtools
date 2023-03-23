<script lang="ts">
  import { onDestroy } from 'svelte'

  import type { Message } from '../message'

  import './panel/panel.css'
  import {
    clearMessages as clear,
    connectionStore,
    messageStore
  } from './panel'
  import { allNamespace, namespaceToString } from '../namespace'
  import Events from './panel/Events.svelte'
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

  $: {
    filteredMessages = messages.filter(message =>
      selectedNamespace === allNamespace.namespace
        ? true
        : namespaceToString(message.state.app.namespace) === selectedNamespace
    )
  }

  function clearMessages(event) {
    const { namespace } = event.detail.namespace

    clear(namespace)
  }

  onDestroy(unsubscribeMessages)
</script>

<div
  class="h-screen w-screen overflow-y-hidden grid grid-rows-[32px_auto] text-white bg-black"
>
  <Nav connection={$connectionStore} on:clear={clearMessages} />
  <div class="grid grid-cols-[1fr_4fr] divide-x divide-[#4A4C50]">
    <Namespaces on:change={handleNamespaceChange} />
    <Events messages={filteredMessages} />
  </div>
</div>
