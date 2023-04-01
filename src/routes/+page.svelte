<script>
  let searchTerm = '';
  let artworkList = [];
  let currentPage = 1;
  let totalPages = 0;
  let currentArtworkPage = [];
  let resultsPerPage = 5;

  async function fetchArtwork() {
    const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=album&limit=100`);
    const data = await response.json();
    artworkList = data.results.map(result => ({
      artworkUrl: result.artworkUrl100,
      artistName: result.artistName,
      albumTitle: result.collectionName
    }));
    currentArtworkPage = artworkList.slice(0, resultsPerPage);
    totalPages = Math.ceil(artworkList.length / resultsPerPage);
  }

  function handleSearch(event) {
    event.preventDefault();
    currentPage = 1;
    currentArtworkPage = artworkList.slice(0, resultsPerPage);
    fetchArtwork();
  }

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
</script>

<main>
  <form on:submit={handleSearch}>
    <input type="text" bind:value={searchTerm} placeholder="Enter an album name">
    <button type="submit">Search</button>
  </form>
  {#if artworkList.length}
    <ul>
	  {#each currentArtworkPage as artwork}
	    <li>
	      <a target="_blank" href={artwork.artworkUrl.replace('100x100', '10000x10000')} download>
	        <img src={artwork.artworkUrl} alt="Album Artwork">
	      </a>
	      <p>{artwork.artistName} - {artwork.albumTitle}</p>
	    </li>
	  {/each}
	</ul>
    <div class="pagination">
      {#if currentPage > 1}
        <a href="#" on:click={handlePrevPage}>Previous</a>
      {/if}
      {#if currentPage < totalPages}
        <a href="#" on:click={handleNextPage}>Next</a>
      {/if}
    </div>
  {:else}
    <p>No artwork found.</p>
  {/if}
</main>
