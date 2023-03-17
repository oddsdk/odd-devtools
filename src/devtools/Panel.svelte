<script lang="ts">
  import './panel/panel.css'

  import Events from './panel/Events.svelte'
  import Namespaces from './panel/Namespaces.svelte'
  import Nav from './panel/Nav.svelte'
</script>

<div
  class="min-h-screen min-w-screen grid grid-rows-[32px_auto] divide-y divide-[#4A4C50] text-white bg-black"
>
  <Nav />
  <div class="grid grid-cols-[1fr_4fr] divide-x divide-[#4A4C50]">
    <Namespaces />
    <Events />
  </div>
</div>
