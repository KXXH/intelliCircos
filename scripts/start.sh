#!/bin/bash

# 启动后端服务
source backend/venv/bin/activate && python3.9 backend/main.py &

# 启动前端预览服务器
cd src && pnpm preview --host 0.0.0.0 --port 5173 &

wait -n

# 等待所有后台进程结束
# 如果需要确保所有进程都保持活跃，可以使用一个循环来检查它们
# 比如：while true; do sleep 1000; done
