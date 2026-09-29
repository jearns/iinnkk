/* Settings accept backdrop taps; input changes continue through their existing save handlers. */
(function(){const allowed=new Set(['bigDialog62','sizeDialog38','toolPopup79','musicDialog','brushDialog','paperDialog','sealDialog','mountDialog','controlDialog','extraSealDialog','copyDialog']);
 document.addEventListener('click',event=>{const dialog=event.target;if(!(dialog instanceof HTMLDialogElement)||!dialog.open||!allowed.has(dialog.id))return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom){event.stopImmediatePropagation();dialog.querySelector('[data-close]')?.click();if(dialog.open)dialog.close()}},true);
})();
