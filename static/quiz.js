// Set light mode or dark mode to page //
document.documentElement.setAttribute('data-theme', sessionStorage.getItem('theme'))

window.onbeforeunload = function () {
    return 'Are you sure you want to leave?';
};

// Add content to quiz page //

var storedHint = sessionStorage.getItem('hint-mode');

// Loops through questions dictionary and add HTML depending on question type
for (var i = 1; i <= 5; i++) {

    var question_type = questions[i]["question_type"];
    to_html = ``;

    if (question_type == "Multiple Choice") {
        to_html = `
            <fieldset class="question" id="group${i}">
                <p>${i}. ${questions[i]["question"]}</p>
                <div class="form-check">
                    <input type="radio" class="form-check-input quizRadio" name="answer${i}" value="${questions[i]["a"]}" autocomplete="off" required>
                    <div class="choice-viewable">
                        <label class="btn btn-outline-primary blue" for="a">A</label>
                        <p class="p-beside-bubbles">${questions[i]["a"]}</p>
                    </div>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input quizRadio" name="answer${i}" value="${questions[i]["b"]}" autocomplete="off">
                    <div class="choice-viewable">
                        <label class="btn btn-outline-primary violet" for="b">B</label>
                        <p class="p-beside-bubbles">${questions[i]["b"]}</p>
                    </div>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input quizRadio" name="answer${i}" value="${questions[i]["c"]}" autocomplete="off">
                    <div class="choice-viewable">
                        <label class="btn btn-outline-primary pink" for="c">C</label>
                        <p class="p-beside-bubbles">${questions[i]["c"]}</p>
                    </div>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input quizRadio" name="answer${i}" value="${questions[i]["d"]}" autocomplete="off">
                    <div class="choice-viewable">
                        <label class="btn btn-outline-primary orange" for="d">D</label>
                        <p class="p-beside-bubbles">${questions[i]["d"]}</p>
                    </div>
                </div>
            </fieldset>
        `;
    }
    else if (question_type == "True and False") {
        to_html = ` 
            <fieldset class="question" id="group${i}">
                <p>${i}. ${questions[i]["question"]}</p>
                <div class="form-check">
                    <input type="radio" class="form-check-input quizRadio" name="answer${i}" value="TRUE" autocomplete="off" required>
                    <div class="choice-viewable">
                        <label class="btn btn-outline-primary blue" for="true">True</label><br>
                    </div>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input quizRadio" name="answer${i}" value="FALSE" autocomplete="off">
                    <div class="choice-viewable">
                        <label class="btn btn-outline-primary violet" for="false">False</label><br>
                    </div>
                </div>
            </fieldset>
        `;
    }
    else if (question_type == "Dropdown") {
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
    else if (question_type == "Fill In The Blank") {
        to_html = `
            <fieldset class="question" id="group${i}">
                <p>${i}. ${questions[i]["question"]}</p>
                <div class="form-group col-md-3">
                    <input name="answer${i}" class="form-control" placeholder="Type..." type="text" autocomplete="off" required>
                </div>
        `;

        var hint = questions[i]["hint"];

        // If hint exists and is wanted:
        if (hint.length > 0 && storedHint !== "no-hint") {
            to_html += ` <!-- below ! data-target="#hintAlert${i}" aria-controls="hintAlert${i}" -->
                <button type="button" class="btn btn-warning get-hint" id="getHint${i}" data-toggle="collapse" aria-expanded="false">Hint</button>
                <div class="shadow-sm alert alert-warning alert-dismissible collapse" id="hintAlert${i}">
                    <div class="alert-text-container">
                        <div class="alert-text">
                            <strong>Q${i} Hint alert!</strong> Are you sure you want to use a hint?
                        </div>
                    </div>
                    <div class="alert-react">
                        <button type="button" class="btn btn-warning yes-hint">YES!</button>
                        <button type="button" class="close" id="hintReact${i}">&times;</button>
                    </div>
                </div>
                <div class="hint"></div>
                </fieldset>
                <input name="hint${i}" value="FALSE" type="hidden">
            `;
        }
        else {
            to_html += `</fieldset>`
            console.log("OFF WITH THE HINT!")
        }
    }
    document.getElementById("quiz_form").innerHTML += to_html;
}

// Add submit button
document.getElementById("quiz_form").innerHTML += `
    <div class="general">
        <button class="btn btn-primary" type="submit" value="Submit">Submit</button>
    </div>
`;


// Respond to page //
document.addEventListener('DOMContentLoaded', function () {

    // Make CSS changes for MC and true/false type questions
    document.querySelectorAll(".choice-viewable").forEach(answerButtons => {
        // Checkmark "hidden" radio buttons
        answerButtons.onmousedown = function (e) {
            console.log(e)
            // inp = e.toElement.offsetParent.getElementsByTagName("input");
            inp = e.target.offsetParent.getElementsByTagName("input");
            inp[0].checked = true;
        }
    });

    // Indicate by color the status of the fill in the blank and dropdown boxes
    function selectBox(e) {
        // Make outline of input box purple if form field is filled
        if (e.target.classList.contains("form-control") && e.target.value) {
            e.target.style.borderColor = "#80008080";
            e.target.style.boxShadow = "0px 0px 0px 3px #80008044";
        }
        // Make outline of dropdown box purple 
        else if (e.target.parentNode.classList.contains("form-control") && e.target.parentNode.value) {
            e.target.parentNode.style.borderColor = "80008080";
            e.target.parentNode.style.boxShadow = "0px 0px 0px 3px #80008044";
        }
        // else have input box return to original css style properties
        else {
            e.target.style.removeProperty("border-color");
            e.target.style.removeProperty("box-shadow");
        };
    };

    // Make CSS changes for dropdown and fill-in-the-blank type questions
    document.querySelectorAll(".form-control").forEach(inpBoxes => {
        inpBoxes.onclick = function (e) {
            selectBox(e);
        }
        inpBoxes.onkeyup = function (e) {
            selectBox(e);
        }
    });

    // Toggle hint alert
    document.querySelectorAll(".get-hint").forEach(hintBoxes => {
        hintBoxes.onclick = function (e) {
            collapseSect = e.target.nextElementSibling;
            var isExpanded = $(e.target).attr("aria-expanded");
            if (isExpanded === "true") {
                $(collapseSect).collapse('hide');
                e.target.setAttribute("aria-expanded", "false");
            }
            else {
                // Collapse all alerts
                $('.alert-warning').collapse('hide');
                $('.get-hint').attr("aria-expanded", "false");
                setTimeout(function () {
                    $(collapseSect).collapse('show');
                    e.target.setAttribute("aria-expanded", "true");
                }, 200);
            }
        }
    });

    // Hide get hint button, add hint to page, have form record which hint was used
    function displayHint(e) {
        fieldSet = e.target.parentNode.parentNode.parentNode
        qNum = fieldSet.id;
        qNum = qNum.charAt(qNum.length - 1);
        i = parseInt(qNum);

        hintButton = fieldSet.querySelectorAll(".get-hint")[0];
        hintButton.style.display = "none";

        fieldSet.querySelectorAll(".hint")[0].innerHTML += `
            <p class="hint-p">HINT: ${questions[i]["hint"]}</p>
        `;

        var hintToForm = document.getElementsByName(`hint${qNum}`)[0];
        hintToForm.setAttribute('value', 'TRUE');

        // Removes hint alert div from HTML
        e.target.parentNode.parentNode.remove();
    }

    // Display hint after 'Yes!' clicked
    document.querySelectorAll(".yes-hint").forEach(getHint => {
        getHint.onclick = function (e) {
            displayHint(e);
        }
    });

    // Hide hint alert if 'x' is clicked
    document.querySelectorAll(".close").forEach(noHint => {
        // Checkmark "hidden" radio buttons
        noHint.onclick = function (e) {
            targ = "hintAlert" + e.target.id.charAt(e.target.id.length - 1);
            $(`#${targ}`).collapse('toggle');
            hintBtn = "getHint" + e.target.id.charAt(e.target.id.length - 1);
            document.getElementById(hintBtn).setAttribute("aria-expanded", "false");
        }
    });
});