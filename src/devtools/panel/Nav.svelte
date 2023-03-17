<script lang="ts">
  import TrashIcon from './icons/Trash.svelte'
  import MoreVerticalIcon from './icons/MoreVertical.svelte'
  import WebnativeIcon from './icons/Webnative.svelte'
</script>

<div class="grid grid-cols-[4fr_1fr] justify-center">
  <div class="flex flex-row gap-2 px-4 py-2 justify-start">
    <WebnativeIcon />
    <span class="text-xs">Webnative</span>
  </div>
  <div class="flex flex-row gap-2 py-2 justify-end">
    <div class="flex flex-row gap-2">
      <span class="text-xs">Clear logs</span>
      <TrashIcon />
    </div>
    <div class="px-3">
      <MoreVerticalIcon />
    </div>
  </div>
</div>
