<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import { JsonView } from '@zerodevx/svelte-json-view'
  import * as messageStorage from '../storage/message'
  import { connection, messageStore, namespaceStore } from './panel'
  import { namespaceToString } from '../message'
  import ToggleLeftIcon from './icons/ToggleLeft.svelte'
  import ToggleRightIcon from './icons/ToggleRight.svelte'
  import TrashIcon from './icons/Trash.svelte'
  import XIcon from './icons/X.svelte'

  type NamespaceControlsMode = 'clear-session' | 'remove-history'
  type MessageReference = { log: 'history' | 'session'; index: number }

  let selectedMessage = null
  let selectedMessageRef: MessageReference = null
  let namespaces = []
  let namespaceControlsMode: NamespaceControlsMode = 'clear-session'
  let messages = {
    history: [],
    session: []
  }
  let showHistory = false

  const unsubscribeMessages = messageStore.subscribe(store => {
    messages = store

    // Set selected message
    if (!selectedMessageRef) {
      if (messages.session.length > 0) {
        const lastIndex = messages.session.length - 1

        selectedMessageRef = { log: 'session', index: lastIndex }
        selectedMessage = messages.session[lastIndex]
      } else if (showHistory && messages.history.length > 0) {
        const lastIndex = messages.history.length - 1

        selectedMessageRef = { log: 'history', index: lastIndex }
        selectedMessage = messages.history[lastIndex]
      }
    } else {
      if (selectedMessageRef.log === 'session') {
        if (messages.session.length > 0) {
          // Set new message ref and update selected message
          const selectedMessageIndex = messages.session.findIndex(
            message => message.timestamp === selectedMessage.timestamp
          )

          selectedMessageRef = { log: 'session', index: selectedMessageIndex }
          selectedMessage = messages.session[selectedMessageIndex]
        } else if (messages.history.length > 0) {
          // Set new ref and message from history log
          selectedMessageRef = {
            log: 'history',
            index: messages.history.length - 1
          }
          selectedMessage = messages.history[selectedMessageRef.index]
        } else {
          selectedMessageRef = null
          selectedMessage = null
        }
      } else {
        if (messages.history.length > 0) {
          // Set new message ref and update selected message
          const selectedMessageIndex = messages.history.findIndex(
            message => message.timestamp === selectedMessage.timestamp
          )

          selectedMessageRef = { log: 'history', index: selectedMessageIndex }
          selectedMessage = messages.history[selectedMessageIndex]
        } else if (messages.session.length > 0) {
          // Set new ref and message from session log
          selectedMessageRef = {
            log: 'session',
            index: messages.session.length - 1
          }
          selectedMessage = messages.session[selectedMessageRef.index]
        } else {
          selectedMessageRef = null
          selectedMessage = null
        }
      }
    }
  })

  const unsubscribeNamespaces = namespaceStore.subscribe(store => {
    namespaces = store
  })

  function handleMessageClick(log: 'history' | 'session', index: number) {
    selectedMessageRef = { log, index }
    selectedMessage = messages[log][index]
  }

  function handleClearMessages(namespace: string) {
    // Move session messages to history log then sort by timestamp
    messageStore.update(store => {
      const clearedMessages = store.session.filter(
        message => namespaceToString(message.state.app.namespace) === namespace
      )

      return {
        history: [...store.history, ...clearedMessages].sort(
          (a, b) => a.timestamp - b.timestamp
        ),
        session: store.session.filter(
          message =>
            namespaceToString(message.state.app.namespace) !== namespace
        )
      }
    })

    selectMostRecentMessage()
  }

  function handleRemoveMessages(namespace: string) {
    namespaceStore.update(store => store.filter(ns => ns !== namespace))

    // Clear messages from session and history logs
    messageStore.update(store => {
      return {
        session: store.session.filter(
          message =>
            namespaceToString(message.state.app.namespace) !== namespace
        ),
        history: store.history.filter(
          message =>
            namespaceToString(message.state.app.namespace) !== namespace
        )
      }
    })

    // Remove messages from storage
    messageStorage.clear(namespace)

    selectMostRecentMessage()
    namespaceControlsMode = 'clear-session'
  }

  function selectMostRecentMessage() {
    // Select last message in session log, history log, or set null
    if (messages.session.length > 0) {
      selectedMessageRef = {
        log: 'session',
        index: messages.session.length - 1
      }
      selectedMessage = messages.session[selectedMessageRef.index]
    } else if (showHistory && messages.history.length > 0) {
      selectedMessageRef = {
        log: 'history',
        index: messages.history.length - 1
      }
      selectedMessage = messages.history[selectedMessageRef.index]
    } else {
      selectedMessageRef = null
      selectedMessage = null
    }
  }

  function toggleShowHistory(event: { currentTarget: HTMLInputElement }) {
    showHistory = event.currentTarget.checked

    if (showHistory) {
      // Select last message in history log if it has entries or null,
      // otherwise leave selected message unchanged
      if (!selectedMessageRef) {
        // select last message in history log
        if (messages.history.length > 0) {
          // set ref and selected to last in history log
          selectedMessageRef = {
            log: 'history',
            index: messages.history.length - 1
          }
          selectedMessage = messages.history[selectedMessageRef.index]
        }
      }
    } else {
      // Select last message in session log if it has
      // entries, otherwise set selected to null
      if (selectedMessageRef?.log === 'history') {
        if (messages.session.length > 0) {
          selectedMessageRef = {
            log: 'session',
            index: messages.session.length - 1
          }
          selectedMessage = messages.session[selectedMessageRef.index]
        } else {
          selectedMessageRef = null
          selectedMessage = null
        }
      }
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
        <div class="show-history-control">
          <input type="checkbox" on:change={toggleShowHistory} />
          <span>Show history</span>
        </div>
        <div class="message-controls">
          {#if (!showHistory && messages.session.length === 0) || (showHistory && messages.session.length === 0 && messages.history.length === 0)}
            No messages to display
          {:else}
            {#each namespaces as namespace}
              {#if namespaceControlsMode === 'clear-session' && messages.session.some(message => namespaceToString(message.state.app.namespace) === namespace)}
                <button
                  in:fade={{ duration: 50 }}
                  class="clear-session-button"
                  on:click={() => handleClearMessages(namespace)}
                >
                  <span><XIcon /></span>
                  {namespace}
                </button>
              {:else if namespaceControlsMode === 'remove-history'}
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
        {#if messages.session.length > 0 || (showHistory && messages.history.length > 0)}
          <h3 class="section-label">Event Log</h3>
        {/if}
        <div class="message-history">
          {#if showHistory}
            {#each messages.history as message, index}
              <button
                style:color="#999999"
                style:background-color={selectedMessageRef.log === 'history' &&
                index === selectedMessageRef?.index
                  ? '#81a1c1'
                  : '#fdfdfe'}
                on:click={() => handleMessageClick('history', index)}
              >
                {`${message.type} ${message.detail.type}`}
              </button>
            {/each}
          {/if}

          {#each messages.session as message, index}
            <button
              style:background-color={selectedMessageRef.log === 'session' &&
              index === selectedMessageRef?.index
                ? '#81a1c1'
                : '#fdfdfe'}
              on:click={() => handleMessageClick('session', index)}
            >
              {`${message.type} ${message.detail.type}`}
            </button>
          {/each}
        </div>
      </div>

      <div class="message-section">
        {#if messages.session.length > 0 || (showHistory && messages.history.length > 0)}
          <h3 class="section-label">Event</h3>
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
    grid-template-columns: 1fr 1fr 1fr;
    color: #dddde4;
  }

  .show-history-control {
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    gap: 3px;
  }

  .show-history-control > input {
    margin: 0 0 3px 0;
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
