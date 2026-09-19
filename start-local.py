from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
root = Path(__file__).resolve().parent
print("今日亲笔：请用浏览器打开 http://localhost:8080 ，保持此程序运行。", flush=True)
ThreadingHTTPServer(("127.0.0.1", 8080), partial(SimpleHTTPRequestHandler, directory=str(root))).serve_forever()
