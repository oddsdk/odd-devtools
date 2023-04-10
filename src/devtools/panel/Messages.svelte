<script lang="ts">
  import { onDestroy } from 'svelte'
  import { JsonView } from '@zerodevx/svelte-json-view'

  import { label, type Message } from '../../message'
  import { searchTermStore, selectedMessageStore, themeStore } from '../panel'
  import EllipseOutline from './icons/EllipseOutline.svelte'
  import EllipseSolid from './icons/EllipseSolid.svelte'
  import SearchIcon from './icons/Search.svelte'
  import XIcon from './icons/X.svelte'

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

  function setSearchTerm(event: { currentTarget: HTMLInputElement }) {
    searchTermStore.set(event.currentTarget.value)
  }

  function clearSearchTerm() {
    searchTermStore.set('')
  }

  /**
   * Listen for changes to filtered messages.
   * Update reference to selected message or select the last
   * message if selected message is missing.
   */
  $: {
    if (messages.length === 0) {
      selectedMessageIndex = null
      selectedMessage = null
    } else if (messages.length === 1) {
      // Select the only message
      selectedMessageIndex = 0
      selectedMessage = messages[selectedMessageIndex]
    } else if (messages.length > 1) {
      // Find selected message index
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

<div
  class="grid grid-rows-[19px_32px_auto] divide-y divide-gray-200 dark:divide-gray-400"
>
  <div
    class="px-4 py-1 text-[9px] leading-[11px] text-gray-500 dark:text-gray-100 font-bold uppercase"
  >
    Events
  </div>
  <div
    class="flex flex-row gap-2 justify-start items-center px-4 py-2 text-gray-500 dark:text-gray-100"
  >
    {#if $searchTermStore.length === 0}
      <SearchIcon />
    {:else}
      <span
        class="translate-y-px cursor-pointer"
        on:click={clearSearchTerm}
        on:keypress={clearSearchTerm}
      >
        <XIcon />
      </span>
    {/if}
    <input
      class="w-full bg-gray-100 dark:bg-gray-500 text-xs text-gray-500 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-200 outline-none"
      type="text"
      placeholder="Filter events..."
      spellcheck="false"
      bind:value={$searchTermStore}
      on:input={setSearchTerm}
    />
  </div>
  <div
    class="grid grid-cols-[1fr_3fr] divide-x divide-gray-200 dark:divide-gray-400"
  >
    <div class="pb-4 h-event-content-height overflow-y-auto">
      {#each messages as message, index}
        <div
          class="flex flex-row gap-2 px-4 py-2 leading-[15px] border-b border-gray-200 dark:border-gray-400 cursor-pointer {index ===
          selectedMessageIndex
            ? 'bg-blue-200 font-bold text-gray-500'
            : 'font-normal text-gray-300 dark:text-gray-200'}"
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
      class="grid grid-flow-row grid-rows-[10px_auto_10px_auto_1fr] p-4 gap-2 h-event-content-height overflow-auto"
    >
      {#if selectedMessage}
        <h4
          class="text-[10px] leading-[12px] tracking-[0.06em] font-bold text-gray-500 dark:text-gray-100 uppercase"
        >
          Detail
        </h4>
        <div
          class="jsonview-wrapper {$themeStore === 'light'
            ? 'jsonview-wrapper-light'
            : 'jsonview-wrapper-dark'}"
        >
          <JsonView json={selectedMessage.detail} />
        </div>
        <h4
          class="text-[10px] leading-[12px] tracking-[0.06em] font-bold text-gray-500 dark:text-gray-100 uppercase"
        >
          State
        </h4>
        <div
          class="jsonview-wrapper {$themeStore === 'light'
            ? 'jsonview-wrapper-light'
            : 'jsonview-wrapper-dark'}"
        >
          <JsonView json={selectedMessage.state} />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .jsonview-wrapper {
    font-family: 'IBM Plex Mono';
    font-size: 12px;
    font-weight: 400;
  }

  .jsonview-wrapper-light {
    color: #1b1e24;
    --jsonBorderLeft: 1px solid #aaadc4;
    --jsonValStringColor: #6e52fa;
    --jsonValColor: #a6163a;
    --jsonBracketHoverBackground: #aaadc4;
  }

  .jsonview-wrapper-dark {
    color: #dcdee3;
    --jsonBorderLeft: 1px solid #484a65;
    --jsonValStringColor: #d4befe;
    --jsonValColor: #d28392;
    --jsonBracketHoverBackground: #484a65;
  }
</style>
