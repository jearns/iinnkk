import '../release282/stickers.js';
const status=document.getElementById('stickerPageStatus281');
try{const samples=await window.HandLedger254.list({limit:400,source:['large','crossword','input','portrait']});await window.InkStickers279.open({samples,standalone:true});status.textContent='';}catch(e){status.textContent=e.message}
