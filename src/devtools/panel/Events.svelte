<script lang="ts">
  import SearchIcon from './icons/Search.svelte'
</script>

<div class="grid grid-rows-[19px_31px_auto] divide-y divide-[#4A4C50]">
  <div
    class="px-4 py-1 bg-[#262626] text-[9px] leading-[11px] font-medium uppercase"
  >
    Events
  </div>
  <div class="flex flex-row gap-2 justify-start items-center px-4 py-2">
    <SearchIcon />
    <span class="text-xs">Filter events...</span>
  </div>
  <div class="grid grid-cols-[1fr_3fr] divide-x divide-[#4A4C50]">
    <div class="px-4 py-2">Event list</div>
    <div class="px-4 py-2">Event Payload</div>
  </div>
</div>
