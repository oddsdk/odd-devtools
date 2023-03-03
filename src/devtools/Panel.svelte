<script lang="ts">
  import {
    connect,
    connection,
    disconnect,
    detail,
    eventHistory,
    eventType,
    state
  } from './devtools'

  let connectionError = false

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
</script>

<div class="wrapper">
  <div>
    {#if $connection.connected}
      <button on:click={handleDisconnect}>Stop</button>
    {:else}
      <button on:click={handleConnect}>Start</button>
    {/if}
  </div>

  {#if connectionError}
    <div
      style="display: inline-block; color: #b31b1b; font-size: 14px; margin-top: 10px"
    >
      Please make sure Webnative debug mode is set to true. See the
      <a
        href="https://guide.fission.codes/developers/webnative/initialization#configuration"
        target="_blank"
        rel="noreferrer"
        style="color: #b31b1b"
      >
        Webnative configuration guide
      </a>
      for instructions on enabling debug mode.
    </div>
  {/if}

  <h2>Data from Webnative</h2>

  <h4>Event History: {JSON.stringify($eventHistory)}</h4>

  <h4>Event: {$eventType}</h4>

  {#if $detail}
    <h4 style="margin: 2px">Detail</h4>
    <pre style="margin: 4px">
{JSON.stringify($detail, null, 2)}
    </pre>
  {/if}

  <div>
    <h4 style="margin: 2px">State</h4>
    <pre style="margin: 4px">
{JSON.stringify($state, null, 2)}
    </pre>
  </div>
</div>

<style>
  .wrapper {
    height: 100vh;
    padding: 8px;
  }
  * {
    background-color: #dedede;
    color: #343434;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }
</style>
