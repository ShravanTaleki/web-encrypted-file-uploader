# 🔐 Web Encrypted File Uploader

A simple and secure web application that allows encrypted file uploads and downloads using AES encryption.

## ✨ Features
- AES-based file encryption and decryption 🔑
- FastAPI backend with SQLite integration ⚙️
- Bootstrap-styled frontend with smooth animations 🎨
- Upload and download functionality with encryption safety 🔐
- Clean UI with sidebar navigation and interactive buttons 🖱️

## 🧰 Tech Stack
- **Frontend**: HTML, CSS (Bootstrap), JavaScript
- **Backend**: Python, FastAPI
- **Database**: SQLite
- **Encryption**: AES (from `cryptography` package)

## 📁 Folder Structure
```bash
web-encrypted-file-uploader/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   └── script.js
├── .gitignore
└── README.md
```

## ▶️ How to Run

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/web-encrypted-file-uploader.git
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server:**

   ```bash
   uvicorn main:app --reload
   ```

4. **Open the frontend:**

   Simply open the `frontend/index.html` file in your browser.

---

✅ Now you have a secure file upload and download system with AES encryption and a clean UI!
