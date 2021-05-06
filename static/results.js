document.addEventListener('DOMContentLoaded', function() {
    totalScore = 10
    var colon = ":";

    for (var i = 1; i <= 5; i++) { 
        var question_type = questions[i]["question_type"];
        to_html = ``;
        if (question_type == "multiple choice") {
            if (formResults[i - 1].toLowerCase() == questions[i]["answer"].toLowerCase()) {
                to_html = `
                <div class="question">
                    <div class="q-in-results">
                        <i class="fa fa-check-circle fa-2x"></i>
                        <p>${i}. ${questions[i]["question"]}</p>
                    </div>
                    <p>Your answer: ${questions[i][questions[i]["answer"].toLowerCase()]}</p>
                </div>
                `;
            }
            else {
                totalScore -= 2;
                to_html = `
                <div class="question">
                    <div class="q-in-results">
                        <i class="fa fa-times-circle fa-2x"></i>
                        <p>${i}. ${questions[i]["question"]}</p>
                    </div>
                    <p>Correct answer: ${questions[i][questions[i]["answer"].toLowerCase()]}</p>
                    <p>Your answer: ${questions[i][formResults[i - 1].toLowerCase()]}</p>
                </div>
                `;
            };
        }
        else if (question_type == "true and false") {
            if (formResults[i - 1].toLowerCase() == questions[i]["answer"].toLowerCase()) {
                to_html = `
                <div class="question">
                    <div class="q-in-results">
                        <i class="fa fa-check-circle fa-2x"></i>
                        <p>${i}. ${questions[i]["question"]}</p>
                    </div>
                    <p>Your answer: ${questions[i]["answer"]}</p>
                </div>
                `;
            }
            else {
                totalScore -= 2;
                to_html = ` 
                <div class="question">
                    <div class="q-in-results">
                        <i class="fa fa-times-circle fa-2x"></i>
                        <p>${i}. ${questions[i]["question"]}</p>
                    </div>
                    <p>Correct answer: ${questions[i]["answer"]}</p>
                </div>
                `;
            };
        }
        else if (question_type == "dropdown") {
            if (formResults[i - 1].toLowerCase() == questions[i]["answer"].toLowerCase()) {
                to_html = `
                <div class="question">
                    <div class="q-in-results">
                        <i class="fa fa-check-circle fa-2x"></i>
                        <p>${i}. ${questions[i]["question"]}</p>
                    </div>
                    <p>Your answer: ${questions[i]["answer"]}</p>
                </div>
                `;
            }
            else {
                totalScore -= 2;
                to_html = `
                <div class="question">
                    <div class="q-in-results">
                        <i class="fa fa-times-circle fa-2x"></i>
                        <p>${i}. ${questions[i]["question"]}</p>
                    </div>
                    <p>Correct answer: ${questions[i]["answer"]}</p>
                    <p>Your answer: ${formResults[i - 1]}</p>
                </div>
                `;
            };
        }
        else if (question_type == "fill in the blank") {
            if (formResults[i - 1].toLowerCase() == questions[i]["answer"].toLowerCase()) {
                to_html = `
                <div class="question">
                    <div class="q-in-results">
                        <i class="fa fa-check-circle fa-2x"></i>
                        <p>${i}. ${questions[i]["question"]}</p>
                    </div>
                    <p>Your answer: ${questions[i]["answer"]}</p>
                `;
            }
            else{
                totalScore -= 2;
                to_html = `
                <div class="question">
                    <div class="q-in-results">
                        <i class="fa fa-times-circle fa-2x"></i>
                        <p>${i}. ${questions[i]["question"]}</p>
                    </div>
                    <p>Correct answer: ${questions[i]["answer"]}</p>
                    <p>Your answer: ${formResults[i - 1]}</p>
                `;
            };
            if (hintsUsed.includes(i)) {
                totalScore -= 1;
                to_html += `
                    <button type="button" class="btn btn-light hint-result">Hint used: ${questions[i]["hint"]}</button>
                `;
            }
            to_html += `</div>`;
        }
        document.getElementById("questionsResults").innerHTML += to_html;
    }
    document.getElementById("print-region").innerHTML += `
        <div class="general">
            <button type="button" class="btn btn-warning" id="print">Print</button>        
        </div>
    `

    percentage = totalScore * 10

    if (percentage < 0) {
        percentage = 0;
        totalScore = 0;
    }
 
    // Get current date -------- SOURCE: https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript -----------
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    //-----------------------------------------------------  END OF SOURCE

    var score_to_html = `
        <button type="button" class="btn btn-light">Score = ${totalScore}/10 = ${percentage}%</button>
        <div id="name-in-report" class="form-group form-inline">
            <label for="input-name">NAME${colon}</label>
            <input type="nameInput" id="input-name" class="form-control">
        </div>
        <p>DATE: ${today}</p>
    `;
    document.getElementById("results").innerHTML += score_to_html;

    // Prints a report of quiz results. Removes parts of page not in the "report" when printing.
    function reportPrint(e) {
        var optn = document.getElementById("instruction-container");
        e.target.style.display = "none";
        optn.style.display = "none";
        window.print();
        e.target.style.display = "block";
        optn.style.display = "flex";
    };

    document.getElementById("print").addEventListener("click", (e) => {
        reportPrint(e);
    });

});