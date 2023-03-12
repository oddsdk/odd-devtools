<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import { JsonView } from '@zerodevx/svelte-json-view'

  import * as messageStorage from '../storage/message'
  import { connection, namespaceStore, messageStore } from './devtools'
  import { namespaceToString } from '../message'
  import ToggleLeftIcon from './icons/ToggleLeft.svelte'
  import ToggleRightIcon from './icons/ToggleRight.svelte'
  import TrashIcon from './icons/Trash.svelte'
  import XIcon from './icons/X.svelte'

  type NamespaceControlsMode = 'clear-session' | 'remove-history'

  let selectedMessage = null
  let selectedMessageIndex
  let namespaces = []
  let namespaceControlsMode: NamespaceControlsMode = 'clear-session'
  let messages = []
  let initialMessageSelected = false

  const unsubscribeMessages = messageStore.subscribe(store => {
    messages = store

    // Set selected message
    if (messages.length > 0) {
      if (!initialMessageSelected) {
        const lastIndex = messages.length - 1

        // Select last message at initialization
        selectedMessageIndex = lastIndex
        selectedMessage = messages[selectedMessageIndex]

        initialMessageSelected = true
      } else {
        // Update selected when messages are added or removed
        selectedMessageIndex = messages.findIndex(
          message => message.timestamp === selectedMessage.timestamp
        )

        selectedMessage = messages[selectedMessageIndex]
      }
    }
  })

  const unsubscribeNamespaces = namespaceStore.subscribe(store => {
    namespaces = store
    console.log('namespaces in subscription', namespaces)
  })

  function handleMessageClick(index) {
    selectedMessage = messages[index]
    selectedMessageIndex = index
    console.log('selected message', selectedMessage)
  }

  function handleClearMessages(namespace: string) {
    clearMessages(namespace)
  }

  function handleRemoveMessages(namespace: string) {
    namespaceControlsMode = 'clear-session'

    clearMessages(namespace)
    messageStorage.clear(namespace)
  }

  function clearMessages(namespace: string) {
    namespaceStore.update(store => store.filter(ns => ns !== namespace))

    // Remove messages from memory
    messageStore.update(store =>
      store.filter(
        message => namespaceToString(message.state.app.namespace) !== namespace
      )
    )

    // Update selected message and index
    if (messages.length > 0) {
      if (messages.includes(selectedMessage)) {
        selectedMessageIndex = messages.findIndex(
          message => message.timestamp === selectedMessage.timestamp
        )

        selectedMessage = messages[selectedMessageIndex]
      } else {
        const lastIndex = messages.length - 1

        selectedMessageIndex = lastIndex
        selectedMessage = messages[lastIndex]
      }
    } else {
      selectedMessage = null
      initialMessageSelected = false
    }
  }

  function toggleNamespaceMode(mode: NamespaceControlsMode) {
    namespaceControlsMode = mode
  }

  onDestroy(() => {
    unsubscribeMessages()
    unsubscribeNamespaces()
  })
</script>

<div class="panel-wrapper">
  {#if $connection.error === 'DebugModeOff'}
    <div class="connection-error">
      Please make sure Webnative debug mode is set to true. See the
      <a
        href="https://guide.fission.codes/developers/webnative/initialization#configuration"
        target="_blank"
        rel="noreferrer"
        style="color: #fefefe"
      >
        Webnative configuration guide
      </a>
      for instructions on enabling debug mode.
    </div>
  {:else}
    <div class="connection-status">
      {#if $connection.connected}
        <div>Connected to Webnative</div>
        <div class="message-controls">
          {#if messages.length === 0}
            No messages received yet
          {:else}
            {#each namespaces as namespace}
              {#if namespaceControlsMode === 'clear-session'}
                <button
                  in:fade={{ duration: 50 }}
                  class="clear-session-button"
                  on:click={() => handleClearMessages(namespace)}
                >
                  <span><XIcon /></span>
                  {namespace}
                </button>
              {:else}
                <button
                  in:fade={{ duration: 50 }}
                  class="remove-history-button"
                  on:click={() => handleRemoveMessages(namespace)}
                >
                  <span><TrashIcon /></span>
                  {namespace}
                </button>
              {/if}
            {/each}
            <div style="margin-left: 2px; transform: translateY(1px)">
              {#if namespaceControlsMode === 'clear-session'}
                <span
                  in:fade={{ duration: 10 }}
                  on:click={() => toggleNamespaceMode('remove-history')}
                  on:keyup={() => toggleNamespaceMode('remove-history')}
                >
                  <ToggleLeftIcon />
                </span>
              {:else}
                <span
                  in:fade={{ duration: 10 }}
                  on:click={() => toggleNamespaceMode('clear-session')}
                  on:keyup={() => toggleNamespaceMode('clear-session')}
                >
                  <ToggleRightIcon />
                </span>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <div class="wrapper">
      <div>
        {#if messages.length > 0}
          <h3 class="section-label">Message History</h3>
        {/if}
        <div class="message-history">
          {#each messages as message, index}
            {#if message.type === 'connect' || message.type === 'disconnect'}
              <button
                style:background-color={index === selectedMessageIndex
                  ? '#81a1c1'
                  : '#fdfdfe'}
                on:click={() => handleMessageClick(index)}
              >
                {message.type}
              </button>
            {:else}
              <button
                style:background-color={index === selectedMessageIndex
                  ? '#81a1c1'
                  : '#fdfdfe'}
                on:click={() => handleMessageClick(index)}
              >
                {`${message.type} ${message.detail.type}`}
              </button>
            {/if}
          {/each}
        </div>
      </div>

      <div class="message-section">
        {#if messages.length > 0}
          <h3 class="section-label">Message</h3>
        {/if}
        {#if selectedMessage}
          <div class="message-wrapper">
            {#if selectedMessage.detail}
              <h4 class="section-label">Detail</h4>
              <div class="jsonview-wrapper">
                <JsonView json={selectedMessage.detail} />
              </div>
            {/if}
            <h4 class="section-label">State</h4>
            <div class="jsonview-wrapper">
              <JsonView json={selectedMessage.state} />
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .panel-wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 8px;
    width: calc(100vw - 16px);
    height: calc(100vh - 32px);
    padding: 8px;
    overflow-y: auto;

    background-color: #1e1e1e;
    color: #fdfdfe;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }

  .wrapper {
    display: grid;
    grid-template-columns: minmax(min-content, 15vw) 80vw;
    grid-auto-flow: column;
    gap: 10px;
  }

  .message-section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .message-wrapper {
    height: 100%;
    padding: 4px;
    background-color: #fdfdfe;
    color: #333333;
    border: 1px solid transparent;
    border-radius: 3px;
    overflow: auto;
  }

  .message-history {
    display: grid;
    grid-template-columns: masonry;
    gap: 2px;
  }

  .section-label {
    margin: 2px 0 4px 2px;
    white-space: nowrap;
  }

  .connection-status {
    display: grid;
    grid-template-columns: 1fr 1fr;
    color: #dddde4;
  }

  .message-controls {
    display: grid;
    grid-auto-flow: column;
    justify-content: end;
    gap: 2px;
  }

  .connection-error {
    display: inline-block;
    color: #fefefe;
    font-size: 14px;
    margin-top: 10px;
  }

  .jsonview-wrapper {
    font-family: monospace;
    font-size: 10px;
    --jsonBorderLeft: 1px solid #81a1c1;
    --jsonValStringColor: #5e81ac;
    --jsonValColor: #bf616a;
    --jsonBracketHoverBackground: #e5e9f0;
  }

  button {
    background-color: #fefefe;
    border: 1px solid transparent;
    border-radius: 3px;
  }

  .clear-session-button {
    background-color: #eceff4;
    font-size: 10px;
    padding: 0 6px 0 2px;
  }

  .remove-history-button {
    background-color: #ba1607;
    color: #fdfdfe;
    font-size: 10px;
    padding: 0 6px 0 2px;
  }

  .clear-session-button > span {
    display: inline-block;
    transform: translate(0.5px, 1.5px);
  }
  .remove-history-button > span {
    display: inline-block;
    transform: translateY(1px);
  }
</style>
