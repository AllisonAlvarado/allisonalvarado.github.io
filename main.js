const url = 'Portafolio Allison Alvarado.pdf'; // Updated to use the actual PDF file in the workspace

const pdfContainer = document.getElementById('pdf-container');

pdfjsLib.getDocument(url).promise.then(pdf => {
    const renderPage = (pageNum) => {
        pdf.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match the PDF's resolution
            const outputScale = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;

            context.scale(outputScale, outputScale);
            canvas.classList.add('pdf-page');

            pdfContainer.appendChild(canvas);

            page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                if (pageNum < pdf.numPages) {
                    renderPage(pageNum + 1);
                }
            });
        });
    };

    renderPage(1);
});