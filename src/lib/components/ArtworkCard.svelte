<script>
  export let artwork;
  export let showDownloadButton = true;
  
  import { onMount } from 'svelte';
  import { getOptimalArtworkUrl } from '$lib/services/itunesApi';
  
  let imageLoaded = false;
  let imageError = false;
  let isHovered = false;
  let dimensions = null;
  
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
          
          // Start loading high-res image dimensions in background
          loadImageDimensions();
        }
      }, { rootMargin: '200px' });
      
      observer.observe(cardElement);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      shouldLoad = true;
      loadImageDimensions();
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  });
  
  // Function to load image dimensions
  function loadImageDimensions() {
    const img = new Image();
    img.onload = () => {
      dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
    };
    img.onerror = () => {
      dimensions = null;
    };
    img.src = highResUrl;
  }
  
  function handleImageLoad() {
    imageLoaded = true;
  }
  
  function handleImageError() {
    imageError = true;
  }
  
  function handleMouseEnter() {
    isHovered = true;
    // Dispatch custom event to parent
    cardElement.dispatchEvent(new CustomEvent('artwork-hover', {
      bubbles: true,
      detail: { id: artwork.collectionId }
    }));
  }
  
  function handleMouseLeave() {
    isHovered = false;
    // Dispatch custom event to parent
    cardElement.dispatchEvent(new CustomEvent('artwork-unhover', {
      bubbles: true
    }));
  }
</script>

<div 
  class="relative overflow-hidden rounded-md shadow-md transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-800 h-full"
  class:transform={isHovered}
  class:scale-[1.03]={isHovered}
  class:translate-y-[-8px]={isHovered}
  class:card-hovered={isHovered}
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
    
    <!-- Image dimensions badge -->
    <div class="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
      {#if dimensions}
        {dimensions.width}×{dimensions.height}
      {:else}
        Loading...
      {/if}
    </div>
    
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
  
  <!-- Quick action button that appears on hover -->
  <div 
    class="absolute top-3 right-3 opacity-0 transition-opacity duration-300"
    class:opacity-100={isHovered}
  >
    <a 
      href={highResUrl} 
      target="_blank"
      rel="noopener noreferrer"
      class="p-2 bg-white dark:bg-zinc-800 text-accent rounded-full shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent"
      title="View artwork"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </a>
  </div>
</div>

<style>
  /* This needs to go in a global stylesheet to properly implement the greyscale hover effect */
  :global(.results-grid:has(.card-hovered) > div:not(.card-hovered)) {
    filter: grayscale(1);
    opacity: 0.7;
    transition: all 0.3s ease;
  }
</style>