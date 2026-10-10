/* One thumbnail model for original browsing, saved copying and shared copying. */
(function(root){function items(book,paired=false){return(book?.pages||[]).flatMap((p,page)=>{const rows=p.image?[{...p,page,original:true}]:[];if(paired&&p.preview159)rows.push({...p,image:p.preview159,page,original:false});return rows})}root.CopyPreviewModel161={items};})(globalThis);
