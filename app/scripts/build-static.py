from pathlib import Path
import runpy,shutil
root=Path(__file__).resolve().parents[1];out=root/'dist'
files=runpy.run_path(str(root/'scripts/package-source.py'))['source_files']()
out.mkdir(exist_ok=True)
for name in files+['downloads/manifest.json']:
 target=out/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,target)
# Keep previously published update links available; new releases use complete bundles.
if (root/'updates').exists():shutil.copytree(root/'updates',out/'updates',dirs_exist_ok=True)
print('Static output ready:',len(files),'files')
