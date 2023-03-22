<script lang="ts">
  import { onDestroy } from 'svelte'

  import './panel/panel.css'
  import { connectionStore, messageStore, namespaceStore } from './panel'
  import Events from './panel/Events.svelte'
  import Namespaces from './panel/Namespaces.svelte'
  import Nav from './panel/Nav.svelte'

  let messages = []
  let namespaces = []

  const unsubscribeMessages = messageStore.subscribe(store => {
    messages = store
  })

  const unsubscribeNamespaces = namespaceStore.subscribe(store => {
    namespaces = store
  })

  function handleNamespaceChange(event: CustomEvent<{ namespace: string }>) {
    const { namespace } = event.detail

    console.log('selected namespace', namespace)
    // TODO Filter events by namespace
  }

  onDestroy(() => {
    unsubscribeMessages()
    unsubscribeNamespaces()
  })
</script>

<div
  class="h-screen w-screen overflow-y-hidden grid grid-rows-[32px_auto] divide-y divide-[#4A4C50] text-white bg-black"
>
  <Nav connection={$connectionStore} />
  <div class="grid grid-cols-[1fr_4fr] divide-x divide-[#4A4C50]">
    <Namespaces {namespaces} on:change={handleNamespaceChange} />
    <Events {messages} />
  </div>
</div>
