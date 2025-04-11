function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(`${id}-page`).style.display = 'block';
  if (id === 'download') loadFiles();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
      document.getElementById('uploadStatus').textContent = "⚠️ Please select a file.";
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData
      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = { message: "✅ File uploaded successfully (no response body)." };
      }

      if (!res.ok) throw new Error(result.message);

      document.getElementById('uploadStatus').textContent = result.message;
      fileInput.value = '';
    } catch (err) {
      console.error(err);
      document.getElementById('uploadStatus').textContent = "❌ Upload failed. Please try again.";
    }
  });

  showPage('upload');
});

async function loadFiles() {
  try {
    const res = await fetch('http://127.0.0.1:8000/files');
    const files = await res.json();
    const tbody = document.querySelector('#filesTable tbody');
    tbody.innerHTML = '';

    files.forEach(file => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${file}</td>
        <td>
          <button class="button" onclick="downloadFile('${file}')">
            <span class="button__text">Download</span>
            <span class="button__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" class="svg">
                <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
              </svg>
            </span>
          </button>
        </td>
        <td>
          <button class="Btn" onclick="deleteFile('${file}')">
            <div class="sign">
              <svg viewBox="0 0 16 16" fill="currentColor" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
              </svg>
            </div>
            <div class="text">Delete</div>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch {
    alert("❌ Failed to load file list.");
  }
}


function downloadFile(filename) {
  window.open(`http://127.0.0.1:8000/download/${filename}`, '_blank');
}

function deleteFile(filename) {
  if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

  fetch(`http://127.0.0.1:8000/delete/${filename}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loadFiles();
    })
    .catch(() => alert("❌ Failed to delete the file."));
}


document.getElementById("fileInput").addEventListener("change", function () {
  const fileName = this.files[0]?.name || "No file chosen";
  document.getElementById("fileName").innerText = fileName;
});

