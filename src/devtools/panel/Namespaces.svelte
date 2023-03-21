<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import EllipseOutline from './icons/EllipseOutline.svelte'
  import EllipseSolid from './icons/EllipseSolid.svelte'
  import MoreVertical from './icons/MoreVertical.svelte'

  export let namespaces

  const dispatch = createEventDispatcher()

  let entries = []
  let selectedIndex = 0

  function selectNamespace(index: number) {
    dispatch('change', { namespace: entries[index].namespace })

    selectedIndex = index
  }

  $: {
    const all = { namespace: 'All namespaces', version: null }

    if (namespaces.length > 1) {
      entries = [all, ...namespaces]
    } else {
      entries = namespaces
    }

    // Select the newest namespace when one is added
    // Note that namespaces can only be added, not removed
    selectedIndex = entries[entries.length - 1]
  }
</script>

<div class="grid grid-rows-[19px_auto]">
  <div
    class="px-4 py-1 bg-[#262626] text-[9px] leading-[11px] font-medium uppercase"
  >
    Active namespaces
  </div>
  <div class="divide-y divide-[#4A4C50]">
    {#each entries as entry, index}
      <div
        class="grid grid-flow-col grid-[1fr_auto] pl-4 pr-2 py-4"
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
          <div class="flex flex-col">
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
