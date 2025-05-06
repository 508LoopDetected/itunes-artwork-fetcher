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

// Persist search term to localStorage
searchTerm.subscribe((value) => {
  if (browser) {
    localStorage.setItem('searchTerm', value);
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