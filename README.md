# iTunes / Apple Music Album Artwork Fetcher

Just trying out SvelteKit. This super basic app makes use of the [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html) to search for album artwork and download the highest possible resolution image from Apple's servers.

Input an artist + album, for example `Smashing Pumpkins - Mellon Collie and the Infinite Sadness`, then click the resulting cover art thumbnail to download the full-size file.

Additional results are included and paginated in case the first match, I don't know, sucks or something. Sometimes Apple Music has like 5 versions of an album.

## Compiling + Previewing

Just do this :

```bash
npm install
npm run build
npm run preview
```
