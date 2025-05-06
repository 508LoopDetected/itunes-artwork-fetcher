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
  });
</script>

<div class="max-w-7xl mx-auto">
  <div class="text-center mb-10">
    <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
      <span class="block">Apple Music / iTunes</span>
      <span class="block text-primary-600 dark:text-primary-400">Hi-Res Artwork Fetcher</span>
    </h1>
    <p class="mt-3 max-w-md mx-auto text-base text-gray-600 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
      Find and download high-resolution album artwork from Apple Music. Just search for an artist or album.
    </p>
  </div>
  
  <div class="mb-8">
    <SearchForm on:search={handleSearch} />
  </div>
  
  {#if $error}
    <ErrorDisplay error={$error} onRetry={() => handleSearch({ detail: { term: $searchTerm } })} />
  {/if}
  
  {#if $loading}
    <div class="results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-pulse">
      {#each Array(6) as _, i}
        <div class="bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md aspect-square"></div>
      {/each}
    </div>
  {:else if $artworkList.length > 0}
    <div class="results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
      message="Search for your favorite artist or album to find high-resolution artwork." 
    />
  {/if}
  
  <div class="mt-12 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-sm backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
    <p class="text-gray-700 dark:text-gray-300 mb-4">
      This app uses the iTunes Search API to find album artwork, but with useful twist: while the API normally returns small 100×100 pixel images, this app simply modifies the URL to request the original high-resolution versions instead (up to 10,000×10,000 pixels). When you click on an album cover, you're therefore accessing the source image directly from Apple's servers at the highest resolution available &mdash; often much larger than what's shown in iTunes or Apple Music's GUI.
    </p>
  </div>
</div>
