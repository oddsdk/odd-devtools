<script lang="ts">
  import { createFloatingActions } from 'svelte-floating-ui'
  import { offset } from 'svelte-floating-ui/dom'

  import ExternalLink from './icons/ExternalLink.svelte'
  import TrashIcon from './icons/Trash.svelte'
  import MoreVerticalIcon from './icons/MoreVertical.svelte'
  import WebnativeIcon from './icons/Webnative.svelte'

  export let connection

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

  function toggleMenu() {
    showMenu = !showMenu
  }
</script>

<div class="grid grid-cols-[4fr_1fr] justify-center border-b border-[#4A4C50]">
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
    <div class="flex flex-row gap-2 py-2">
      <span class="text-xs">Clear logs</span>
      <TrashIcon />
    </div>
    <div
      class="px-2 py-2 cursor-pointer"
      class:bg-[#262626]={showMenu}
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
    class="flex flex-col absolute py-2 w-[248px] bg-[#262626] border border-[#4A4C50]"
    use:floatingContent
  >
    <a
      class="flex flex-row gap-2 py-2 px-4 whitespace-nowrap"
      href="https://guide.fission.codes/developers/webnative"
      target="_blank"
      rel="noreferrer"
    >
      Open Webnative Docs
      <ExternalLink />
    </a>
    <a
      class="flex flex-row gap-2 py-2 px-4 whitespace-nowrap"
      href="https://github.com/webnative-examples/webnative-devtools"
      target="_blank"
      rel="noreferrer"
    >
      Report a bug
      <ExternalLink />
    </a>
  </div>
{/if}
