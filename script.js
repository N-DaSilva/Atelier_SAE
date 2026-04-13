document.addEventListener("DOMContentLoaded", () => {
    const inputValues = 'L12JM680*)'.split('');
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
        let generatedString = "";
        let generatedHTML = "";
        for (let i = 0; i < inputValues.length; i++) {
            generatedString += inputValues[getRandomInt(inputValues.length)];
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
        // generateBttn.style.display = "none";
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
        // generateBttn.style.display = "block";
        resetBttn.style.display = "none";
        roundsElement.textContent = `Round: ${rounds} / ${maxRounds}`;
        remainingTime = maxTime;
        playing = true;

        generateString();
        startTimer();
    }

    // generateBttn.addEventListener('click', generateString);
    resetBttn.addEventListener('click', reset);

    document.addEventListener("keydown", (e) => {
        if (!playing) return;

        const input = e.key.toUpperCase();
        if (inputValues.includes(input)) {
            inputZone.innerHTML += input;

            if (input == code[inputIndex]) {
                document.getElementById("char" + inputIndex).style.color = "#00ff00";
                inputIndex++;

                if (inputIndex >= code.length) {
                    generateString();
                    rounds++;
                    updateRounds();
                    addTime(5); // Add 5 seconds for the next round
                    if (rounds >= maxRounds) {
                        stop("win");
                    }
                } else {
                    document.getElementById("char" + inputIndex).style.color = "yellow";
                }
            } else {
                reduceTime(2); // Reduce time by 2 seconds
                document.getElementById("char" + inputIndex).style.color = "red";
            }
        }
    })

    // Timer logic
    const startingCounter = setInterval(() => {
        timerElement.textContent = Math.ceil(counter / 1000);
        counter -= 1000;
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
        var columns = c.width/font_size; //number of columns for the rain
        //an array of drops - one per column
        var drops = [];
        //x below is the x coordinate
        //1 = y co-ordinate of the drop(same for every drop initially)
        for(var x = 0; x < columns; x++)
            drops[x] = 1; 

        //drawing the characters
        function draw()
        {
            //Black BG for the canvas
            //translucent BG to show trail
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fillRect(0, 0, c.width, c.height);

            ctx.fillStyle = "#006300";//green text
            ctx.font = font_size + "px arial";
            //looping over drops
            for(var i = 0; i < drops.length; i++)
            {
                //a random chinese character to print
                var text = matrix[Math.floor(Math.random()*matrix.length)];
                //x = i*font_size, y = value of drops[i]*font_size
                ctx.fillText(text, i*font_size, drops[i]*font_size);

                //sending the drop back to the top randomly after it has crossed the screen
                //adding a randomness to the reset to make the drops scattered on the Y axis
                if(drops[i]*font_size > c.height && Math.random() > 0.975)
                    drops[i] = 0;

                //incrementing Y coordinate
                drops[i]++;
            }
        }

        setInterval(draw, 35);

})