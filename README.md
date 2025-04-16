# Playbook

Welcome to **Playbook**, a full-stack sports betting web application for HCI. Follow the instructions below to get the project up and running on your local machine.

## 🚀 Getting Started

### 1. Clone the Repository

You can either clone the repository using Git:

```bash
git clone https://github.com/Henry-L-Tran/PlayBook_Project.git
```

Or download the ZIP file from GitHub and extract it manually.

### 2. Run the Backend

Navigate to the `backend` directory:

```bash
cd backend
```

Activate the virtual environment:

For Windows:
```
venv/Scripts/Activate
```

For Linux/MacOS:
```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

> **Note:** If the backend throws any errors, try exporting the `PYTHONPATH` and restarting the server:
>
> ```bash
> export PYTHONPATH=app
> uvicorn app.main:app --reload
> ```

### 3. Run the Frontend

Open a **new terminal window** and navigate to the `frontend` directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Once running, a local development link (e.g., `http://localhost:5173`) will be displayed. Open that link in your browser to access the frontend.
