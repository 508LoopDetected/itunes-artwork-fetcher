import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Create stores
export const searchTerm = writable(browser && localStorage.getItem('searchTerm') || '');
export const artworkList = writable([]);
export const loading = writable(false);
export const error = writable(null);
export const currentPage = writable(1);
export const resultsPerPage = writable(8);
export const searchSuggestions = writable([]);

// Debounced localStorage write
let debounceTimer;
searchTerm.subscribe((value) => {
  if (browser) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      localStorage.setItem('searchTerm', value);
    }, 500); // Wait 500ms after user stops typing
  }
});

// Derived store for pagination
export const pagination = derived(
  [artworkList, currentPage, resultsPerPage],
  ([$artworkList, $currentPage, $resultsPerPage]) => {
    const totalItems = $artworkList.length;
    const totalPages = Math.ceil(totalItems / $resultsPerPage);
    
    const startIndex = ($currentPage - 1) * $resultsPerPage;
    const endIndex = Math.min(startIndex + $resultsPerPage, totalItems);
    
    const currentItems = $artworkList.slice(startIndex, endIndex);
    
    return {
      totalItems,
      totalPages,
      currentPage: $currentPage,
      currentItems,
      hasNextPage: $currentPage < totalPages,
      hasPrevPage: $currentPage > 1
    };
  }
);