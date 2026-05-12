document.addEventListener("DOMContentLoaded", () => {
    const keyMaps = [
        { "1": "A", "2": "R", "3": "C", "4": "H", "5": "E", "6": "U", "7": "S", "8": "D", "9": "B", "0": "N" },
        { "1": "P", "2": "A", "3": "U", "4": "L", "5": "I", "6": "N", "7": "E", "8": ".", "9": "_", "0": "7" },
        { "1": "I", "2": "N", "3": "E", "4": "S", "5": "K", "6": "O", "7": "_", "8": "0", "9": "1", "0": "3" }
    ];
    let availableMaps = structuredClone(keyMaps);
    let currentMap;

    const inputValues = '1234567890'.split('');
    const inputZone = document.getElementById("input-zone");
    const generatedStringZone = document.getElementById("generated-string");
    const resetBttn = document.getElementById("reset-bttn");
    const roundsElement = document.getElementById("rounds");

    let playing = false;

    let code = "";
    let inputIndex = 0;
    let rounds = 1;
    let maxRounds = 3;
    let corruptionInterval;


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
        console.log(keyMaps);
        console.log(availableMaps);

        let codeValues = '';

        for (const [key, value] of Object.entries(currentMap)) {
            codeValues += value;
        }

        let generatedString = "";
        let generatedHTML = "";
        let randomIndex = getRandomInt(codeValues.length);

        for (let i = 0; i < codeValues.length; i++) {
            if (generatedString.length > 0) {
                while (generatedString.indexOf(codeValues[randomIndex])>-1) {
                    randomIndex = getRandomInt(codeValues.length);
                }
            }
            generatedString += codeValues[randomIndex];
            const randomDelayMs = getRandomInt(900);
            generatedHTML += `<span id="char${i}" data-original="${generatedString[i]}" style="--char-delay:${randomDelayMs}ms">${generatedString[i]}</span>`
        }

        generatedStringZone.innerHTML = generatedHTML;
        code = generatedString;
        inputIndex = 0;
        inputZone.innerHTML = "";
        applyRoundAnimation(rounds);
        document.getElementById("char" + inputIndex).classList.add("current-letter");

        console.log(code);
    }

    const stop = (action) => {
        playing = false;
        endTimer();
        stopCorruptionEffect();
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
        availableMaps = structuredClone(keyMaps);
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
                isCorrectInput = true;
            }
        });
        return isCorrectInput;
    }

    const stopCorruptionEffect = () => {
        if (corruptionInterval) {
            clearInterval(corruptionInterval);
            corruptionInterval = null;
        }
    }

    const startCorruptionEffect = () => {
        stopCorruptionEffect();
        const symbols = ['@', '#'];

        corruptionInterval = setInterval(() => {
            const spans = generatedStringZone.querySelectorAll('span');
            spans.forEach((span, index) => {
                const originalChar = code[index] || span.dataset.original || '';
                if (span.classList.contains('correct-letter') || span.classList.contains('current-letter')) {
                    span.textContent = originalChar;
                    return;
                }

                const roll = Math.random();
                if (roll < 0.16) {
                    span.textContent = '';
                } else if (roll < 0.42) {
                    span.textContent = symbols[getRandomInt(symbols.length)];
                } else {
                    span.textContent = originalChar;
                }
            });
        }, 120);
    }

    const applyRoundAnimation = (round) => {
        generatedStringZone.classList.remove('anim-wiggle', 'anim-glitch-font');
        stopCorruptionEffect();

        if (round === 1) {
            generatedStringZone.classList.add('anim-wiggle');
        } else if (round === 2) {
            generatedStringZone.classList.add('anim-glitch-font');
        } else if (round === 3) {
            startCorruptionEffect();
        }
    }

    document.addEventListener("keydown", (e) => {
        if (!playing) return;

        const input = e.key.toUpperCase();
        if (inputValues.includes(input)) {
            inputZone.innerHTML += input;
            console.log(checkCorrectInput(input, code[inputIndex], currentMap));

            if (checkCorrectInput(input, code[inputIndex], currentMap)) {
                correctSound.currentTime = 0;
                correctSound.play();
                document.getElementById("char" + inputIndex).classList.remove("current-letter");
                document.getElementById("char" + inputIndex).classList.add("correct-letter");
                inputIndex++;

                if (inputIndex >= code.length) {
                    if (rounds >= maxRounds) {
                        stop("win");
                    } else {
                        rounds++;
                        generateString();
                        updateRounds();
                        addTime(10); // Add 10 seconds for the next round
                    }
                } else {
                    document.getElementById("char" + inputIndex).classList.add("current-letter");
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