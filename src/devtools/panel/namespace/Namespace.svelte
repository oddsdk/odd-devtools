<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import EllipseOutline from '../icons/EllipseOutline.svelte'
  import EllipseSolid from '../icons/EllipseSolid.svelte'
  import MoreVertical from '../icons/MoreVertical.svelte'

  export let index
  export let namespace
  export let selectedNamespaceIndex
  export let selectedMenuIndex

  const dispatch = createEventDispatcher()

  let showMenu = false

  function select() {
    dispatch('select', { index })
  }

  function openMenu() {
    showMenu = true
    dispatch('selectmenu', { index })
  }

  function closeMenu() {
    showMenu = false
  }

  function clearMessages() {
    showMenu = false
    dispatch('clear', { namespace: namespace.namespace, index })
  }

  function selectLastMessage() {
    showMenu = false
    dispatch('selectlastmessage', { namespace: namespace.namespace })
  }

  $: {
    if (selectedMenuIndex !== index) {
      showMenu = false
    }
  }
</script>

<div
  class="grid grid-flow-col grid-cols-[1fr_16px] relative pl-4 pr-2 py-4 border-b border-gray cursor-pointer"
  class:bg-white={index === selectedNamespaceIndex}
  class:text-black={index === selectedNamespaceIndex}
  class:text-gray-light={index !== selectedNamespaceIndex}
  on:click={select}
  on:keypress={select}
>
  <div class="flex flex-row gap-2">
    <div class="flex flex-col justify-center">
      {#if index === selectedNamespaceIndex}
        <EllipseSolid />
      {:else}
        <EllipseOutline />
      {/if}
    </div>
    <div class="flex flex-col leading-[15.5px]">
      <span class:font-bold={index === selectedNamespaceIndex}>
        {namespace.namespace}
      </span>
      <span>
        {#if namespace.version}
          v{namespace.version}
        {:else}
          Show all events
        {/if}
      </span>
    </div>
  </div>
  {#if namespace.namespace !== 'All namespaces'}
    <div
      class="grid grid-flow-row justify-end items-center cursor-pointer"
      on:click|stopPropagation={openMenu}
      on:keypress|stopPropagation={openMenu}
    >
      <MoreVertical />
    </div>
    {#if showMenu}
      <div
        class="flex flex-col absolute right-0 top-3 py-2 z-10 text-white bg-gray-dark border border-r-0 border-gray"
      >
        <div
          class="flex flex-col items-end pr-2 py-[3px] cursor-pointer"
          on:click|stopPropagation={closeMenu}
          on:keypress|stopPropagation={closeMenu}
        >
          <MoreVertical />
        </div>
        <div
          class="px-4 py-2 text-gray-light cursor-pointer"
          on:click|stopPropagation={selectLastMessage}
          on:keypress|stopPropagation={selectLastMessage}
        >
          Jump to most recent event
        </div>
        <div
          class="px-4 py-2 text-gray-light cursor-pointer"
          on:click|stopPropagation={clearMessages}
          on:keypress|stopPropagation={clearMessages}
        >
          Clear all events
        </div>
      </div>
    {/if}
  {/if}
</div>
