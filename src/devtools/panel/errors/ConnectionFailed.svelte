<script lang="ts">
  import { fly } from 'svelte/transition'
  import { quintIn } from 'svelte/easing'

  export let error: string
</script>

<div class="grid justify-center items-center">
  <div
    class="grid grid-align-row grid-rows-2 max-w-[400px] justify-center"
    in:fly={{ duration: 275, easing: quintIn }}
  >
    <div
      class="h-[39px] text-[26px] tracking-[-0.011em] text-center font-bold text-red-500 dark:text-red-400"
    >
      Unable to connect to the ODD SDK
    </div>
    <div class="text-center text-xs text-medium font-mono">
      Please open an issue in the
      <a
        class="text-blue-500 dark:text-blue-400"
        href="https://github.com/oddsdk/odd-devtools/issues"
        target="_blank"
        rel="noreferrer"
      >
        ODD Devtools issue tracker
      </a>
      and include the following error message:
    </div>
    <div
      class="text-center text-xs text-medium font-mono text-red-500 dark:text-red-400"
    >
      {error}
    </div>
  </div>
</div>
