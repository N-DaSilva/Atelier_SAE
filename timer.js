const timerElement = document.getElementById("timer");
const maxTime = 10 * 1000; // 10 seconds
let remainingTime = maxTime;
let counter = 5 * 1000; // 5 seconds

const startingCounter = setInterval(() => {
    timerElement.textContent = `Starting in : ${Math.ceil(counter / 1000)}`;
    counter -= 1000;
    if (counter <= 0) {
        clearInterval(startingCounter);
        startTimer();
    }
}, 1000);

const startTimer = () => {
    timer = setInterval(() => {
        timerElement.textContent = `Time remaining: ${Math.ceil(remainingTime / 1000)} seconds`;
        remainingTime -= 1000;
        if (remainingTime < 0) {
            endTimer();
        }
    }, 1000);
}

//TODO : reduce time if error is made, increase time if word is correct

const endTimer = () => {
    clearInterval(timer);
    timerElement.textContent = "Time's up ! Game Over !";
}
