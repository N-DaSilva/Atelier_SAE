document.addEventListener('DOMContentLoaded', () => {
    const numberElements = Array.from(document.querySelectorAll(".number"));
    const inputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const pressedBtns = [];

    document.addEventListener('keydown', (e) => {
        const input = e.key.toUpperCase();

        if (inputs.includes(input)) {
            numberElements[inputs.indexOf(input)].style.color = "#0f0";

            if (!pressedBtns.includes(input)) {
                pressedBtns.push(input);
            }

            if (pressedBtns.length == 10) {
                displayStart();
            }
        }
    })

    const displayStart = () => {
        const popup = document.getElementById("popup");
        popup.show();
        popup.style.display = 'block';
    }
})