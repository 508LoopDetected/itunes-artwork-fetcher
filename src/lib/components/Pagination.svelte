<script>
  import { createEventDispatcher } from 'svelte';
  
  export let currentPage = 1;
  export let totalPages = 1;
  export let maxPageButtons = 5;
  export let showPageNumbers = true;
  export let showPageJump = true;
  
  const dispatch = createEventDispatcher();
  
  let jumpToPage = currentPage;
  
  // Calculate which page numbers to show
  $: pageNumbers = getPageNumbers(currentPage, totalPages, maxPageButtons);
  $: disablePrev = currentPage <= 1;
  $: disableNext = currentPage >= totalPages;
  
  function getPageNumbers(current, total, max) {
    // Always show first and last
    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const showingFirstEllipsis = current > 3;
    const showingLastEllipsis = current < total - 2;
    
    // Calculate the pager
    let pages = [];
    
    // Always include the first page
    pages.push(1);
    
    // Add ellipsis after first if needed
    if (showingFirstEllipsis) {
      pages.push(null); // null represents ellipsis
    }
    
    // Determine the range of numbered pages
    let rangeStart = showingFirstEllipsis ? Math.max(current - 1, 2) : 2;
    let rangeEnd = showingLastEllipsis ? Math.min(current + 1, total - 1) : total - 1;
    
    // Add the middle range of pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last if needed
    if (showingLastEllipsis) {
      pages.push(null); // null represents ellipsis
    }
    
    // Always include the last page
    if (total > 1) {
      pages.push(total);
    }
    
    return pages;
  }
  
  function goToPage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch('pageChange', { page });
    }
  }
  
  function handleJumpSubmit(e) {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      goToPage(pageNum);
    }
  }
</script>

<div class="flex flex-col items-center space-y-4 my-8">
  <!-- Page info -->
  <p class="text-sm text-zinc-500 dark:text-zinc-400">
    Page {currentPage} of {totalPages}
  </p>
  
  <!-- Pagination controls -->
  <div class="inline-flex shadow-sm rounded-md overflow-hidden">
    <!-- First page button -->
    <button
      type="button"
      class="relative inline-flex items-center justify-center px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-zinc-800"
      disabled={disablePrev}
      on:click={() => goToPage(1)}
      aria-label="Go to first page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <!-- Previous button -->
    <button
      type="button"
      class="relative inline-flex items-center justify-center px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-zinc-800"
      disabled={disablePrev}
      on:click={() => goToPage(currentPage - 1)}
      aria-label="Go to previous page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
    
    {#if showPageNumbers}
      <!-- Page numbers -->
      {#each pageNumbers as page}
        {#if page === null}
          <!-- Ellipsis -->
          <span class="relative inline-flex items-center justify-center px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            ...
          </span>
        {:else}
          <button
            type="button"
            class={`relative inline-flex items-center justify-center px-4 py-2 border text-sm font-medium transition-colors
              ${page === currentPage 
                ? 'text-white bg-accent hover:bg-accent-600 border-accent' 
                : 'text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
            on:click={() => goToPage(page)}
          >
            {page}
          </button>
        {/if}
      {/each}
    {/if}
    
    <!-- Next button -->
    <button
      type="button"
      class="relative inline-flex items-center justify-center px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-zinc-800"
      disabled={disableNext}
      on:click={() => goToPage(currentPage + 1)}
      aria-label="Go to next page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <!-- Last page button -->
    <button
      type="button"
      class="relative inline-flex items-center justify-center px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-zinc-800"
      disabled={disableNext}
      on:click={() => goToPage(totalPages)}
      aria-label="Go to last page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm10 0a1 1 0 010-1.414L18.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
  
  <!-- Jump to page form -->
  {#if showPageJump && totalPages > 5}
    <div class="mt-3">
      <form on:submit={handleJumpSubmit} class="flex items-center space-x-2">
        <label for="page-jump" class="text-sm text-zinc-500 dark:text-zinc-400">Go to page</label>
        <input
          id="page-jump"
          type="number"
          min="1"
          max={totalPages}
          bind:value={jumpToPage}
          class="w-16 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          class="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
        >
          Go
        </button>
      </form>
    </div>
  {/if}
</div>