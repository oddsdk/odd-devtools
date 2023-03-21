<script lang="ts">
  import { onDestroy } from 'svelte'

  import './panel/panel.css'
  import { namespaceStore } from './panel'
  import Events from './panel/Events.svelte'
  import Namespaces from './panel/Namespaces.svelte'
  import Nav from './panel/Nav.svelte'

  let namespaces = []

  const unsubscribeNamespaces = namespaceStore.subscribe(store => {
    namespaces = store
  })

  function handleNamespaceChange(event: CustomEvent<{ namespace: string }>) {
    const { namespace } = event.detail

    console.log('selected namespace', namespace)
    // TODO Filter events by namespace
  }

  onDestroy(() => {
    unsubscribeNamespaces()
  })
</script>

<div
  class="min-h-screen min-w-screen grid grid-rows-[32px_auto] divide-y divide-[#4A4C50] text-white bg-black"
>
  <Nav />
  <div class="grid grid-cols-[1fr_4fr] divide-x divide-[#4A4C50]">
    <Namespaces {namespaces} on:change={handleNamespaceChange} />
    <Events />
  </div>
</div>
