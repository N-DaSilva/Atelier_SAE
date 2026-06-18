document.addEventListener('DOMContentLoaded', () => {
    const difficulty = new URLSearchParams(document.location.search).get("difficulty");

    const terminalElement = document.getElementById('terminal');
    let terminalLineElement = document.querySelector(".terminal-line.current");

    const textLines = ["db:connect tiktok.com", "Password :", "Connected to Tiktok database", 'search:group -includes "ineskooo_013" & "lapaupau._77" & "arracheusedebrune"', '1 result(s) - "Les Winx <fairy><sparkle>" - last-active '+ yesterdayAtString(), 'cat "Les Winx <fairy><sparkle>"', "TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gUGhhc2VsbHVzIGV4IGZlbGlzLCBwb3J0YSB2aXRhZSBlbmltIG5lYywgdWx0cmljZXMgdWxsYW1jb3JwZXIgaXBzdW0uIFV0IGVuaW0gc2FwaWVuLCBhbGlxdWV0IGEgYXJjdSBpbiwgdHJpc3RpcXVlIHB1bHZpbmFyIG51bmMuIEZ1c2NlIGFjIGVzdCB2ZWhpY3VsYSwgZGlnbmlzc2ltIHR1cnBpcyBhYywgZnJpbmdpbGxhIGR1aS4gRG9uZWMgYXJjdSB1cm5hLCBjb25zZXF1YXQgdXQgbWkgdmVsLCBmYXVjaWJ1cyBncmF2aWRhIGxpYmVyby4gTWFlY2VuYXMgdXQgdG9ydG9yIHZlbmVuYXRpcywgcG9ydGEgcmlzdXMgdXQsIG1hdHRpcyBtaS4gTnVsbGFtIG5lYyBpcHN1bSBxdWlzIGZlbGlzIHVsdHJpY2llcyBsYWNpbmlhLiBEb25lYyBwaGFyZXRyYSwgc2FwaWVuIGV1IGNvbnZhbGxpcyBydXRydW0sIGFyY3UgdXJuYSBibGFuZGl0IG5pc2ksIG5vbiBzZW1wZXIgZW5pbSBsZWN0dXMgbm9uIG1ldHVzLiBQcm9pbiB0aW5jaWR1bnQgaWFjdWxpcyB2YXJpdXMuIFBlbGxlbnRlc3F1ZSB1dCB0dXJwaXMgZXQgZXJvcyBmZXJtZW50dW0gdmVzdGlidWx1bSBzZWQgdmVsIGxpYmVyby4gTWFlY2VuYXMgdGVtcG9yIGVyYXQgdXQgbGVvIHBvcnR0aXRvciwgcXVpcyBkYXBpYnVzIG51bGxhIHZ1bHB1dGF0ZS4gTmFtIHB1bHZpbmFyIHB1cnVzIG1vbGVzdGllIGR1aSBydXRydW0sIHV0IG1vbGVzdGllIG1pIHJ1dHJ1bS4gVXQgbGFjaW5pYSBtaSBhYyBlcm9zIHNvbGxpY2l0dWRpbiB0ZW1wdXMuIFBoYXNlbGx1cyBhcmN1IGRpYW0sIGZhdWNpYnVzIHZlbCBtYWxlc3VhZGEgaWQsIGVsZW1lbnR1bSBhdCBsaWd1bGEuIEludGVnZXIgZmFjaWxpc2lzIG1vbGVzdGllIGp1c3RvIGFjIHZ1bHB1dGF0ZS4gUHJhZXNlbnQgdHVycGlzIGF1Z3VlLCBzY2VsZXJpc3F1ZSBpZCB0b3J0b3IgaW4sIHZlbmVuYXRpcyBzb2xsaWNpdHVkaW4gZW5pbS4gU2VkIGRhcGlidXMgcG9ydHRpdG9yIGRpYW0gc2l0IGFtZXQgYXVjdG9yLg==", "open Decoder",""];

    const userInputLinesIndex = [0, 3, 5, 7];
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let currentInputText = '';

    let cursorVisible = true;
    let cursorLoop;

    let isPassword = currentLineIndex == 1;

    const isInputLine = (lineIndex) => userInputLinesIndex.includes(lineIndex);

    const createLineElement = (lineText = "") => {
        const line = document.createElement('p');
        line.classList.add('terminal-line');
        line.textContent = lineText;
        return line;
    };

    const currentPrefix = () => (isInputLine(currentLineIndex) ? '> ' : '');

    const appendLine = (lineText = '', isCurrent = false) => {
        const line = createLineElement(lineText);

        if (isCurrent) {
            line.classList.add('current');
        }

        terminalElement.appendChild(line);
        terminalLineElement = line;
    };

    const renderCurrentLine = () => {
        if (!terminalLineElement) {
            return;
        }

        if (currentLineIndex >= textLines.length) {
            terminalLineElement.textContent = '';
            return;
        }

        if (!isInputLine(currentLineIndex)) {
            terminalLineElement.textContent = textLines[currentLineIndex];
            return;
        }

        const cursor = cursorVisible ? '_' : '';
        terminalLineElement.textContent = `${currentPrefix()}${currentInputText}${cursor}`;
    };

    const revealNextLines = () => {
        while (currentLineIndex < textLines.length && !isInputLine(currentLineIndex) && !isPassword) {
            appendLine(textLines[currentLineIndex], false);
            currentLineIndex += 1;
        }

        if (currentLineIndex < textLines.length) {
            appendLine('', true);
            currentInputText = '';
            renderCurrentLine();
        }
    };

    const inputPassword = () => {
        appendLine(textLines[currentLineIndex], true);
        let nbPasswordInputs = 0;
        document.addEventListener('keydown', (e) => {
            nbPasswordInputs ++;

            if (nbPasswordInputs == 10){
                isPassword = false;
                currentLineIndex++;
                revealNextLines();
            }
        })
    }

    const startCursorLoop = () => {
        if (cursorLoop) {
            clearInterval(cursorLoop);
        }

        cursorLoop = setInterval(() => {
            cursorVisible = !cursorVisible;
            renderCurrentLine();
        }, 500);
    };

    const advanceLine = () => {
        if (terminalLineElement) {
            terminalLineElement.classList.remove('current');
            terminalLineElement.textContent = `${currentPrefix()}${currentInputText}`;
        }

        currentLineIndex += 1;
        currentCharIndex = 0;
        currentInputText = '';
        cursorVisible = true;

        isPassword = currentLineIndex == 1;

        if (currentLineIndex >= textLines.length) {
            return;
        }

        if (currentLineIndex == textLines.length -1) {
            displayPopup();
        }

        if (isPassword) {
            inputPassword();
            return;
        }

        revealNextLines();
    };

    const typeCurrentLine = (input) => {
        if (!isInputLine(currentLineIndex) || currentCharIndex >= textLines[currentLineIndex].length) {
            return;
        }

        currentInputText += input;
        renderCurrentLine();
        currentCharIndex ++;
    };

    const submitCurrentLine = () => {
        if (!isInputLine(currentLineIndex)) {
            return;
        }

        advanceLine();
    };

    const displayPopup = () => {
        const popup = document.getElementById("popup");
        popup.show();
        popup.style.display = 'block';
        setTimeout(() => {
            document.getElementById("popup-content").innerHTML = "<a class='start-bttn' href='config.html?difficulty="+difficulty+"'>Start</a>";
        }, 5000);
    }

    revealNextLines();
    startCursorLoop();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitCurrentLine();
            return;
        }

        if (e.key.length === 1) {
            typeCurrentLine(textLines[currentLineIndex][currentCharIndex]);
        }
    })


    function yesterdayAtString(h = 22, m = 57, s = 43) {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(h, m, s, 0);
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
})