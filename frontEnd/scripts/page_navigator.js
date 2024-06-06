function navigate(page) {
    const main = document.querySelector('main');
    const elements = main.children;

    Array.from(elements).forEach(element => {
        if (element.classList.contains(page)) {
            element.style.display = 'inherit';
        } else {
            element.style.display = 'none';
        }
    });
}

navigate('main-page')