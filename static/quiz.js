document.addEventListener('DOMContentLoaded', function() {
    // Loops through dictionary and add HTML depending on question type
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
                            <label class="btn btn-outline-primary blue" for="a">A</label>
                            <p class="p-beside-bubbles">${questions[i]["a"]}</p>
                        </div>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="B" autocomplete="off">
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary violet" for="b">B</label>
                            <p class="p-beside-bubbles">${questions[i]["b"]}</p>
                        </div>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="C" autocomplete="off">
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary pink" for="c">C</label>
                            <p class="p-beside-bubbles">${questions[i]["c"]}</p>
                        </div>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="D" autocomplete="off">
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary orange" for="d">D</label>
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
                            <label class="btn btn-outline-primary blue" for="true">True</label><br>
                        </div>
                    </div>
                    <div class="form-check">
                        <input type="radio" class="form-check-input" name="answer${i}" value="False" autocomplete="off">
                        <div class="choice-viewable">
                            <label class="btn btn-outline-primary violet" for="false">False</label><br>
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
            // If hint exists:
            if (hint != "None") {
                to_html += `
                    <button type="button" class="btn btn-warning get-hint">Hint</button>
                    <div class="shadow-sm alert alert-warning alert-dismissible" role="alert" data-hide="alert">
                        <div>
                            <strong>Q${i} Hint alert!</strong> Are you sure you want to use a hint?
                        </div>
                        <div class="alert-react">
                            <button type="button" class="btn btn-warning yes-hint">YES!</button>
                            <button type="button" class="close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                    </fieldset>
                    <input name="hint${i}" value="FALSE" type="hidden">
                `
            }
            else {
                to_html += `</fieldset>`
            }
        }
        document.getElementById("quiz_form").innerHTML += to_html;
    }
    // Add submit button
    document.getElementById("quiz_form").innerHTML += `
        <div class="general">
            <button class="btn btn-primary" type="submit" name="submit" value="Submit">Submit</button>
        </div>
    `;


    // Questions related var
    var answerButtons = document.querySelectorAll(".choice-viewable");
    var inpBoxes = document.querySelectorAll(".form-control");
    // Hints related var
    var hintBox = document.querySelectorAll(".get-hint");
    var yesHint = document.querySelectorAll(".yes-hint");
    var hintAlert = document.querySelectorAll(".alert-react");


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

    // Hint alert appears
    function confirmGetHint(e) {
        e.target.nextElementSibling.style.display = "flex";
    }
    
    // Hides get hint button, add hint to page, form records which hint is used
    function displayHint(e) {
        hintButton = e.path[3].querySelectorAll(".get-hint")[0];
        hintButton.style.display = "none";

        qNum = e.path[3].id;
        qNum = qNum.charAt(qNum.length - 1);
        i = parseInt(qNum);

        e.path[3].innerHTML += `
        <div class="hint">
            <p class="hint-p">HINT: ${questions[i]["hint"]}</p>
        </div>
        `;
        
        var hintToForm = document.getElementsByName(`hint${qNum}`)[0];
        hintToForm.setAttribute('value', 'TRUE');

        $(".alert-warning").hide(); 
    }


    // Make CSS changes for MC and true/false type questions
    for (var j = 0; j < answerButtons.length; j++) {
        answerButtons[j].addEventListener("mousedown", (e) => {
            selectBubble(e);
        });
    }

    // Make CSS changes for dropdown and fill-in-the-blank type questions
    for (var k = 0; k < inpBoxes.length; k++) {
        inpBoxes[k].addEventListener("click", (e) => {
            selectBox(e);
        })
        inpBoxes[k].addEventListener("keyup", (e) => {
            selectBox(e);
        })
    }

    // Hint alert appears
    for (var l = 0; l < hintBox.length; l++) {
        hintBox[l].addEventListener("click", (e) => {
            confirmGetHint(e);
        }) 
    }

    // Displays hint after Yes! clicked
    for (var m = 0; m < yesHint.length; m++) {
        yesHint[m].addEventListener("click", (e) => {
            displayHint(e);
        }) 
    }

    // Hides hint alert if x is clicked
    for (var n = 0; n < hintAlert.length; n++) {
        hintAlert[n].addEventListener("click", function(){
        $(".alert-warning").hide(); 
        }) 
    }
});