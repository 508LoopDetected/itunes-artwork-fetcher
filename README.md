# iTunes / Apple Music Album Artwork Fetcher

Just trying out SvelteKit. This super basic app makes use of the [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html) to download album artwork at the highest possible resolution image from Apple's servers. Doing this isn't _technically_ supported by the API, but there's a way around everything, right?

## Compiling + Previewing

```bash
npm install
npm run build
npm run preview
```

Input an artist + album, for example `Smashing Pumpkins - Mellon Collie and the Infinite Sadness`, then click the resulting cover art thumbnail to download the full-size file.

Additional results are included and paginated in case the first match, I don't know, sucks or something. Sometimes Apple Music has like 5 versions of an album.
