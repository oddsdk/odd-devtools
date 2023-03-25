<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { createFloatingActions } from 'svelte-floating-ui'
  import { offset } from 'svelte-floating-ui/dom'

  import { allNamespace } from '../../namespace'
  import ExternalLink from './icons/ExternalLink.svelte'
  import TrashIcon from './icons/Trash.svelte'
  import MoreVerticalIcon from './icons/MoreVertical.svelte'
  import WebnativeIcon from './icons/Webnative.svelte'

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

<div class="grid grid-cols-[4fr_1fr] justify-center border-b border-gray">
  <div class="flex flex-row gap-2 px-4 py-2 justify-start">
    <WebnativeIcon />
    <span class="text-xs font-medium">
      Webnative
      {#if connection.connected}
        Connected
      {:else}
        Not Connected
      {/if}
    </span>
  </div>
  <div class="flex flex-row gap-2 justify-end">
    <div
      class="flex flex-row gap-2 py-2 cursor-pointer"
      on:click={clearMessages}
      on:keypress={clearMessages}
    >
      <span class="text-xs text-gray-light whitespace-nowrap">Clear logs</span>
      <TrashIcon />
    </div>
    <div
      class="px-2 py-2 cursor-pointer"
      class:bg-gray-dark={showMenu}
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
    class="flex flex-col absolute py-2 w-[248px] bg-gray-dark border border-gray"
    use:floatingContent
  >
    <a
      class="flex flex-row gap-2 py-2 px-4 text-gray-light"
      href="https://guide.fission.codes/developers/webnative"
      target="_blank"
      rel="noreferrer"
    >
      Open Webnative Docs
      <ExternalLink />
    </a>
    <a
      class="flex flex-row gap-2 py-2 px-4 text-gray-light"
      href="https://github.com/webnative-examples/webnative-devtools"
      target="_blank"
      rel="noreferrer"
    >
      Report a bug
      <ExternalLink />
    </a>
  </div>
{/if}
