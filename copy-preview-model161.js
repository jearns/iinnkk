/* One thumbnail model for original browsing, saved copying and shared copying. */
(function(root){function items(book,paired=false){return(book?.pages||[]).flatMap((p,page)=>p.image?[{...p,page,original:!paired,overlay:paired&&p.owned181&&!p.invalid179?p.preview159:null}]:[])}root.CopyPreviewModel161={items};})(globalThis);
