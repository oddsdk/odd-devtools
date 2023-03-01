<script lang="ts">
  import {
    connect,
    disconnect,
    detail,
    eventHistory,
    eventType,
    state
  } from './devtools'

  let connected = false

  function handleConnect() {
    connect()
    connected = true
  }

  function handleDisconnect() {
    disconnect()
    connected = false
  }
</script>

<div class="wrapper">
  {#if connected}
    <button on:click={handleDisconnect}>Stop</button>
  {:else}
    <button on:click={handleConnect}>Start</button>
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
