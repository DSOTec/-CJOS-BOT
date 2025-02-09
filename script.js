document.addEventListener("DOMContentLoaded", function () {
    function adjustPadding() {
        const headerHeight = document.querySelector(".fixed-header").offsetHeight;
        const bodyHeight = document.body.offsetHeight;
        const windowHeight = window.innerHeight;

        // If the page content is smaller than the viewport, adjust padding
        if (bodyHeight < windowHeight) {
            document.body.style.paddingTop = `${headerHeight + 20}px`; // Extra 20px for spacing
        } else {
            document.body.style.paddingTop = `${headerHeight}px`;
        }
    }

    adjustPadding();
    window.addEventListener("resize", adjustPadding);
})