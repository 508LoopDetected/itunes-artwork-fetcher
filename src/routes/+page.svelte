<script>
  import styles from './ArtworkList.module.css';
  import { onMount } from 'svelte';
  let searchTerm = '';
  let artworkList = [];
  let currentPage = 1;
  let totalPages = 0;
  let currentArtworkPage = [];
  let resultsPerPage = 6;
  let searchSuggestions = [];

  // iTunes API
  async function fetchArtwork() {
    const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=album&limit=100`);
    const data = await response.json();
    artworkList = data.results.map(result => ({
      artworkUrl: result.artworkUrl100.replace('100x100', '1000x1000'),
      artistName: result.artistName,
      albumTitle: result.collectionName
    }));
    currentArtworkPage = artworkList.slice(0, resultsPerPage);
    totalPages = Math.ceil(artworkList.length / resultsPerPage);
  }

  // autocomplete
  async function fetchSuggestions() {
    const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=album&limit=5`);
    const data = await response.json();
    searchSuggestions = data.results.map(result => result.collectionName);
  }

  // search
  async function handleInput(event) {
    searchTerm = event.target.value;
    if (searchTerm.length >= 3) {
      await fetchSuggestions();
    } else {
      searchSuggestions = [];
    }
  }
  function handleSearch(event) {
    event.preventDefault();
    currentPage = 1;
    currentArtworkPage = artworkList.slice(0, resultsPerPage);
    fetchArtwork();
    searchSuggestions = [];
  }

  // pagination
  function handleNextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      currentArtworkPage = artworkList.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
    }
  }
  function handlePrevPage() {
    if (currentPage > 1) {
      currentPage--;
      currentArtworkPage = artworkList.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
    }
  }

  // autocomplete - populate search field
  function handleAutocompleteClick(suggestion) {
    searchTerm = suggestion;
    handleSearch(new Event('submit'));
  }
  // autocomplete - close on viewport click
  onMount(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (event) => {
        const target = event.target;
        const isAutocomplete = target.matches('.autocomplete, .autocomplete *');
        if (!isAutocomplete) {
          searchSuggestions = [];
        }
      });
    }
  });
</script>

<main>
  <form on:submit={handleSearch}>
    <input type="text" on:input={handleInput} bind:value={searchTerm} placeholder="Enter artist and/or album">
    <button type="submit">Search</button>
    {#if searchSuggestions.length}
      <ul class="autocomplete">
        {#each searchSuggestions as suggestion}
          <li class="autocomplete-item" on:click={() => handleAutocompleteClick(suggestion)}>{suggestion}</li>
        {/each}
      </ul>
    {/if}
  </form>
  {#if artworkList.length}
    <div class={styles.grid}>
      {#each currentArtworkPage as artwork}
        <div class={styles.card}>
          <a target="_blank" href={artwork.artworkUrl.replace('1000x1000', '10000x10000')} download>
            <img src={artwork.artworkUrl} alt="Album Artwork">
          </a>
          <div class={styles.artinfo}>
            <h3>{artwork.albumTitle}</h3>
            <p>{artwork.artistName}</p>
          </div>
        </div>
      {/each}
    </div>
    <div class={styles.pagination}>
      {#if currentPage > 1}
        <a href="#" on:click={handlePrevPage}>Previous</a>
      {/if}
      {#if currentPage < totalPages}
        <a href="#" on:click={handleNextPage}>Next</a>
      {/if}
    </div>
  {:else}
    <p class={styles["no-results"]}>No artwork found.</p>
  {/if}
</main>
