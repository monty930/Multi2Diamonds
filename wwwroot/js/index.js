// function updateLines() {
//     const code = document.getElementById('code');
//     const lines = document.getElementById('lines');
//     const editorContainer = document.querySelector('.editor-container');
//     const lineHeight = 20; // The line height in pixels
//     const editorContainerHeight = editorContainer.offsetHeight;
    
//     const activeLineCount = code.value.split('\n').length;
//     const visibleLines = Math.floor(editorContainerHeight / lineHeight);
//     lines.innerHTML = ''; // Reset line numbers
//     console.log("visible: " + visibleLines);

//     // Generate active line numbers
//     for (let i = 1; i <= activeLineCount; i++) {
//         const lineSpan = document.createElement('span');
//         lineSpan.textContent = i;
//         lineSpan.className = 'active-line'; // Use active line style
//         lines.appendChild(lineSpan);
//         lines.appendChild(document.createElement('br'));
//     }

//     // Fill in inactive line numbers up to the visible limit
//     for (let i = activeLineCount + 1; i <= visibleLines; i++) {
//         const lineSpan = document.createElement('span');
//         lineSpan.textContent = i;
//         lineSpan.className = 'inactive-line'; // Use inactive line style
//         lines.appendChild(lineSpan);
//         lines.appendChild(document.createElement('br'));
//     }

//     // Adjust scrolling behavior based on content
//     editorContainer.style.overflowY = activeLineCount > visibleLines ? 'scroll' : 'hidden';
// }

// document.addEventListener('DOMContentLoaded', function() {
//     code.addEventListener('input', updateLines);
//     updateLines(); // Initial call to fill the lines and set overflow
// });