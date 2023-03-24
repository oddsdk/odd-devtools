<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'

  import { allNamespace, namespaceToString } from '../../namespace'
  import { namespaceStore, selectedMessageStore } from '../panel'
  import Namespace from './namespace/Namespace.svelte'

  export let messages

  const dispatch = createEventDispatcher()

  let namespaces = []
  let selectedNamespace = null
  let selectedNamespaceIndex = 0
  let selectedMenuIndex = null

  const unsubscribeNamespaces = namespaceStore.subscribe(store => {
    if (store.length === 0) {
      namespaces = []
    } else if (store.length === 1) {
      namespaces = store
      selectedNamespaceIndex = 0
      selectedNamespace = store[selectedNamespaceIndex]

      dispatch('change', {
        namespace: namespaces[selectedNamespaceIndex].namespace
      })
    } else {
      namespaces = [allNamespace, ...store]
      selectedNamespaceIndex = namespaces.length - 1
      selectedNamespace = store[selectedNamespaceIndex]

      // Select the newest namespace when one is added.
      // Note that namespaces can only be added, not removed.
      dispatch('change', {
        namespace: namespaces[selectedNamespaceIndex].namespace
      })
    }
  })

  function selectNamespace(event: CustomEvent<{ index: number }>) {
    const { index } = event.detail

    selectedNamespaceIndex = index
    selectedNamespace = namespaces[selectedNamespaceIndex]

    // Close menus when a namespace is selected
    selectedMenuIndex = null

    dispatch('change', { namespace: namespaces[index].namespace })
  }

  function selectMenu(event: CustomEvent<{ index: number }>) {
    const { index } = event.detail

    selectedMenuIndex = index
  }

  function selectLastMessage(event: CustomEvent<{ namespace: string }>) {
    const { namespace } = event.detail

    if (selectedMenuIndex === selectedNamespaceIndex) {
      // Namespace matching message is selected. Set message.
      selectedMessageStore.set(messages.length > 0 ? messages.length - 1 : null)
    } else if (selectedNamespace === allNamespace) {
      const index = messages.findLastIndex(
        message => namespaceToString(message.state.app.namespace) === namespace
      )

      // Set message or switch to message namespace to indicate
      // no matching message exists.
      if (index > -1) {
        selectedMessageStore.set(index)
      } else {
        selectedNamespaceIndex = selectedMenuIndex
        dispatch('change', { namespace })
      }
    } else {
      // Select matching namespace. Namespace selection automatically
      // selects the last message.
      selectedNamespaceIndex = selectedMenuIndex
      dispatch('change', { namespace })
    }
  }

  onDestroy(unsubscribeNamespaces)
</script>

<div class="grid grid-rows-[19px_auto] divide-y divide-[#4A4C50]">
  <div
    class="px-4 py-1 bg-[#262626] text-[9px] leading-[11px] font-medium uppercase"
  >
    Active namespaces
  </div>
  <div>
    {#each namespaces as namespace, index}
      <Namespace
        {index}
        {namespace}
        {selectedMenuIndex}
        {selectedNamespaceIndex}
        on:select={selectNamespace}
        on:selectmenu={selectMenu}
        on:selectlastmessage={selectLastMessage}
        on:clear
      />
    {/each}
  </div>
</div>
