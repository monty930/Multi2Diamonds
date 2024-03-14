document.addEventListener('DOMContentLoaded', function() {
    // movable divider logic
    const divider = document.querySelector('.divider');
    const dividerWidth = divider.getBoundingClientRect().width;
    const dividerWidthHalf = dividerWidth / 2;
    const pageLayout = document.getElementById('page-layout');
    let isDragging = false;
    let leftWidthRatio = 0.5;
    let rightDependentRatio = 0.035;
    let rightPanel = document.getElementById('right-partial');
    let leftPanel = document.getElementById('left-partial');

    function updateSidesForWindowSize() {
        const minWidth = 400;
        const pageLayoutRect = pageLayout.getBoundingClientRect();
        const totalWidth = pageLayoutRect.width;
        let leftWidth, rightWidth;
        
        divider.style.display = 'block';
        leftPanel.style.display = 'block';
        rightPanel.style.display = 'block';

        if (totalWidth < 800) {
            console.log("WRONG");
            document.getElementById('left-partial').style.width = '100%';
            document.getElementById('right-partial').style.width = '100%';
            isDragging = false;
        } else {
            leftWidth = totalWidth * leftWidthRatio - dividerWidthHalf;
            rightWidth = totalWidth - leftWidth - dividerWidthHalf;
            
            if (leftWidth === 0 || rightWidth === 0) {
                leftWidth = totalWidth / 2 - dividerWidthHalf;
                rightWidth = totalWidth / 2 - dividerWidthHalf;
                leftWidthRatio = 0.5;
                pageLayout.style.gridTemplateColumns = `${leftWidth}px ${dividerWidth}px ${rightWidth}px`;
            }

            if (leftWidth < minWidth) {
                leftWidth = minWidth - dividerWidthHalf;
                rightWidth = totalWidth - minWidth - dividerWidthHalf;
                leftWidthRatio = leftWidth / totalWidth;
            } else if (rightWidth < minWidth) {
                rightWidth = minWidth - dividerWidthHalf;
                leftWidth = totalWidth - minWidth - dividerWidthHalf;
                leftWidthRatio = leftWidth / totalWidth;
            }

            document.getElementById('left-partial').style.width = `${leftWidth}px`;
            document.getElementById('right-partial').style.width = `${rightWidth}px`;

            divider.addEventListener('mousedown', function(e) {
                e.preventDefault();
                isDragging = true;
            });

            document.addEventListener('mousemove', function(e) {
                if (!isDragging || totalWidth < 800) return;

                leftWidth = e.clientX - pageLayoutRect.left;
                rightWidth = pageLayoutRect.width - leftWidth - dividerWidthHalf;
                leftWidthRatio = leftWidth / totalWidth;

                if (leftWidth < minWidth) {
                    leftWidth = minWidth - dividerWidthHalf;
                    rightWidth = totalWidth - minWidth - dividerWidthHalf;
                } else if (rightWidth < minWidth) {
                    rightWidth = minWidth - dividerWidthHalf;
                    leftWidth = totalWidth - minWidth - dividerWidthHalf;
                }

                leftWidthRatio = leftWidth / totalWidth;

                document.getElementById('left-partial').style.width = `${leftWidth}px`;
                document.getElementById('right-partial').style.width = `${rightWidth}px`;
                document.documentElement.style.setProperty('--right-side-dependend', `${rightWidth * rightDependentRatio}px`);
                console.log("setting right side dependend to " + rightWidth);
            });
        }

        leftWidth = totalWidth * leftWidthRatio;
        rightWidth = totalWidth - leftWidth - dividerWidthHalf;
        document.documentElement.style.setProperty('--right-side-dependend', `${rightWidth * rightDependentRatio}px`);
    }

    //
    // window.addEventListener('resize', updateSidesForWindowSize);

    document.addEventListener('mouseup', function() {
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
            if (isLeftPanelVisible) {
                pageLayout.style.gridTemplateColumns = `${totalWidth}px 0% 0%`;
                rightPanel.style.display = 'none';
                leftPanel.style.display = 'block';
                divider.style.display = 'none';
            } else {
                pageLayout.style.gridTemplateColumns = `0% 0% ${totalWidth}px`;
                rightPanel.style.display = 'block';
                leftPanel.style.display = 'none';
                divider.style.display = 'none';
            }
            
        } else {
            updateSidesForWindowSize();
        }
    }

    window.addEventListener('resize', updatePanelVisibility);
    updatePanelVisibility();

    window.toggleView = toggleView;
});