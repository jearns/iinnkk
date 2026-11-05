// Compile the canonical shared music catalogue for the classic writing runtime.
import{build}from'esbuild';import{writeFile}from'node:fs/promises';
const result=await build({entryPoints:['release303/music-library.mjs'],bundle:true,format:'iife',globalName:'MusicLibrary303',platform:'browser',minify:true,write:false,footer:{js:'window.MusicLibrary303=MusicLibrary303;'}});await writeFile('release303/music-library.js',result.outputFiles[0].contents);
