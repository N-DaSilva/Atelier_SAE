document.addEventListener("DOMContentLoaded", () => {
    const inputZone = document.getElementById("input-zone");

    document.addEventListener("keydown", (e) => {
        inputZone.innerHTML += e.key;
    })
})