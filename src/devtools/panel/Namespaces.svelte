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

      // Select the only namespace
      selectedNamespaceIndex = 0
      selectedNamespace = store[selectedNamespaceIndex]

      dispatch('change', {
        namespace: namespaces[selectedNamespaceIndex].namespace
      })
    } else {
      namespaces = [allNamespace, ...store]

      // Select the newest namespace when one is added.
      // Namespaces can only be added, not removed.
      selectedNamespaceIndex = namespaces.length - 1
      selectedNamespace = store[selectedNamespaceIndex]

      dispatch('change', {
        namespace: namespaces[selectedNamespaceIndex].namespace
      })
    }
  })

  function selectNamespace(event: CustomEvent<{ index: number }>) {
    const { index } = event.detail

    selectedNamespaceIndex = index
    selectedNamespace = namespaces[selectedNamespaceIndex]

    // Close all menus when a namespace is selected
    selectedMenuIndex = null

    dispatch('change', { namespace: namespaces[index].namespace })
  }

  function selectMenu(event: CustomEvent<{ index: number }>) {
    const { index } = event.detail

    selectedMenuIndex = index
  }

  /**
   * Select the last message or set message to null in selected menu namespace
   *
   * @param event.namespace Target namespace matching menu where event originated
   */
  function selectLastMessage(event: CustomEvent<{ namespace: string }>) {
    const { namespace } = event.detail

    if (selectedMenuIndex === selectedNamespaceIndex) {
      // Menu namespace and selected namespace match. Set to last message.
      selectedMessageStore.set(messages.length > 0 ? messages.length - 1 : null)
    } else if (selectedNamespace === allNamespace) {
      // All namespaces is selected
      const index = messages.findLastIndex(
        message => namespaceToString(message.state.app.namespace) === namespace
      )

      // Set to last message or switch to message namespace to indicate
      // no matching message exists.
      if (index > -1) {
        selectedMessageStore.set(index)
      } else {
        selectedNamespaceIndex = selectedMenuIndex
        dispatch('change', { namespace })
      }
    } else {
      // Set to namespace to menu namepsace.
      // Namespace selection automatically selects the last message if it exists.
      selectedNamespaceIndex = selectedMenuIndex
      dispatch('change', { namespace })
    }
  }

  onDestroy(unsubscribeNamespaces)
</script>

<div
  class="grid grid-rows-[19px_auto] divide-y divide-gray-200 dark:divide-gray-400"
>
  <div
    class="px-4 py-1 text-[9px] leading-[11px] font-bold text-gray-500 dark:text-gray-100 uppercase"
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
