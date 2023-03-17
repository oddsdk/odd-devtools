<script lang="ts">
  import { onDestroy } from 'svelte'
  import { JsonView } from '@zerodevx/svelte-json-view'
  import { connectionStore, messageStore } from './panel'

  let selectedMessage = null
  let selectedMessageIndex
  let messages = []

  const unsubscribeMessages = messageStore.subscribe(store => {
    messages = store

    if (messages.length === 1) {
      selectedMessage = messages[0]
      selectedMessageIndex = 0
    }
  })

  function handleMessageClick(index) {
    selectedMessage = messages[index]
    selectedMessageIndex = index
    console.log('selected message', selectedMessage)
  }

  onDestroy(unsubscribeMessages)
</script>

<div class="panel-wrapper">
  {#if $connectionStore.error === 'DebugModeOff'}
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
      {#if $connectionStore.connected}
        <div>Connected to Webnative</div>
        {#if messages.length === 0}
          <div class="no-messages">No messages received yet</div>
        {/if}
      {/if}
    </div>

    <div class="wrapper">
      <div>
        {#if messages.length > 0}
          <h3 class="section-label">Event History</h3>
        {/if}
        <div class="message-history">
          {#each messages as message, index}
            <button
              style:background-color={index === selectedMessageIndex
                ? '#81a1c1'
                : '#fdfdfe'}
              on:click={() => handleMessageClick(index)}
            >
              {`${message.type} ${message.detail.type}`}
            </button>
          {/each}
        </div>
      </div>

      <div class="message-section">
        {#if messages.length > 0}
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
    grid-template-columns: 1fr 1fr;
    color: #dddde4;
  }

  .no-messages {
    display: grid;
    justify-content: end;
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
</style>
