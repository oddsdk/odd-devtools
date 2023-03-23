<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'

  import { allNamespace } from '../../namespace'
  import { namespaceStore } from '../panel'
  import EllipseOutline from './icons/EllipseOutline.svelte'
  import EllipseSolid from './icons/EllipseSolid.svelte'
  import MoreVertical from './icons/MoreVertical.svelte'

  const dispatch = createEventDispatcher()

  let entries = []
  let selectedIndex = 0

  const unsubscribeNamespaces = namespaceStore.subscribe(namespaces => {
    if (namespaces.length === 0) {
      entries = []
    } else if (namespaces.length === 1) {
      entries = namespaces
      selectedIndex = 0

      dispatch('change', { namespace: entries[selectedIndex].namespace })
    } else {
      entries = [allNamespace, ...namespaces]
      selectedIndex = entries.length - 1

      // Select the newest namespace when one is added
      // Note that namespaces can only be added, not removed
      dispatch('change', { namespace: entries[selectedIndex].namespace })
    }
  })

  function selectNamespace(index: number) {
    dispatch('change', { namespace: entries[index].namespace })

    selectedIndex = index

    console.log('selected index', selectedIndex)
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
    {#each entries as entry, index}
      <div
        class="grid grid-flow-col grid-[1fr_auto] pl-4 pr-2 py-4 border-b border-[#4A4C50]"
        class:bg-white={index === selectedIndex}
        class:text-black={index === selectedIndex}
        on:click={() => selectNamespace(index)}
        on:keypress={() => selectNamespace(index)}
      >
        <div class="flex flex-row gap-2">
          <div class="flex flex-col justify-center">
            {#if index === selectedIndex}
              <EllipseSolid />
            {:else}
              <EllipseOutline />
            {/if}
          </div>
          <div class="flex flex-col leading-[15.5px]">
            <span class:font-bold={index === selectedIndex}>
              {entry.namespace}
            </span>
            <span>
              {#if entry.version}
                {entry.version}
              {:else}
                Show all events
              {/if}
            </span>
          </div>
        </div>
        {#if entry.namespace !== 'All namespaces'}
          <div class="grid grid-flow-row justify-end items-center">
            <MoreVertical />
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
