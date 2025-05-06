<script>
  import { infoPanel } from '$lib/stores/uiStore';
  import { slide } from 'svelte/transition';
</script>

{#if $infoPanel}
  <div 
    transition:slide={{ duration: 200 }}
    class="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6 shadow-md backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 mb-8 border border-zinc-200 dark:border-zinc-700"
  >
    <h2 class="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100 flex items-center">
      How the Fetcher Works
      <button
        class="ml-auto p-1 rounded-full text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none"
        on:click={() => infoPanel.set(false)}
        aria-label="Close information panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </h2>
    <p class="text-zinc-700 dark:text-zinc-300 mb-4">
      This app leverages the iTunes Search API to find album artwork, but with a useful twist: while the API normally returns <a href="https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/93/89/d6/9389d633-f89c-4ae1-a79d-1257d020022f/18UMGIM36938.rgb.jpg/100x100bb.jpg" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">small 100w × 100h images</a>, this app modifies the URL to request the <a href="https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/93/89/d6/9389d633-f89c-4ae1-a79d-1257d020022f/18UMGIM36938.rgb.jpg/10000x10000bb.jpg" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">original high-resolution versions</a> instead (up to 10,000w × 10,000h pixels).
    </p>
    <p class="text-zinc-700 dark:text-zinc-300">
      When you click on an album cover, you're therefore accessing the source image directly from Apple's servers at the highest resolution available — often much larger than what's shown in iTunes or Apple Music.
    </p>
  </div>
{/if}