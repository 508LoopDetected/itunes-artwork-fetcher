<script>
  import '../app.css';
  import { infoPanel } from '$lib/stores/uiStore';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  
  // Get the current year for the footer
  const currentYear = new Date().getFullYear();
</script>

<div class="min-h-screen flex flex-col">
  <div class="fixed inset-0 -z-10 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
    <!-- Greyscale "bubbles" -->
    <div class="absolute top-[10%] left-[15%] w-[45vw] h-[45vh] rounded-full bg-zinc-300/15 dark:bg-zinc-700/15 blur-[120px]"></div>
    <div class="absolute bottom-[15%] right-[10%] w-[40vw] h-[40vh] rounded-full bg-zinc-300/15 dark:bg-zinc-700/15 blur-[120px]"></div>
    <div class="absolute top-[60%] left-[50%] w-[30vw] h-[30vh] rounded-full bg-zinc-300/10 dark:bg-zinc-700/10 blur-[150px]"></div>
    
    <!-- Very subtle noise texture overlay -->
    <div class="absolute inset-0 bg-noise opacity-[0.02]"></div>
  </div>
  <header class="border-b border-zinc-200 dark:border-zinc-800">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <img src="logo.svg" class="h-8 inline mr-2 mb-1 text-accent" />
      </div>
      <div class="flex items-center space-x-4">
        <!-- Info button -->
        <button 
          type="button"
          class="p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none transition-colors"
          aria-label="Toggle information panel"
          on:click={() => infoPanel.update(state => !state)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <!-- Theme toggle -->
        <ThemeToggle />
      </div>
    </div>
  </header>
  
  <main class="flex-grow container mx-auto px-4 py-8">
    <slot />
  </main>
  
  <footer class="border-t border-gray-200 dark:border-gray-800 py-6">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Built with <span class="text-orange-500">SvelteKit</span>
        </p>
        <div class="mt-4 md:mt-0">
          <a
            href="https://github.com/508LoopDetected/itunes-artwork-fetcher"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            508LoopDetected
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>