# IntelliCircos

![logo](./public/logo.jpeg)

**IntelliCircos** is a data-driven and AI-powered authoring tool for Circos plots, designed to support the creation, editing, and exploration of complex circular visualizations. By integrating language models with vector-based semantic retrieval, the system provides intelligent assistance for visual design and semantic editing, particularly suited for fields such as genomics, bioinformatics, and complex network analysis.

This project is described in detail in our EuroVis 2025 publication:

> IntelliCircos: A Data-driven and AI-powered Authoring Tool for Circos Plots
>
> Paper Link: [paper](https://diglib.eg.org/items/20b4a8c0-0583-4627-b574-523d62460cc0)

# Project Structure

```
# intelliCircos/
├── src/   # Interactive frontend built with Vite + Vue3 + pnpm
├── backend/    # Python backend powered by LangChain and vector databases
└── README.md
```
> 📦 Circos dataset (annotated cases and examples) is hosted in a separate repository: [IntelliCircos-Dataset](https://github.com/KXXH/IntelliCircos-Dataset)

# Getting Started

## Frontend

```
pnpm install
pnpm dev
```

The frontend will be available at http://localhost:5173.

## Backend
Before running the backend, please:

1.	Download the required model weights from:
👉 [https://huggingface.co/hfl/chinese-llama-2-13b](https://huggingface.co/hfl/chinese-llama-2-13b) and place the downloaded files in project root directory.

2. Ensure the following environment variables are correctly set:

    - `OPENAI_API_KEY`: your OpenAI-compatible API key.
    - (Optional) `OPENAI_API_BASE`: URL of a custom OpenAI-compatible LLM backend.
    - (Optional) `OPENAI_MODEL_NAME`: model name to be used (e.g., "gpt-4").

> ⚠️ We recommend using a model with capability at least equivalent to GPT-4 to ensure high-quality assistance and generation performance.

Then start the backend service:
```
cd backend
python -m venv venv
source venv/bin/activate       # For Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

# Docker Usage
⚠️ **Note:** The Docker deployment method is currently under development and may encounter issues.

## Build Docker Image

To build the Docker image, navigate to the project root directory (where the `Dockerfile` is located) and run:

```bash
docker build -t intellicircos .
```

## Run Docker Container

After building the image, you can run the container. This will start both the frontend (on port 5173) and the backend (on port 8000).

```bash
docker run -p 5173:5173 -p 8000:8000 -e OPENAI_API_KEY="YOUR_OPENAI_API_KEY" intellicircos
```

**Important Notes:**

*   Replace `"YOUR_OPENAI_API_KEY"` with your actual OpenAI API key.
*   The `hfl/chinese-llama-2-13b` model weights will be downloaded during the image build process. This might take some time and result in a large Docker image.
*   If you encounter issues with model download or prefer to manage model weights outside the image, consider mounting them as a volume.
*   **Linux Environment Required:** Docker support for this project is primarily designed for Linux environments. While Docker runs on Windows and macOS, direct CUDA support within Docker containers is best and most reliably achieved on a Linux host with NVIDIA GPU drivers installed.
*   **CUDA Compatible Environment:** Ensure your host machine has a CUDA-compatible NVIDIA GPU and the necessary NVIDIA drivers installed for the Docker container to utilize CUDA capabilities.

# Dataset Access
The dataset used for system demonstration and evaluation is hosted in a separate repository: [IntelliCircos-Dataset](https://github.com/KXXH/IntelliCircos-Dataset).

Due to institutional intellectual property constraints, the complete dataset cannot be made fully public at this time. A limited number of representative Circos plot cases are provided for demonstration and reproducibility.

# Citation

If you use IntelliCircos in your research, please cite our EuroVis 2025 paper:

```bibtex
@article{intelliCircos2025,
    journal = {Computer Graphics Forum},
    title = {{IntelliCircos: A Data-driven and AI-powered Authoring Tool for Circos Plots}},
    author = {Gu, Mingyang and Zhu, Jiamin and Wang, Qipeng and Wang, Fengjie and Wen, Xiaolin and Wang, Yong and Zhu, Min},
    year = {2025},
    ISSN = {1467-8659},
    DOI = {10.1111/cgf.70118}
}

```

# Contact
- Email: kayak9999k@gmail.com, zjm97@outlook.com, zhumin@scu.edu.cn
- Contributions via issues and pull requests are welcome.
