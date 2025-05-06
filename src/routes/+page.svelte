<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  // Import stores
  import { 
    searchTerm, 
    artworkList, 
    currentPage, 
    loading, 
    error,
    pagination
  } from '$lib/stores/artworkStore';
  
  // Import components
  import InfoPanel from '$lib/components/InfoPanel.svelte';
  import SearchForm from '$lib/components/SearchForm.svelte';
  import ArtworkCard from '$lib/components/ArtworkCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
  
  // Import services
  import { searchArtwork } from '$lib/services/itunesApi';
  
  let searchCount = 0;
  
  // Function to handle search
  async function handleSearch({ detail }) {
    const { term } = detail;
    
    if (!term || term.trim() === '') return;
    
    loading.set(true);
    error.set(null);
    currentPage.set(1);
    
    try {
      const data = await searchArtwork(term);
      
      if (data.results && data.results.length > 0) {
        // Process results to enhance the data
        const processedResults = data.results.map(result => ({
          ...result,
          // Add search count to track the search it was part of
          searchCount: searchCount
        }));
        
        artworkList.set(processedResults);
        searchCount++;
      } else {
        artworkList.set([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      error.set(err);
    } finally {
      loading.set(false);
    }
  }
  
  // Function to handle page change
  function handlePageChange(event) {
    currentPage.set(event.detail.page);
    // Scroll to top of results
    if (browser) {
      window.scrollTo({
        top: document.querySelector('.results-grid')?.offsetTop - 100 || 0,
        behavior: 'smooth'
      });
    }
  }
  
  // Perform search on mount if searchTerm exists
  onMount(() => {
    if ($searchTerm) {
      handleSearch({ detail: { term: $searchTerm } });
    }
    
    // Show info panel the first time a user visits
    const hasSeenInfo = localStorage.getItem('hasSeenInfo');
    if (!hasSeenInfo) {
      infoPanel.set(true);
      localStorage.setItem('hasSeenInfo', 'true');
    }
  });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <!-- Info Panel at the top -->
  <InfoPanel />
  
  <div class="text-center mb-10">
    <h1 class="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl md:text-6xl">
      <span class="block">Apple Music / iTunes</span>
      <span class="block text-accent">Hi-Res Album Art Fetcher</span>
    </h1>
    <p class="mt-3 max-w-md mx-auto text-base text-zinc-600 dark:text-zinc-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
      Find + download high-resolution cover art directly from the iTunes API.
    </p>
  </div>
  
  <div class="mb-8">
    <SearchForm on:search={handleSearch} />
  </div>
  
  {#if $error}
    <ErrorDisplay error={$error} onRetry={() => handleSearch({ detail: { term: $searchTerm } })} />
  {/if}
  
  {#if $loading}
    <div class="results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
      {#each Array(6) as _, i}
        <div class="bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden shadow-md aspect-square"></div>
      {/each}
    </div>
  {:else if $artworkList.length > 0}
    <div class="results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
      {#each $pagination.currentItems as artwork (artwork.collectionId)}
        <ArtworkCard {artwork} />
      {/each}
    </div>
    
    {#if $pagination.totalPages > 1}
      <Pagination 
        currentPage={$pagination.currentPage} 
        totalPages={$pagination.totalPages} 
        on:pageChange={handlePageChange} 
      />
    {/if}
  {:else if $searchTerm && !$loading}
    <EmptyState 
      title="No artwork found" 
      message="Try searching for a different artist or album." 
    />
  {:else}
    <EmptyState 
      title="Start your search" 
      message="Nothing yet &mdash; Try an artist, album name, or both!" 
    />
  {/if}
</div>