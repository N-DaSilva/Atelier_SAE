document.addEventListener("DOMContentLoaded", () => {
    const inputValues = 'QSDFGHJKLM'.split('');
    const inputZone = document.getElementById("input-zone");
    const generatedStringZone = document.getElementById("generated-string");
    const generateBttn = document.getElementById("generate-bttn");
    const roundsElement = document.getElementById("rounds");

    let code = "";
    let inputIndex = 0;
    let errors = 0;
    let rounds = 1;
    let maxRounds = 5;

    const timerElement = document.getElementById("timer");
    let counter = 5 * 1000; // 5 seconds
    const maxTime = maxRounds * 30 * 1000; // 30 secondes par tour
    let remainingTime = maxTime;

    roundsElement.textContent = `Round: ${rounds} / ${maxRounds}`;
    const updateRounds = () => {
        roundsElement.textContent = `Round: ${rounds} / ${maxRounds}`;
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }

    const generateString = () => {
        console.log("reset");
        if (rounds >= maxRounds){
            rounds = 0;
            generateBttn.innerHTML = "Nouveau code";
            document.getElementById("result").innerHTML = "";
        }

        let generatedString = "";
        let generatedHTML = "";
        for (let i = 0; i < inputValues.length; i++) {
            generatedString += inputValues[getRandomInt(inputValues.length)];
            generatedHTML += `<span id="char${i}">${generatedString[i]}</span>`
        }

        generatedStringZone.innerHTML = generatedHTML;
        code = generatedString;
        inputIndex = 0;
        errors = 0;
        inputZone.innerHTML = "";

        console.log(code);
    }

    generateBttn.addEventListener('click', generateString);

    document.addEventListener("keydown", (e) => {
        const input = e.key.toUpperCase();
        if (inputValues.includes(input)) {
            inputZone.innerHTML += input;

            if (input == code[inputIndex]){
                console.log(input + " is correct");
                document.getElementById("char"+inputIndex).style.color = "green";
                inputIndex ++;

                if (inputIndex >= code.length) {
                    generateString();
                    rounds ++;
                    updateRounds();
                    addTime(5); // Add 5 seconds for the next round
                    if (rounds >= maxRounds){
                        generateBttn.innerHTML = "Rejouer";
                        document.getElementById("result").innerHTML = "Bravo !"
                    }
                }
            } else {
                errors ++;
                reduceTime(2); // Reduce time by 2 seconds
                document.getElementById("char"+inputIndex).style.color = "red";
                console.log(input + " incorrect. " + errors + " erreur(s)");
            }
        }
    })

    // Timer logic
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

    const reduceTime = (seconds) => {
        remainingTime -= seconds * 1000;
        if (remainingTime < 0) {
            endTimer();
        }
    }

    const addTime = (seconds) => {
        remainingTime += seconds * 1000;
    }

    const endTimer = () => {
        clearInterval(timer);
        timerElement.textContent = "Time's up ! Game Over !";
    }
})