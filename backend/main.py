from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import os
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

load_dotenv()

app = FastAPI()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

AES_KEY = bytes.fromhex(os.getenv("AES_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def encrypt(data):
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(AES_KEY), modes.CFB(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    return iv + encryptor.update(data) + encryptor.finalize()

def decrypt(data):
    iv = data[:16]
    cipher = Cipher(algorithms.AES(AES_KEY), modes.CFB(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    return decryptor.update(data[16:]) + decryptor.finalize()

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    encrypted = encrypt(contents)
    with open(os.path.join(UPLOAD_FOLDER, file.filename), "wb") as f:
        f.write(encrypted)
    return JSONResponse(content={"message": "✅ File uploaded successfully"}, status_code=200)

@app.get("/files")
def list_files():
    return os.listdir(UPLOAD_FOLDER)

@app.get("/download/{filename}")
def download(filename: str):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    with open(filepath, "rb") as f:
        decrypted = decrypt(f.read())
    temp_path = os.path.join("temp", filename)
    os.makedirs("temp", exist_ok=True)
    with open(temp_path, "wb") as temp_file:
        temp_file.write(decrypted)
    return FileResponse(temp_path, filename=filename)

@app.delete("/delete/{filename}")
def delete(filename: str):
    path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(path):
        os.remove(path)
        return {"message": "🗑️ File deleted successfully"}
    return JSONResponse(content={"message": "❌ File not found"}, status_code=404)
