<script lang="ts">
  import {
    mousePosition,
    startMouseTracking,
    stopMouseTracking,
  } from "./panel";

  let tracking = false;

  function handleTrackingControl() {
    if (tracking) {
      tracking = false;
      stopMouseTracking();

      mousePosition.set({ x: 0, y: 0 });
    } else {
      tracking = true;
      startMouseTracking();
    }
  }
</script>

<div class="wrapper">
  <h2 class="tracking-header">Track mouse coordinates in the page.</h2>

  <button on:click={handleTrackingControl}>
    {#if tracking}
      Stop Tracking
    {:else}
      Start Tracking
    {/if}
  </button>

  <p>X: <span>{$mousePosition.x}</span></p>
  <p>Y: <span>{$mousePosition.y}</span></p>
</div>

<style>
  .wrapper {
    height: 100vh;
    padding: 8px;
  }

  .tracking-header {
    margin-top: 0px;
  }

  * {
    background-color: #dedede;
    color: #343434;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
  }
</style>
