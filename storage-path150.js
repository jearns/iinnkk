/* Legacy work IDs were URL-encoded before Storage decoded the upload route. */
(function(root){root.StoragePath150={canonical:path=>String(path).replace(/%3A/gi,':').replace(/%7C/gi,'|')}})(typeof window==='undefined'?globalThis:window);
