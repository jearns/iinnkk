"""Original instrumental loops: deterministic synthesis, no samples or external recordings."""
from pathlib import Path
import numpy as np, subprocess, tempfile
rate=24000
out=Path(__file__).resolve().parents[2]/'video-music294';out.mkdir(exist_ok=True)
for name,bpm,style in [('orbit',80,'ambient'),('daylight',96,'pulse'),('inklight',72,'piano')]:
 beat=60/bpm;length=16*beat;t=np.arange(round(length*rate))/rate;mix=np.zeros(len(t))
 def note(start,duration,midi,amp,kind):
  i=int(start*rate);n=min(round(duration*rate),len(t)-i)
  if n<=0:return
  x=np.arange(n)/rate;freq=440*2**((midi-69)/12)
  if kind=='piano':env=(1-np.exp(-x*110))*np.exp(-x*1.8);wave=sum(np.sin(2*np.pi*freq*k*x)*np.exp(-x*k*.22)/k**2 for k in range(1,7))
  elif kind=='bell':env=(1-np.exp(-x*70))*np.exp(-x*2.5);wave=np.sin(2*np.pi*freq*x)+.25*np.sin(2*np.pi*freq*2.76*x)
  else:env=np.minimum(1,x/.18)*np.minimum(1,(duration-x)/.4);wave=np.sin(2*np.pi*freq*x)+.25*np.sin(2*np.pi*freq*2*x)+.12*np.sin(2*np.pi*freq*.5*x)
  mix[i:i+n]+=wave*env*amp
 chords=[[50,57,60,64],[46,53,57,60],[53,60,64,69],[48,55,62,65]]
 for bar,chord in enumerate(chords):
  for p in chord:note(bar*4*beat,4*beat,p,.026,'pad')
  melody=[chord[1]+12,chord[2]+12,chord[3]+12,chord[2]+12]
  for j,p in enumerate(melody):note((bar*4+j)*beat,beat*2,p,.085 if style=='piano' else .045,'piano' if style=='piano' else 'bell')
  if style=='pulse':
   for j in [0,2]:
    start=int((bar*4+j)*beat*rate);x=np.arange(min(int(.23*rate),len(mix)-start))/rate;mix[start:start+len(x)]+=.06*np.sin(2*np.pi*(48*x+25*(1-np.exp(-x*25))/25))*np.exp(-x*22)
 # Periodic overlap prevents a click at the repeat point.
 k=int(.06*rate);mix[:k]+=mix[-k:]*np.linspace(1,0,k);mix[-k:]*=np.linspace(1,0,k)
 for seconds in [8,15,30,60,120]:
  n=seconds*rate;signal=np.tile(mix,int(np.ceil(n/len(mix))))[:n].copy();fade=min(int(.35*rate),n//4);signal[:fade]*=np.linspace(0,1,fade);signal[-fade:]*=np.linspace(1,0,fade);pcm=(np.clip(signal,-.85,.85)*32767).astype('<i2')
  subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar',str(rate),'-ac','1','-i','pipe:0','-c:a','aac','-b:a','32k','-ar','48000','-movflags','+faststart',str(out/f'{name}-{seconds}.m4a')],input=pcm.tobytes(),check=True)
print('Generated three original loop scores, 32 kb/s mono AAC.')
