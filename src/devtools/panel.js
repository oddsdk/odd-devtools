import Panel from '/src/devtools/Panel.svelte'


// RENDER PANEL

const target = document.getElementById('app')

function render() {
  new Panel({ target })
}

document.addEventListener('DOMContentLoaded', render)
