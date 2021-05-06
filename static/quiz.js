document.addEventListener('DOMContentLoaded', function() {
    for (var i = 1; i <= 5; i++) { 
        var question_type = questions[i]["question_type"];
        to_html = ``;
        if (question_type == "multiple choice") {
            to_html = `
                <fieldset class="question" id="group${i}">
                    <p>${i}. ${questions[i]["question"]}</p>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="A" autocomplete="off" required>
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary blue bubbles" for="a">A</label>
                            <p class="p-beside-bubbles">${questions[i]["a"]}</p>
                        </div>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="B" autocomplete="off">
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary violet bubbles" for="b">B</label>
                            <p class="p-beside-bubbles">${questions[i]["b"]}</p>
                        </div>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="C" autocomplete="off">
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary pink bubbles" for="c">C</label>
                            <p class="p-beside-bubbles">${questions[i]["c"]}</p>
                        </div>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="D" autocomplete="off">
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary orange bubbles" for="d">D</label>
                            <p class="p-beside-bubbles">${questions[i]["d"]}</p>
                        </div>
                    </div>
                </fieldset>
            `;
        }
        else if (question_type == "true and false") {
            to_html = ` 
                <fieldset class="question" id="group${i}">
                    <p>${i}. ${questions[i]["question"]}</p>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="True" autocomplete="off" required>
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary blue bubbles" for="true">True</label><br>
                        </div>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="False" autocomplete="off">
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary violet bubbles" for="false">False</label><br>
                        </div>
                    </div>
                </fieldset>
            `;
        }
        else if (question_type == "dropdown") {
            to_html = `
                <fieldset class="question" id="group${i}">
                    <p>${i}. ${questions[i]["question"]}</p>
                    <div class="form-group col-md-3">
                        <select name="answer${i}" class="form-control dropdown" required>
                            <option disabled selected value="">Choose...</option>
                            <option class="dropdown" value="${questions[i]["a"]}">${questions[i]["a"]}</option>
                            <option class="dropdown" value="${questions[i]["b"]}">${questions[i]["b"]}</option>
                            <option class="dropdown" value="${questions[i]["c"]}">${questions[i]["c"]}</option>
                            <option class="dropdown" value="${questions[i]["d"]}">${questions[i]["d"]}</option>
                    </div>
                </fieldset>
                `;
        }
        else if (question_type == "fill in the blank") {
            to_html =  `
                <fieldset class="question" id="group${i}">
                    <p>${i}. ${questions[i]["question"]}</p>
                    <div class="form-group col-md-3">
                        <input name="answer${i}" class="form-control" placeholder="Type..." type="text" autocomplete="off" required>
                    </div>
            `;
            var hint = questions[i]["hint"];
            if (hint != "None") {
                to_html += `
                    <button type="button" class="btn btn-warning get-hint">Hint</button>
                    <div class="hint">
                        <p class="hint-p">HINT: ${questions[i]["hint"]}</p>
                    </div>
                `
            }
            to_html += `</fieldset>`
        }
        document.getElementById("quiz_form").innerHTML += to_html;
    }
    document.getElementById("quiz_form").innerHTML += `
        <div class="general">
            <button class="btn btn-primary" type="submit" name="submit" value="Submit">Submit</button>
        </div>
    `;

    var answerButtons = document.getElementsByClassName("choice-viewable");
    var inpBoxes = document.getElementsByClassName("form-control");
    var hintBox = document.getElementsByClassName("get-hint");

    // Checkmarks "hidden" radio buttons
    function selectBubble(e) {
        inp = e.toElement.offsetParent.getElementsByTagName("input");
        inp[0].checked = true;
    }

    // Make outline of input box purple when the form field is filled, else return to original css style properties
    function selectBox(e) {
        if (e.target.classList.contains("form-control") && e.target.value) {
            e.target.style.borderColor = "purple";
            e.target.style.boxShadow = "0px 0px 0px 3px rgba(255, 0, 255, 0.473)";
        } else if (e.target.classList.contains("form-control") && !(e.target.value)) {
            e.target.style.removeProperty("border-color");
            e.target.style.removeProperty("box-shadow");
        };
    };

    // Hint replaces hint button
    function getHint(e) {
        console.log(e)
        e.target.nextElementSibling.style.display = "block";
        e.target.style.display = "none";
        qNum = e.path[1].id
        qNum = qNum.charAt(qNum.length - 1)
        e.target.nextElementSibling.innerHTML += `
            <input name="hint${qNum}" value="TRUE" type="hidden">
            `;
    }

    // Make css changes for mc and true/false type questions
    for (var j = 0; j < answerButtons.length; j++) {
        answerButtons[j].addEventListener("mousedown", (e) => {
            selectBubble(e);
        });
    }

    // Make css changes for dropdown and fill-in-the-blank type questions
    for (var k = 0; k < inpBoxes.length; k++) {
        inpBoxes[k].addEventListener("click", (e) => {
            selectBox(e);
        })
        inpBoxes[k].addEventListener("keyup", (e) => {
            selectBox(e);
        })
    }

    for (var l = 0; l < hintBox.length; l++) {
        hintBox[l].addEventListener("click", (e) => {
            getHint(e);
        }) 
    }
});