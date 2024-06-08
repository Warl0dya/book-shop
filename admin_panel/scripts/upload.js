async function uploadFile(file) {
    const formData = new FormData();

    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.fileName
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Помилка завантаження файлу!');
    }
}