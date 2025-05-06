<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { searchTerm, searchSuggestions, loading } from '$lib/stores/artworkStore';
  import { getSuggestions } from '$lib/services/itunesApi';
  import { debounce } from '$lib/utils/helpers';
  
  const dispatch = createEventDispatcher();
  
  // Track autocomplete focus state
  let inputElement;
  let autocompleteVisible = false;
  let selectedIndex = -1;
  
  // Debounce the suggestion fetch to avoid too many requests
  const debouncedFetchSuggestions = debounce(async (term) => {
    if (term.length < 2) {
      searchSuggestions.set([]);
      return;
    }
    
    try {
      const data = await getSuggestions(term);
      // Create uniquely formatted suggestions
      const suggestions = data.results.map(result => ({
        id: result.collectionId,
        text: `${result.collectionName} - ${result.artistName}`,
        album: result.collectionName,
        artist: result.artistName
      }));
      
      // Filter out duplicates
      const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
        index === self.findIndex((s) => s.text === suggestion.text)
      );
      
      searchSuggestions.set(uniqueSuggestions);
      autocompleteVisible = uniqueSuggestions.length > 0;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      searchSuggestions.set([]);
    }
  }, 300);
  
  // Handle input changes
  function handleInput(event) {
    searchTerm.set(event.target.value);
    selectedIndex = -1;
    debouncedFetchSuggestions($searchTerm);
  }
  
  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    if ($searchTerm.trim()) {
      dispatch('search', { term: $searchTerm });
      searchSuggestions.set([]);
      autocompleteVisible = false;
    }
  }
  
  // Handle suggestion click
  function handleSuggestionClick(suggestion) {
    searchTerm.set(suggestion.text);
    searchSuggestions.set([]);
    autocompleteVisible = false;
    dispatch('search', { term: suggestion.text });
  }
  
  // Handle keyboard navigation for autocomplete
  function handleKeydown(event) {
    const suggestions = $searchSuggestions;
    if (!autocompleteVisible || suggestions.length === 0) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % suggestions.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          event.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        searchSuggestions.set([]);
        autocompleteVisible = false;
        break;
    }
  }
  
  // Close autocomplete when clicking outside
  function handleClickOutside(event) {
    if (inputElement && !inputElement.contains(event.target)) {
      searchSuggestions.set([]);
      autocompleteVisible = false;
    }
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="w-full max-w-2xl mx-auto relative">
  <form on:submit={handleSubmit} class="w-full">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <input
        type="text"
        class="input pl-10 pr-4 py-3"
        placeholder="Search by artist or album name..."
        value={$searchTerm}
        on:input={handleInput}
        on:keydown={handleKeydown}
        bind:this={inputElement}
        aria-label="Search"
        autocomplete="off"
      />
      
      {#if $loading}
        <div class="absolute inset-y-0 right-12 flex items-center">
          <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      {/if}
      
      <button
        type="submit"
        class="absolute inset-y-0 right-0 btn btn-primary rounded-l-none"
        disabled={$loading || !$searchTerm.trim()}
      >
        Search
      </button>
    </div>
    
    {#if autocompleteVisible && $searchSuggestions.length > 0}
      <div class="absolute mt-1 w-full bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
        <ul class="py-1">
          {#each $searchSuggestions as suggestion, index}
            <li>
              <button
                type="button"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors"
                class:bg-gray-100={index === selectedIndex}
                class:dark:bg-gray-700={index === selectedIndex}
                on:click={() => handleSuggestionClick(suggestion)}
              >
                <span class="block font-medium truncate">{suggestion.album}</span>
                <span class="block text-sm text-gray-500 dark:text-gray-400 truncate">{suggestion.artist}</span>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </form>
</div>