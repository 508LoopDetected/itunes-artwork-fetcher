// Debounce helper function
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format album and artist names helper
export function formatAlbumName(name) {
  if (!name) return '';
  
  // Remove any substrings in parentheses that contain "Deluxe", "Remastered", etc.
  return name
    .replace(/\((?:Deluxe|Remastered|Bonus|Expanded|Special|Collector's|Anniversary|Explicit).*?\)/gi, '')
    .replace(/\[(?:Deluxe|Remastered|Bonus|Expanded|Special|Collector's|Anniversary|Explicit).*?\]/gi, '')
    .trim();
}