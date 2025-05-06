<script>
  import '../app.css';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  
  // Get the current year for the footer
  const currentYear = new Date().getFullYear();
</script>

<div class="fixed inset-0 -z-10 bg-slate-900/95 dark:bg-black/95 overflow-hidden">
  <!-- Subtle cool blue bubble gradients -->
  <div class="absolute top-[10%] left-[15%] w-[40vw] h-[40vh] rounded-full bg-sky-500/10 dark:bg-sky-600/10 blur-[100px]"></div>
  <div class="absolute bottom-[15%] right-[10%] w-[35vw] h-[35vh] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[100px]"></div>
  <div class="absolute top-[60%] left-[50%] w-[25vw] h-[25vh] rounded-full bg-cyan-400/10 dark:bg-cyan-500/10 blur-[120px]"></div>
  
  <!-- Optional subtle noise texture overlay -->
  <div class="absolute inset-0 bg-noise opacity-[0.03]"></div>
</div>

<div class="min-h-screen flex flex-col">
  <div class="bg-gradient-overlay"></div>
  <header class="border-b border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <a href="/" class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline mr-2 mb-2" viewBox="0 0 384 512" fill="currentColor">
            <!-- Apple logo -->
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
          </svg>
          Hi-Res Artwork Fetcher
        </a>
      </div>
      <div>
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