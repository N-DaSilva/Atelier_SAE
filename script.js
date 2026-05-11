document.addEventListener("DOMContentLoaded", () => {
    const keyMaps = [
        { 1: "L", 2: "1", 3: "2", 4: "J", 5: "M", 6: "6", 7: "8", 8: "0", 9: "*", 0: ")" },
        { 1: "M", 2: "J", 3: "8", 4: "L", 5: "1", 6: ")", 7: "0", 8: "6", 9: "2", 0: "*" },
        { 1: "1", 2: "J", 3: "6", 4: "L", 5: "0", 6: "*", 7: "8", 8: "M", 9: ")", 0: "2" },
        { 1: "6", 2: "*", 3: ")", 4: "M", 5: "2", 6: "1", 7: "J", 8: "L", 9: "0", 0: "8" },
        { 1: "8", 2: "1", 3: "M", 4: "0", 5: "*", 6: "L", 7: ")", 8: "J", 9: "6", 0: "2" },
        { 1: "*", 2: "6", 3: ")", 4: "M", 5: "J", 6: "0", 7: "L", 8: "2", 9: "1", 0: "8" }
    ];
    let availableMaps = keyMaps;
    let currentMap;

    const codeValues = 'L12JM680*)'.split('');
    const inputValues = '1234567890'.split('');
    const inputZone = document.getElementById("input-zone");
    const generatedStringZone = document.getElementById("generated-string");
    const resetBttn = document.getElementById("reset-bttn");
    const roundsElement = document.getElementById("rounds");

    let playing = false;

    let code = "";
    let inputIndex = 0;
    let rounds = 1;
    let maxRounds = 5;


    const timerElement = document.getElementById("timer");
    const timerBarElement = document.getElementById("timer-bar");
    
    let counter = 6 * 1000; // 5 seconds
    const maxTime = maxRounds * 30 * 1000; // 30 secondes par tour
    let remainingTime = maxTime;

    const errorSound = new Audio('medias/error.mp3');
    const correctSound = new Audio('medias/correct.mp3');
    const tickingSound = new Audio('medias/tick.mp3');

    roundsElement.textContent = `Round: ${rounds} / ${maxRounds}`;
    const updateRounds = () => {
        roundsElement.textContent = `Round: ${rounds} / ${maxRounds}`;
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }

    const generateString = () => {
        const chosenMapIndex = getRandomInt(availableMaps.length);
        currentMap = availableMaps.splice(chosenMapIndex, 1)[0];
        console.log(currentMap, availableMaps);

        let generatedString = "";
        let generatedHTML = "";
        let randomIndex = getRandomInt(codeValues.length);

        for (let i = 0; i < codeValues.length; i++) {
            if (generatedString.length > 0) {
                while (codeValues[randomIndex] == generatedString[i-1]) {
                    randomIndex = getRandomInt(codeValues.length);
                }
            }
            generatedString += codeValues[randomIndex];
            generatedHTML += `<span id="char${i}">${generatedString[i]}</span>`
        }

        generatedStringZone.innerHTML = generatedHTML;
        code = generatedString;
        inputIndex = 0;
        inputZone.innerHTML = "";
        document.getElementById("char" + inputIndex).style.color = "yellow";

        console.log(code);
    }

    const stop = (action) => {
        playing = false;
        endTimer();
        resetBttn.style.display = "block";
        generatedStringZone.innerHTML = "";
        inputZone.innerHTML = "";

        if (action == "lose") {
            timerElement.textContent = "0";
        } else if (action == "win") {
            timerElement.textContent = ":)"
        }
    }

    const reset = () => {
        rounds = 1;
        resetBttn.style.display = "none";
        roundsElement.textContent = `Round: ${rounds} / ${maxRounds}`;
        remainingTime = maxTime;
        availableMaps = keyMaps;
        playing = true;

        generateString();
        startTimer();
    }

    resetBttn.addEventListener('click', reset);

    const incorrectCharacter = (index) => {
        const charElement = document.getElementById("char" + index);

        charElement.style.color = "#f00";

        charElement.classList.remove("animate");
        charElement.classList.add("animate");
        charElement.addEventListener("animationend", () => {
            charElement.classList.remove("animate");
        }, { once: true });
    }

    const checkCorrectInput = (input, correctKey, map) => {
        let isCorrectInput = false
        Object.keys(map).forEach(key => {
            if ((key == input) && (map[key] == correctKey)) {
                isCorrectInput = true;          }
        });
        return isCorrectInput;
    }

    document.addEventListener("keydown", (e) => {
        if (!playing) return;

        const input = e.key.toUpperCase();
        if (inputValues.includes(input)) {
            inputZone.innerHTML += input;
            console.log(checkCorrectInput(input, code[inputIndex], currentMap));

            if (checkCorrectInput(input, code[inputIndex], currentMap)) {
                correctSound.currentTime = 0;
                addTime(3);
                correctSound.play();
                document.getElementById("char" + inputIndex).style.color = "#00ff00";
                inputIndex++;

                if (inputIndex >= code.length) {
                    generateString();
                    rounds++;
                    updateRounds();
                    addTime(30); // Add 30 seconds for the next round
                    if (rounds >= maxRounds) {
                        stop("win");
                    }
                } else {
                    document.getElementById("char" + inputIndex).style.color = "#ff0";
                }
            } else {
                reduceTime(2); // Reduce time by 2 seconds
                errorSound.currentTime = 0;
                errorSound.play();
                timerBarElement.style.backgroundColor = "#f00";
                incorrectCharacter(inputIndex);
            }
        }
    })

    // Timer logic
    const startingCounter = setInterval(() => {
        counter -= 1000;
        timerElement.textContent = Math.ceil(counter / 1000);
        if (counter <= 0) {
            clearInterval(startingCounter);
            startTimer();
            playing = true;
            generateString();
        }
    }, 1000);

    const startTimer = () => {
        timer = setInterval(() => {
            timerElement.textContent = Math.ceil(remainingTime / 1000);
            timerBarElement.style.width = (100 * remainingTime) / maxTime + '%';
            remainingTime -= 1000;
            tickingSound.currentTime = 0;
            tickingSound.play();

            if (window.getComputedStyle(timerBarElement).getPropertyValue("background-color") == "rgb(255, 0, 0)") {
                timerBarElement.style.backgroundColor = "#0f0";
            }

            if (remainingTime < 0) {
                stop("lose");
            }
        }, 1000);
    }

    const reduceTime = (seconds) => {
        remainingTime -= seconds * 1000;
        if (remainingTime < 0) {
            stop("lose");
        }
    }

    const addTime = (seconds) => {
        remainingTime += seconds * 1000;
    }

    const endTimer = () => {
        clearInterval(timer);
    }


    //background
    // geting canvas by Boujjou Achraf
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    //making the canvas full screen
    c.height = window.innerHeight;
    c.width = window.innerWidth;

    //chinese characters - taken from the unicode charset
    var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    //converting the string into an array of single characters
    matrix = matrix.split("");

    var font_size = 10;
    var columns = c.width / font_size; //number of columns for the rain
    //an array of drops - one per column
    var drops = [];
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for (var x = 0; x < columns; x++)
        drops[x] = 1;

    //drawing the characters
    function draw() {
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#006300";//green text
        ctx.font = font_size + "px arial";
        //looping over drops
        for (var i = 0; i < drops.length; i++) {
            //a random chinese character to print
            var text = matrix[Math.floor(Math.random() * matrix.length)];
            //x = i*font_size, y = value of drops[i]*font_size
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            //sending the drop back to the top randomly after it has crossed the screen
            //adding a randomness to the reset to make the drops scattered on the Y axis
            if (drops[i] * font_size > c.height && Math.random() > 0.975)
                drops[i] = 0;

            //incrementing Y coordinate
            drops[i]++;
        }
    }

    setInterval(draw, 35);

})