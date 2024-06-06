async function uploadFile(event) {
    event.preventDefault();

    const formData = new FormData();

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    formData.append('file', file);

    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        alert(`File uploaded successfully. File name: ${data.fileName}`);
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
    }
}