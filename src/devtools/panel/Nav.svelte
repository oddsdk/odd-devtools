<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { createFloatingActions } from 'svelte-floating-ui'
  import { slide } from 'svelte/transition'
  import { offset } from 'svelte-floating-ui/dom'

  import { allNamespace } from '../../namespace'
  import { themeStore } from '../panel'
  import ExternalLink from './icons/ExternalLink.svelte'
  import TrashIcon from './icons/Trash.svelte'
  import MoreVerticalIcon from './icons/MoreVertical.svelte'
  import DarkOddIcon from './icons/DarkOdd.svelte'
  import DarkNoOddIcon from './icons/DarkNoOdd.svelte'
  import LightOddIcon from './icons/LightOdd.svelte'
  import LightNoOddIcon from './icons/LightNoOdd.svelte'

  export let connection

  const dispatch = createEventDispatcher()

  let showMenu = false

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'bottom',
    middleware: [
      offset({
        mainAxis: -2,
        crossAxis: -108
      })
    ]
  })

  function clearMessages() {
    dispatch('clear', { namespace: allNamespace.namespace })
  }

  function toggleMenu() {
    showMenu = !showMenu
  }
</script>

<div
  class="grid grid-cols-[4fr_1fr] justify-center border-b border-gray-200 dark:border-gray-400"
>
  <div class="flex flex-row gap-2 px-4 py-2 justify-start">
    {#if connection.connected && $themeStore === 'light'}
      <LightOddIcon />
    {:else if connection.connected && $themeStore === 'dark'}
      <DarkOddIcon />
    {:else if !connection.connected && $themeStore === 'light'}
      <LightNoOddIcon />
    {:else if !connection.connected && $themeStore === 'dark'}
      <DarkNoOddIcon />
    {/if}
    <span class="text-xs text-gray-500 dark:text-gray-100 font-bold">
      {#if connection.connected}
        <span class="inline-block" in:slide={{ delay: 1100, duration: 300 }}>
          ODD Code Detected
        </span>
      {:else}
        <span class="inline-block" out:slide={{ delay: 800, duration: 300 }}>
          No ODD Code Detected
        </span>
      {/if}
    </span>
  </div>
  <div class="flex flex-row gap-2 justify-end">
    <div
      class="flex flex-row gap-2 py-2 cursor-pointer"
      on:click={clearMessages}
      on:keypress={clearMessages}
    >
      <span class="text-xs text-gray-400 dark:text-gray-200 whitespace-nowrap">
        Clear logs
      </span>
      <TrashIcon />
    </div>
    <div
      class="px-2 py-2 cursor-pointer {showMenu
        ? 'bg-gray-200 text-gray-500'
        : 'text-gray-500 dark:text-gray-100'}"
      on:click={toggleMenu}
      on:keypress={toggleMenu}
      use:floatingRef
    >
      <MoreVerticalIcon />
    </div>
  </div>
</div>

{#if showMenu}
  <div
    class="flex flex-col absolute py-2 w-[248px] bg-gray-200 border border-gray-300"
    use:floatingContent
  >
    <a
      class="flex flex-row gap-2 py-2 px-4 text-gray-500"
      href="https://docs.odd.dev"
      target="_blank"
      rel="noreferrer"
    >
      Open ODD SDK Docs
      <ExternalLink />
    </a>
    <a
      class="flex flex-row gap-2 py-2 px-4 text-gray-500"
      href="https://github.com/oddsdk/odd-devtools"
      target="_blank"
      rel="noreferrer"
    >
      Report a bug
      <ExternalLink />
    </a>
  </div>
{/if}
