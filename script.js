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

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let matrixInterval;

    const timerElement = document.getElementById("timer");
    const timerBarElement = document.getElementById("timer-bar");

    let counter = 6 * 1000; // 5 seconds
    const maxTime = maxRounds * 30 * 1000; // 60 secondes par tour
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
        generatedStringZone.innerHTML = "";
        inputZone.innerHTML = "";
        
        if (action == "lose") {
            resetBttn.style.display = "block";
            timerElement.textContent = "0";
        } else if (action == "win") {
            win();
        }
    }

    const win = () => {
        const winningElement = document.getElementById("winning-ending");
        const videoElement = document.getElementById("reveal-video");

        clearInterval(matrixInterval);

        winningElement.classList.remove("hidden");

        // Ajouter une Pop-up (comme celle de l'intro) "Video unlocked" pour lancer la vidéo ?
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                winningElement.classList.add("visible");
                
                winningElement.addEventListener("transitionend", () => {
                    videoElement.muted = true;
                    videoElement.play().then(() => {
                        videoElement.muted = false;
                    });
                    videoElement.classList.add("visible");
                }, { once: true });
            });
        });
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

        // Timer
        reduceTime(2); // Reduce time by 2 seconds
        timerBarElement.style.backgroundColor = "#f00";

        // Sound
        errorSound.currentTime = 0;
        errorSound.play();

        // Color
        charElement.classList.add("incorrect-letter");

        // Animation
        charElement.classList.remove("animate");
        charElement.classList.add("animate");
        charElement.addEventListener("animationend", () => {
            charElement.classList.remove("animate");
        }, { once: true });
    }

    const correctCharacter = (index) => {

        // Sound
        correctSound.currentTime = 0;
        correctSound.play();

        // Color
        document.getElementById("char" + inputIndex).classList.remove("current-letter", "incorrect-letter");
        document.getElementById("char" + inputIndex).classList.add("correct-letter");
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

            if (checkCorrectInput(input, code[inputIndex], currentMap)) {
                correctCharacter(inputIndex);
                
                inputIndex++;

                if (inputIndex >= code.length) {
                    if (rounds >= maxRounds) {
                        stop("win");
                    } else {
                        rounds++;
                        generateString();
                        updateRounds();
                        addTime(30); // Add 10 seconds for the next round
                    }
                } else {
                    document.getElementById("char" + inputIndex).classList.add("current-letter");
                }
            } else {
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
        tickingSound.pause();
    }


    // Background
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    let matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    matrix = matrix.split("");

    let font_size = 10;
    let columns = canvas.width / font_size;
    let drops = [];

    for (let x = 0; x < columns; x++)
        drops[x] = 1;

    //drawing the characters
    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#006300";
        ctx.font = font_size + "px arial";
        for (let i = 0; i < drops.length; i++) {
            let text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            if (drops[i] * font_size > canvas.height && Math.random() > 0.975)
                drops[i] = 0;
            drops[i]++;
        }
    }

    matrixInterval = setInterval(draw, 35);

})