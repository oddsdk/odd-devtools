<script lang="ts">
  import { fade } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
</script>

<svg
  width="37"
  height="18"
  viewBox="0 0 37 18"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    in:fade={{ duration: 200, easing: quintOut }}
    d="M27.3131 17.5C32.0075 17.5 35.8131 13.6944 35.8131 9C35.8131 4.30558 32.0075 0.5 27.3131 0.5C22.6187 0.5 18.8131 4.30558 18.8131 9C18.8131 13.6944 22.6187 17.5 27.3131 17.5Z"
    fill="#f15072"
    stroke="#E1E2EA"
  />
  <path
    in:fade={{ delay: 300, duration: 200, easing: quintOut }}
    d="M17.9799 17.5C22.6743 17.5 26.4799 13.6944 26.4799 9C26.4799 4.30558 22.6743 0.5 17.9799 0.5C13.2854 0.5 9.47986 4.30558 9.47986 9C9.47986 13.6944 13.2854 17.5 17.9799 17.5Z"
    fill="#f15072"
    stroke="#E1E2EA"
  />
  <path
    in:fade={{ delay: 600, duration: 200, easing: quintOut }}
    d="M8.80952 17.5C13.41 17.5 17.119 13.683 17.119 9C17.119 4.31701 13.41 0.5 8.80952 0.5C4.20901 0.5 0.5 4.31701 0.5 9C0.5 13.683 4.20901 17.5 8.80952 17.5Z"
    fill="#E1E2EA"
    stroke="#E1E2EA"
  />
  <path
    in:fade={{ delay: 600, duration: 200, easing: quintOut }}
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M8.80952 14.1622C11.5926 14.1622 13.8488 11.851 13.8488 9C13.8488 6.14899 11.5926 3.83779 8.80952 3.83779C6.0264 3.83779 3.77023 6.14899 3.77023 9C3.77023 11.851 6.0264 14.1622 8.80952 14.1622ZM8.80952 17C13.1226 17 16.619 13.4183 16.619 9C16.619 4.58172 13.1226 1 8.80952 1C4.49644 1 1 4.58172 1 9C1 13.4183 4.49644 17 8.80952 17Z"
    fill="#f15072"
  />
</svg>
