<script>
  export let title = "No results found";
  export let message = "Try adjusting your search terms or start a new search.";
</script>

<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </svg>
  <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
  <p class="mt-2 text-gray-600 dark:text-gray-400 max-w-md">{message}</p>
</div>