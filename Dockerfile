
# 使用 NVIDIA CUDA 基础镜像，包含 CUDA 11.8 和 cuDNN
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

# 设置环境变量，确保非交互式安装
ENV DEBIAN_FRONTEND=noninteractive

# 安装通用工具，pip，nodejs，pnpm
RUN apt-get update && \
    apt-get install -y python3.9 python3.9-venv python3-pip curl git git-lfs unzip build-essential && \
    rm -rf /var/lib/apt/lists/*

# 安装 pnpm
RUN curl -fsSL https://get.pnpm.io/install.sh | sh -

# 设置工作目录
WORKDIR /app

# 复制 backend 目录，安装 Python 依赖
COPY backend/ ./backend/
RUN /usr/bin/python3.9 -m venv backend/venv && \
    /bin/bash -c "source backend/venv/bin/activate && pip install --no-cache-dir -r backend/requirements.txt"

# 复制 src 目录，构建前端
COPY src/ ./src/
RUN cd src && pnpm install && pnpm build

# 下载模型权重
RUN git clone https://huggingface.co/hfl/chinese-llama-2-13b chinese-llama-2-13b/

# 暴露端口 (前端默认5173，后端默认 8000)
EXPOSE 5173
EXPOSE 8000

# 创建一个简单的启动脚本来同时运行前端和后端
COPY scripts/start.sh /app/scripts/
RUN chmod +x /app/scripts/start.sh

# 启动前端和后端服务
CMD ["/bin/bash", "/app/scripts/start.sh"]
