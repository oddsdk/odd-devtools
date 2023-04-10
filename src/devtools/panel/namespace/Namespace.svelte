<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { themeStore } from '../../panel'
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
  class="grid grid-flow-col grid-cols-[1fr_16px] relative pl-4 pr-2 py-4 border-b border-gray-200 dark:border-gray-400 cursor-pointer
  {index === selectedNamespaceIndex ? 'bg-blue-200' : ''}"
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
      <span
        class={index === selectedNamespaceIndex
          ? 'font-bold text-gray-500'
          : 'dark:font-bold text-gray-300 dark:text-gray-200'}
      >
        {namespace.namespace}
      </span>
      <span
        class="font-mono text-[10px] {index === selectedNamespaceIndex
          ? 'font-medium dark:font-light text-gray-500'
          : 'font-normal dark:font-light text-gray-300 dark:text-gray-200'}"
      >
        {#if namespace.version}
          v{namespace.version}
        {:else}
          Multiple versions
        {/if}
      </span>
    </div>
  </div>
  {#if namespace.namespace !== 'All namespaces'}
    <div
      class="grid grid-flow-row justify-end items-center cursor-pointer {index ===
      selectedNamespaceIndex
        ? 'text-gray-500'
        : 'text-gray-300'}"
      on:click|stopPropagation={openMenu}
      on:keypress|stopPropagation={openMenu}
    >
      <MoreVertical />
    </div>
    {#if showMenu}
      <div
        class="flex flex-col absolute right-0 top-3 py-2 z-10 text-white bg-gray-200 border border-r-0 border-gray-300"
      >
        <div
          class="flex flex-col items-end pr-2 py-[3px] text-gray-500 cursor-pointer"
          on:click|stopPropagation={closeMenu}
          on:keypress|stopPropagation={closeMenu}
        >
          <MoreVertical />
        </div>
        <div
          class="px-4 py-2 text-gray-500 cursor-pointer"
          on:click|stopPropagation={selectLastMessage}
          on:keypress|stopPropagation={selectLastMessage}
        >
          Jump to most recent event
        </div>
        <div
          class="px-4 py-2 text-gray-500 cursor-pointer"
          on:click|stopPropagation={clearMessages}
          on:keypress|stopPropagation={clearMessages}
        >
          Clear all events
        </div>
      </div>
    {/if}
  {/if}
</div>
