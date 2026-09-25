from pathlib import Path
import zipfile,json,hashlib,subprocess,sys
root=Path(__file__).resolve().parents[1]
def source_files():
 names=(subprocess.check_output(['git','ls-files','-co','--exclude-standard'],cwd=root,text=True).splitlines() if (root/'.git').exists() else [p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()])
 return sorted({n for n in names if not n.startswith(('.git','.env','.openai/','.sites-runtime/','dist/','downloads/','updates/','apple/','wechat/','node_modules/','.wrangler/')) and not n.endswith(('.zip','.tar.gz')) and (root/n).is_file()})
if __name__=='__main__':
 out=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root.parent/'iinnkk-web-v60.zip'
 files=source_files();parts=[]
 for name in files:
  data=(root/name).read_bytes();parts.append(dict(name=name,url=name,bytes=len(data),sha256=hashlib.sha256(data).hexdigest()))
 manifest=dict(filename=out.name,bytes=sum(x['bytes'] for x in parts),parts=parts)
 folder=root/'downloads';folder.mkdir(exist_ok=True);raw=json.dumps(manifest,separators=(',',':'));(folder/'manifest.json').write_text(raw)
 with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for name in files:z.write(root/name,name)
  z.writestr('downloads/manifest.json',raw)
 with zipfile.ZipFile(out) as z:
  assert z.testzip() is None
  assert 'index.html' in z.namelist() and not any(x.startswith('dist/') for x in z.namelist())
  assert 'http-equiv="refresh"' not in z.read('index.html').decode()
  for name in json.loads((root/'offline-assets.json').read_text()):assert name in z.namelist(),name
 print(json.dumps(dict(path=str(out),bytes=out.stat().st_size,files=len(files))))
