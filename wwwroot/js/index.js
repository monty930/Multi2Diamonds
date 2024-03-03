let updateLineNumbers = function () {
    const textarea = document.getElementById('codeInput');
    if (textarea != null) {
        const lineNumbers = document.getElementById('lineNumbers');
        const lineCount = textarea.value.split('\n').length;

        const computedStyle = window.getComputedStyle(textarea);
        const lineHeight = parseInt(computedStyle.lineHeight, 10);
        const visibleLines = Math.floor(textarea.clientHeight / lineHeight);

        const totalLines = Math.max(lineCount, visibleLines);

        let numbers = '';
        for (let i = 1; i <= totalLines; i++) {
            numbers += i <= lineCount ? `<span class="used-line">${i}</span>\n` : `<span class="unused-line">${i}</span>\n`;
        }

        lineNumbers.innerHTML = numbers;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Check if a saved scroll position exists and restore it
    const savedScrollTop = localStorage.getItem('textareaScrollTop');
    if (savedScrollTop !== null) {
        document.getElementById('codeInput').scrollTop = parseInt(savedScrollTop, 10);
    }

    document.getElementById('codeInput').addEventListener('input', updateLineNumbers);
    document.getElementById('codeInput').addEventListener('scroll', function () {
        document.getElementById('lineNumbers').scrollTop = this.scrollTop;
    });

    window.addEventListener('resize', updateLineNumbers);

    // Save the current scroll position of the textarea to localStorage
    window.addEventListener('beforeunload', function () {
        localStorage.setItem('textareaScrollTop', document.getElementById('codeInput').scrollTop.toString());
    });

    updateLineNumbers();
});