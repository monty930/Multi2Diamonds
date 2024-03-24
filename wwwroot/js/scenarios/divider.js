document.addEventListener('DOMContentLoaded', function () {
    // movable divider logic
    const divider = document.querySelector('.divider');
    const dividerWidth = divider.getBoundingClientRect().width;
    const dividerWidthHalf = dividerWidth / 2;
    const pageLayout = document.getElementById('page-layout');
    let isDragging = false;
    let leftWidthRatio = 0.5;
    let rightDependentRatio = 0.035;
    let minWidth = 400;
    let rightPanel = document.getElementById('right-partial');
    let leftPanel = document.getElementById('left-partial');
    let smallView = false;
    const leftSidePaddingLayout = document.getElementById('left-side-height');

    function updateSidesForWindowSize() {
        // this function is called only if the window is big enough to show both panels
        smallView = false;
        leftSidePaddingLayout.style.gridTemplateRows = `auto`;

        const pageLayoutRect = pageLayout.getBoundingClientRect();
        const totalWidth = pageLayoutRect.width; // total width of the page layout
        // show everything
        divider.style.display = 'block';
        leftPanel.style.display = 'block';
        rightPanel.style.display = 'block';

        if (leftWidthRatio === 0 || leftWidthRatio === 1 ||
            totalWidth * leftWidthRatio < minWidth || totalWidth * (1 - leftWidthRatio) < minWidth) {
            leftWidthRatio = 0.5;
        }

        let leftWidth = totalWidth * leftWidthRatio - dividerWidthHalf;
        let rightWidth = totalWidth - leftWidth - dividerWidthHalf;
        pageLayout.style.gridTemplateColumns = `${leftWidth}px ${dividerWidth}px ${rightWidth}px`;

        divider.addEventListener('mousedown', function (e) {
            e.preventDefault();
            isDragging = true;
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;

            leftWidth = e.clientX - pageLayoutRect.left;
            rightWidth = pageLayoutRect.width - leftWidth - dividerWidthHalf;
            leftWidthRatio = leftWidth / totalWidth;

            if (leftWidth < minWidth) {
                leftWidth = minWidth;
                rightWidth = totalWidth - minWidth - dividerWidthHalf;
            } else if (rightWidth < minWidth) {
                rightWidth = minWidth;
                leftWidth = totalWidth - minWidth - dividerWidthHalf;
            }

            leftWidthRatio = leftWidth / totalWidth;

            pageLayout.style.gridTemplateColumns = `${leftWidth}px ${dividerWidth}px ${rightWidth}px`;
            document.documentElement.style.setProperty('--right-side-dependend', `${rightWidth * rightDependentRatio}px`);
        });

        divider.addEventListener('mouseup', function () {
            isDragging = false;
        });

        leftWidth = totalWidth * leftWidthRatio;
        rightWidth = totalWidth - leftWidth - dividerWidthHalf;
        document.documentElement.style.setProperty('--right-side-dependend', `${rightWidth * rightDependentRatio}px`);
        pageLayout.style.gridTemplateColumns = `${leftWidth}px ${dividerWidth}px ${rightWidth}px`;
    }

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    // handling toggle view on small-window display
    let isLeftPanelVisible = true;

    function toggleView() {
        isLeftPanelVisible = !isLeftPanelVisible;
        updatePanelVisibility();
    }

    function updatePanelVisibility() {
        if (window.innerWidth <= 800) {
            const pageLayoutRect = pageLayout.getBoundingClientRect();
            const totalWidth = pageLayoutRect.width;
            if (!smallView) {
                smallView = true;
                leftSidePaddingLayout.style.gridTemplateRows = `auto 7vh`;
            }
            if (isLeftPanelVisible) {
                pageLayout.style.gridTemplateColumns = `100%`;
                rightPanel.style.display = 'none';
                leftPanel.style.display = 'block';
                divider.style.display = 'none';
            } else {
                pageLayout.style.gridTemplateColumns = `100%`;
                rightPanel.style.display = 'block';
                leftPanel.style.display = 'none';
                divider.style.display = 'none';
            }
            document.documentElement.style.setProperty('--right-side-dependend', `${totalWidth * rightDependentRatio}px`);
        } else {
            updateSidesForWindowSize();
        }
    }

    window.addEventListener('resize', updatePanelVisibility);
    updatePanelVisibility();

    window.toggleView = toggleView;
});