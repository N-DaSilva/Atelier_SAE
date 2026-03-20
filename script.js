document.addEventListener("DOMContentLoaded", () => {
    const inputValues = 'QSDFGHJKLM'.split('');
    const inputZone = document.getElementById("input-zone");
    const generatedStringZone = document.getElementById("generated-string");
    const generateBttn = document.getElementById("generate-bttn");

    let code = "";
    let inputIndex = 0;
    let errors = 0;
    let rounds = 1;

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }

    const generateString = () => {
        console.log("reset");
        if (rounds >= 5){
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
                    if (rounds >= 5){
                        generateBttn.innerHTML = "Rejouer";
                        document.getElementById("result").innerHTML = "Bravo !"
                    }
                }
            } else {
                errors ++;
                document.getElementById("char"+inputIndex).style.color = "red";
                console.log(input + " incorrect. " + errors + " erreur(s)");
            }
        }
    })
})