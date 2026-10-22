手筆 Blender 本机助手

1. 先安装官方 Blender 与 Python 3。
2. Mac：在此目录运行 python3 server.py（或启动 start-mac.command）。
   Windows：双击 start-windows.cmd。
3. 保持此窗口打开，回到手筆“我的字迹 → 立体创作”，点“连接助手”。
4. “Blender 编辑”生成真实 .blend 项目并在 Blender 打开；“Blender 渲染”生成图片。

工作文件保存在用户目录 .shoubi/blender254/。关闭助手窗口即停止服务。
助手只监听 127.0.0.1，不能从局域网或互联网访问。它不执行网页传来的脚本、命令或文件路径。

无需助手也可以在网页下载 STL/3MF，交给拓竹等切片软件。不会自动发送打印任务。
