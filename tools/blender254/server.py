#!/usr/bin/env python3
"""Loopback-only bridge for explicit handwriting projects; never accepts scripts or file paths."""
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,math,os,re,secrets,shutil,subprocess,sys,threading,time,uuid,webbrowser
ROOT=Path.home()/'.shoubi'/'blender254';ROOT.mkdir(parents=True,exist_ok=True)
TOKEN=secrets.token_urlsafe(32);JOBS={};LOCK=threading.Lock();POOL=ThreadPoolExecutor(max_workers=1)
ORIGINS={'https://iinnkk.me','https://jearns.github.io','http://127.0.0.1:8254','http://localhost:8254'}
BLENDER=shutil.which('blender')
for candidate in ['/Applications/Blender.app/Contents/MacOS/Blender',os.path.expandvars(r'%ProgramFiles%\Blender Foundation\Blender 5.0\blender.exe'),os.path.expandvars(r'%ProgramFiles%\Blender Foundation\Blender 4.5\blender.exe')]:
    if not BLENDER and Path(candidate).is_file():BLENDER=candidate
SCRIPT=Path(__file__).with_name('project.py')

def validate(data):
    if not isinstance(data,dict)or data.get('action')not in ['edit','render']:raise ValueError('Unsupported action')
    mesh=data.get('mesh',{});v=mesh.get('vertices');faces=mesh.get('triangles');mm=mesh.get('mm',{})
    if not isinstance(v,list)or len(v)<9 or len(v)>4500000 or len(v)%3:raise ValueError('Invalid vertices')
    if not isinstance(faces,list)or len(faces)<3 or len(faces)>1500000 or len(faces)%3:raise ValueError('Invalid faces')
    if any(isinstance(n,bool)or not isinstance(n,(int,float))or not math.isfinite(n)or abs(n)>2000 for n in v):raise ValueError('Invalid coordinate')
    if any(isinstance(n,bool)or not isinstance(n,int)or n<0 or n>=len(v)//3 for n in faces):raise ValueError('Invalid vertex index')
    for key in ['width','height','base','depth']:
        n=mm.get(key)
        if not isinstance(n,(float,int))or isinstance(n,bool)or not math.isfinite(n)or not 0<n<=1000:raise ValueError('Invalid dimensions')
    name=str(data.get('name','Handwriting'))[:120]
    return {'name':name,'mesh':{'vertices':v,'triangles':faces,'mm':mm},'action':data['action']}

def run(job,data):
    try:
        if not BLENDER:raise RuntimeError('Blender is not installed; install it and restart the assistant.')
        folder=ROOT/job;folder.mkdir();scene=folder/'scene.json';scene.write_text(json.dumps(data),encoding='utf-8')
        with LOCK:JOBS[job]['status']='running'
        result=subprocess.run([BLENDER,'--background','--python',str(SCRIPT),'--',str(scene),str(folder)],cwd=str(folder),capture_output=True,text=True,timeout=600)
        if result.returncode or not(folder/'handwriting.blend').is_file():raise RuntimeError('Blender generation failed. See the local log.')
        (folder/'blender.log').write_text(result.stdout+'\n'+result.stderr,encoding='utf-8')
        if data['action']=='edit':subprocess.Popen([BLENDER,str(folder/'handwriting.blend')],cwd=str(folder),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        with LOCK:JOBS[job]['status']='done'
    except Exception as error:
        with LOCK:JOBS[job].update(status='failed',error=str(error)[:500])

class Handler(BaseHTTPRequestHandler):
    server_version='ShoubiLocal254'
    def log_message(self,fmt,*args):pass
    def allowed(self):return self.headers.get('Origin')in ORIGINS
    def headers(self,status=200,type='application/json'):
        self.send_response(status);self.send_header('Content-Type',type);self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff')
        if self.allowed():self.send_header('Access-Control-Allow-Origin',self.headers['Origin']);self.send_header('Vary','Origin');self.send_header('Access-Control-Allow-Private-Network','true')
        self.end_headers()
    def reply(self,data,status=200):self.headers(status);self.wfile.write(json.dumps(data,ensure_ascii=False).encode())
    def do_OPTIONS(self):
        if not self.allowed():self.reply({'error':'Origin denied'},403);return
        self.send_response(204);self.send_header('Access-Control-Allow-Origin',self.headers['Origin']);self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS');self.send_header('Access-Control-Allow-Headers','Content-Type,X-Shoubi-Token');self.send_header('Access-Control-Allow-Private-Network','true');self.end_headers()
    def authorize(self):
        host=self.headers.get('Host','')
        if host not in ['127.0.0.1:8125','localhost:8125']or not self.allowed():self.reply({'error':'Local authorized origins only'},403);return False
        if self.headers.get('X-Shoubi-Token')!=TOKEN:self.reply({'error':'Reconnect the local assistant'},403);return False
        return True
    def do_GET(self):
        if self.path=='/health':
            if not self.allowed():self.reply({'error':'Origin denied'},403);return
            self.reply({'app':'shoubi-blender254','token':TOKEN,'blender':bool(BLENDER)});return
        if not self.authorize():return
        m=re.fullmatch(r'/jobs/([a-f0-9]{32})',self.path)
        if m:
            with LOCK:state=JOBS.get(m[1])
            self.reply(state or {'error':'Unknown job'},200 if state else 404);return
        m=re.fullmatch(r'/files/([a-f0-9]{32})/(render\.png|handwriting\.blend)',self.path)
        if m:
            p=ROOT/m[1]/m[2]
            if p.is_file():
                self.headers(200,'image/png'if m[2].endswith('.png')else'application/octet-stream');self.wfile.write(p.read_bytes());return
        self.reply({'error':'Not found'},404)
    def do_POST(self):
        if not self.authorize():return
        if self.path!='/projects':self.reply({'error':'Not found'},404);return
        try:
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<=64*1024*1024:raise ValueError('Project is too large')
            data=validate(json.loads(self.rfile.read(length)))
            with LOCK:
                active=sum(s['status']in ['queued','running']for s in JOBS.values())
                if active>=2:self.reply({'error':'A project is already running. Wait for it to finish.'},429);return
                job=uuid.uuid4().hex;JOBS[job]={'id':job,'status':'queued'}
            POOL.submit(run,job,data);self.reply({'id':job,'status':'queued'},202)
        except Exception as error:self.reply({'error':str(error)[:300]},400)

if __name__=='__main__':
    print('手筆 Blender 助手 · http://127.0.0.1:8125')
    print('Blender:',BLENDER or '未找到。请安装 Blender 后重新启动。')
    print('仅接受手筆网页发起的本机操作。关闭此窗口即可停止。')
    try:ThreadingHTTPServer(('127.0.0.1',8125),Handler).serve_forever()
    except KeyboardInterrupt:pass
