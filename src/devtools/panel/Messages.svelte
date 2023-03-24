<script lang="ts">
  import { JsonView } from '@zerodevx/svelte-json-view'
  import { onDestroy } from 'svelte'

  import { label, type Message } from '../../message'
  import { selectedMessageStore } from '../panel'
  import EllipseOutline from './icons/EllipseOutline.svelte'
  import EllipseSolid from './icons/EllipseSolid.svelte'
  import SearchIcon from './icons/Search.svelte'

  export let messages

  let selectedMessageIndex = 0
  let selectedMessage: Message

  const unsubscribeSelecteMessageStore = selectedMessageStore.subscribe(
    selected => {
      selectedMessageIndex = selected
      selectedMessage = messages[selectedMessageIndex]
    }
  )

  function selectMessage(index: number) {
    selectedMessageIndex = index
    selectedMessage = messages[selectedMessageIndex]
  }

  $: {
    if (messages.length === 0) {
      selectedMessageIndex = null
      selectedMessage = null
    } else if (messages.length === 1) {
      selectedMessageIndex = 0
      selectedMessage = messages[selectedMessageIndex]
    } else if (messages.length > 1) {
      // Find selected message
      const index = messages.findIndex(
        message => message.timestamp === selectedMessage?.timestamp
      )

      // Retain selected message or select the last message
      if (index > -1) {
        selectedMessageIndex = index
        selectedMessage = messages[selectedMessageIndex]
      } else {
        selectedMessageIndex = messages.length - 1
        selectedMessage = messages[selectedMessageIndex]
      }
    }

    selectedMessageStore.set(selectedMessageIndex)
  }

  onDestroy(unsubscribeSelecteMessageStore)
</script>

<div class="grid grid-rows-[19px_32px_auto] divide-y divide-[#4A4C50]">
  <div
    class="px-4 py-1 bg-[#262626] text-[9px] leading-[11px] font-medium uppercase"
  >
    Events
  </div>
  <div class="flex flex-row gap-2 justify-start items-center px-4 py-2">
    <SearchIcon />
    <span class="text-xs">Filter events...</span>
  </div>
  <div class="grid grid-cols-[1fr_3fr] divide-x divide-[#4A4C50]">
    <div class="pb-4 h-event-content-height overflow-y-auto">
      {#each messages as message, index}
        <div
          class="flex flex-row gap-2 px-4 py-2 leading-[15px] border-b border-[#4A4C50]"
          class:bg-white={index === selectedMessageIndex}
          class:text-black={index === selectedMessageIndex}
          on:click={() => selectMessage(index)}
          on:keypress={() => selectMessage(index)}
        >
          <div class="flex flex-col justify-center">
            {#if index === selectedMessageIndex}
              <EllipseSolid />
            {:else}
              <EllipseOutline />
            {/if}
          </div>
          <div>
            {label(message)}
          </div>
        </div>
      {/each}
    </div>
    <div
      class="grid grid-flow-row p-4 gap-2 h-event-content-height overflow-auto"
    >
      {#if selectedMessage}
        <h4
          class="text-[10px] leading-[12px] tracking-[0.06em] font-[573] uppercase"
        >
          Detail
        </h4>
        <div class="jsonview-wrapper">
          <JsonView json={selectedMessage.detail} />
        </div>
        <h4
          class="text-[10px] leading-[12px] tracking-[0.06em] font-[573] uppercase"
        >
          State
        </h4>
        <div class="jsonview-wrapper">
          <JsonView json={selectedMessage.state} />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .jsonview-wrapper {
    font-family: 'IBM Plex Mono Medium';
    font-size: 12px;
    --jsonBorderLeft: 1px solid #4a4c50;
    --jsonValStringColor: #657fd2;
    --jsonValColor: #d26565;
    --jsonBracketHoverBackground: #4a4c50;
  }
</style>
