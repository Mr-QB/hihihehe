const IDLE_THRESHOLD = 15 * 1000;
const OVERLAY_DELAY = 1 * 1000;

let idleInterval = null;
let lastInteraction = Date.now();

const counterElement = document.getElementById("idle-counter");
const overlayElement = document.querySelector(".idle-overlay");
const messageElement = document.getElementById("idle-message");

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function hideIdleOverlay() {
    if (!overlayElement || !counterElement || !messageElement) return;
    overlayElement.classList.remove("active");
    counterElement.textContent = "00:00";
    messageElement.classList.remove("show");
}

function updateIdleOverlay() {
    if (!overlayElement || !counterElement || !messageElement) return;

    const idleDuration = Date.now() - lastInteraction;

    if (idleDuration >= OVERLAY_DELAY) {
        overlayElement.classList.add("active");
        counterElement.textContent = formatTime(idleDuration);

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

window.onload = () => {
    const container = document.querySelector(".container");
    if (container) {
        container.classList.remove("container");
    }

    lastInteraction = Date.now();
    registerActivityListeners();
    startIdleWatcher();
};