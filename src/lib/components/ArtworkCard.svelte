<script>
  export let artwork;
  export let showDownloadButton = true;
  
  import { onMount } from 'svelte';
  import { getOptimalArtworkUrl } from '$lib/services/itunesApi';
  
  let imageLoaded = false;
  let imageError = false;
  let isHovered = false;
  let dimensions = null;
  let loadingDimensions = false;
  
  // Get optimized artwork URLs
  const thumbnailUrl = getOptimalArtworkUrl(artwork.artworkUrl100, 600);
  const highResUrl = getOptimalArtworkUrl(artwork.artworkUrl100, 10000);
  
  // Lazy loading with IntersectionObserver
  let cardElement;
  let observer;
  let shouldLoad = false;
  
  onMount(() => {
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          shouldLoad = true;
          observer.disconnect();
        }
      }, { rootMargin: '200px' });
      
      observer.observe(cardElement);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      shouldLoad = true;
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  });
  
  
  function handleImageLoad() {
    imageLoaded = true;
  }
  
  function handleImageError() {
    imageError = true;
  }
  
  function handleMouseEnter() {
    isHovered = true;
    // Load dimensions on first hover
    if (!dimensions && !loadingDimensions) {
      loadDimensions();
    }
  }
  
  function handleMouseLeave() {
    isHovered = false;
  }
  
  function loadDimensions() {
    loadingDimensions = true;
    const img = new Image();
    img.onload = () => {
      dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      loadingDimensions = false;
    };
    img.onerror = () => {
      loadingDimensions = false;
    };
    img.src = highResUrl;
  }
</script>

<div 
  class="relative overflow-hidden rounded-md shadow-md transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-800 h-full"
  class:transform={isHovered}
  class:scale-[1.03]={isHovered}
  class:translate-y-[-8px]={isHovered}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  bind:this={cardElement}
>
  <div class="relative aspect-square overflow-hidden rounded-t-md">
    {#if shouldLoad}
      <!-- Placeholder with gradient shimmer effect -->
      <div 
        class="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" 
        class:hidden={imageLoaded && !imageError}
        style="background-size: 200% 100%; animation: shimmer 1.5s infinite linear; background-position: 0% center;"
      ></div>
      
      {#if imageError}
        <div class="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      {:else}
        <a href={highResUrl} target="_blank" rel="noopener noreferrer" class="block">
          <img
            src={thumbnailUrl}
            alt={`${artwork.artistName} - ${artwork.collectionName}`}
            class="w-full h-full object-cover transition-all duration-500"
            class:opacity-0={!imageLoaded}
            on:load={handleImageLoad}
            on:error={handleImageError}
          />
        </a>
      {/if}
    {:else}
      <div 
        class="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800"
        style="background-size: 200% 100%; animation: shimmer 1.5s infinite linear; background-position: 0% center;"
      ></div>
    {/if}
    
    <!-- Image dimensions badge (only shows on hover) -->
    {#if isHovered}
      <div class="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
        {#if dimensions}
          {dimensions.width}×{dimensions.height}
        {:else if loadingDimensions}
          <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {:else}
          Hover to load
        {/if}
      </div>
    {/if}
    
    {#if showDownloadButton}
      <div 
        class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300 flex justify-end items-center"
        class:opacity-100={isHovered}
      >
        <a 
          href={highResUrl} 
          download
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 bg-accent text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-transform duration-200 hover:scale-110"
          title="Download high resolution artwork"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
    {/if}
  </div>
  
  <div class="p-4">
    <h3 class="text-lg font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1">{artwork.collectionName}</h3>
    <p class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">{artwork.artistName}</p>
  </div>
  
</div>

