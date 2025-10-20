(() => {
    if (window.__idleOverlayInitialized) return;
    window.__idleOverlayInitialized = true;

    const IDLE_THRESHOLD = 10 * 1000;
    const OVERLAY_DELAY = 1 * 1000;

    let idleInterval = null;
    let lastInteraction = Date.now();

    const overlayElement = document.querySelector(".idle-overlay");
    const messageElement = document.getElementById("idle-message");

    function hideIdleOverlay() {
        if (!overlayElement || !messageElement) return;
        overlayElement.classList.remove("active");
        messageElement.classList.remove("show");
    }

    function updateIdleOverlay() {
        if (!overlayElement || !messageElement) return;

        const idleDuration = Date.now() - lastInteraction;

        if (idleDuration >= OVERLAY_DELAY) {
            overlayElement.classList.add("active");

            if (idleDuration >= IDLE_THRESHOLD) {
                messageElement.classList.add("show");
            }
        } else {
            hideIdleOverlay();
        }
    }

    function registerActivityListeners() {
        const activityEvents = [
            "mousemove",
            "mousedown",
            "keydown",
            "touchstart",
            "scroll"
        ];

        activityEvents.forEach((event) => {
            document.addEventListener(event, () => {
                lastInteraction = Date.now();
                hideIdleOverlay();
            });
        });

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                lastInteraction = Date.now();
                hideIdleOverlay();
            }
        });
    }

    function startIdleWatcher() {
        if (idleInterval) return;
        idleInterval = setInterval(updateIdleOverlay, 1000);
    }

    window.addEventListener("load", () => {
        const container = document.querySelector(".container");
        if (container) {
            container.classList.remove("container");
        }

        lastInteraction = Date.now();
        registerActivityListeners();
        startIdleWatcher();
    });
})();