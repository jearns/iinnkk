from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess
root=Path(__file__).resolve().parents[2]
files=sorted((root/'music').glob('*.mp3'))
def build(task):
 src,seconds=task
 out=root/'video-music295'/f'{src.stem}-{seconds}.m4a'
 subprocess.run(['ffmpeg','-v','error','-stream_loop','-1','-i',str(src),'-t',str(seconds),'-af',f'volume=0.48,afade=t=in:st=0:d=0.35,afade=t=out:st={seconds-.8}:d=0.8','-ac','1','-ar','48000','-c:a','aac','-b:a','32k','-movflags','+faststart','-y',str(out)],check=True)
 return out.name
for result in ThreadPoolExecutor(4).map(build,[(src,seconds)for src in files for seconds in [8,15,30,60,120]]):print(result,flush=True)
