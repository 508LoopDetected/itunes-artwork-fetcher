export async function searchArtwork(term) {
  if (!term || term.trim() === '') {
    return { results: [] };
  }
  
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&limit=100`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artwork:', error);
    throw error;
  }
}

export async function getSuggestions(term) {
  if (!term || term.trim() === '' || term.length < 2) {
    return { results: [] };
  }
  
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&limit=5`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
}

// Helper function to get optimal artwork resolution
export function getOptimalArtworkUrl(url, size = 1000) {
  if (!url) return '';
  
  // Replace the 100x100 with the desired size
  return url.replace('100x100', `${size}x${size}`);
}