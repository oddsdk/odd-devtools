<script lang="ts">
  import {
    data,
    detail,
    eventHistory,
    eventType,
    mousePosition,
    startMouseTracking,
    stopMouseTracking
  } from './panel'

  let tracking = false

  function handleTrackingControl() {
    if (tracking) {
      tracking = false
      stopMouseTracking()

      mousePosition.set({ x: 0, y: 0 })
    } else {
      tracking = true
      startMouseTracking()
    }
  }
</script>

<div class="wrapper">
  <!-- <h2 class="tracking-header">Track mouse coordinates in the page.</h2>

  <button on:click={handleTrackingControl}>
    {#if tracking}
      Stop Tracking
    {:else}
      Start Tracking
    {/if}
  </button>

  <p>
    X: <span>{$mousePosition.x}</span>
  </p>
  <p>
    Y: <span>{$mousePosition.y}</span>
  </p> -->

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
{JSON.stringify($data, null, 2)}
    </pre>
  </div>
</div>

<style>
  .wrapper {
    height: 100vh;
    padding: 8px;
  }

  /* .tracking-header {
    margin-top: 0px;
  } */

  * {
    background-color: #dedede;
    color: #343434;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }
</style>
