<script lang="ts">
  import { onDestroy } from 'svelte'
  import { connect, connection, disconnect, eventStore } from './devtools'

  let connectionError = false
  let selectedEvent = null
  let selectedEventIndex
  let events = []

  const unsubscribeEvents = eventStore.subscribe(store => {
    events = store

    if (events.length === 1) {
      selectedEvent = events[0]
      selectedEventIndex = 0
    }
  })

  async function handleConnect() {
    connectionError = false

    const { connecting } = await connect()

    if (!connecting) connectionError = true
  }

  async function handleDisconnect() {
    connectionError = false

    const disconnecting = await disconnect()

    if (!disconnecting) connectionError = true
  }

  function handleEventClick(index) {
    selectedEvent = events[index]
    selectedEventIndex = index
    console.log('selected event', selectedEvent)
  }

  onDestroy(unsubscribeEvents)
</script>

<div class="panel-wrapper">
  <div>
    {#if $connection.connected}
      <button on:click={handleDisconnect}>Stop</button>
    {:else}
      <button on:click={handleConnect}>Start</button>
    {/if}
  </div>

  {#if connectionError}
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
  {/if}

  <div class="wrapper">
    <div>
      <h3 class="section-label">Event History</h3>
      <div class="event-history">
        {#each events as event, index}
          {#if event.type === 'connect' || event.type === 'disconnect'}
            <button
              style:background-color={index === selectedEventIndex
                ? '#ede55a'
                : '#fefefe'}
              on:click={() => handleEventClick(index)}
            >
              {event.type}
            </button>
          {:else}
            <button
              style:background-color={index === selectedEventIndex
                ? '#ede55a'
                : '#fefefe'}
              on:click={() => handleEventClick(index)}
            >
              {`${event.type} ${event.detail.type}`}
            </button>
          {/if}
        {/each}
      </div>
    </div>

    <div>
      <h3 class="section-label">Event</h3>
      {#if selectedEvent}
        <div class="event-wrapper">
          {#if selectedEvent.detail}
            <h4 class="section-label">Detail</h4>
            <pre style="margin: 4px">
{JSON.stringify(selectedEvent.detail, null, 2)}
    </pre>
          {/if}
          <h4 class="section-label">State</h4>
          <pre style="margin: 4px">
{JSON.stringify(selectedEvent.state, null, 2)}
    </pre>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .panel-wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 8px;
    width: 100vw;
    height: 100vh;
    padding: 8px;
    overflow-y: auto;

    background-color: #1e1e1e;
    color: #f2f2f2;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }

  .wrapper {
    display: grid;
    grid-template-columns: minmax(min-content, 15vw) 80vw;
    grid-auto-flow: column;
    gap: 10px;
  }

  .event-wrapper {
    background-color: #fefefe;
    color: #333333;
    border: 1px solid #fcfcfc;
    border-radius: 3px;
    overflow: auto;
  }

  .event-history {
    display: grid;
    grid-template-columns: masonry;
    gap: 2px;
  }

  .section-label {
    margin: 2px 0 4px 2px;
    white-space: nowrap;
  }

  .connection-error {
    display: inline-block;
    color: #fefefe;
    font-size: 14px;
    margin-top: 10px;
  }

  button {
    background-color: #fefefe;
    border: 1px solid transparent;
    border-radius: 3px;
  }
</style>
