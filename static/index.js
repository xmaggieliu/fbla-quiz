function hitEnter(e, btnID) {
  if (e.code === 'Enter') {
    document.getElementById(`${btnID}`).click();
  }
}


// ADD QUESTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////

var addQuestion = { 'id': "", 'question_type': "", "question": "", "answer": "", "hint": "", "a": "", "b": "", "c": "", "d": "" };

function addingQType(e) {
  // Add more input fields depending on type of question to be added
  var type = e.target.value;
  addQuestion['question_type'] = type;
  if (type === "Multiple Choice" || type === "Dropdown") {
    var to_html = `
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control toAdd" id="addAnswer" name="answer" placeholder="Answer" type="text" required>
      </div>
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control toAdd" id="addA" name="a" placeholder="Option 1" type="text" required>
      </div>
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control toAdd" id="addB" name="b" placeholder="Option 2" type="text" required>
      </div>
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control toAdd" id="addC" name="c" placeholder="Option 3" type="text" required>
      </div>
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control toAdd" id="addD" name="d" placeholder="Option 4" type="text" required>
      </div>
    `;
  }
  else if (type === "True and False") {
    var to_html = `
      <div class="form-group inline">
        <select name="answer" class="form-control dropdown toAdd" id="addAnswer">
          <option disabled selected value="">Answer</option>
          <option class="dropdown" value="TRUE">True</option>
          <option class="dropdown" value="FALSE">False</option>
        </select>
      </div>
    `;
  }
  else if (type === "Fill In The Blank") {
    var to_html = `
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control toAdd" name="answer" id="addAnswer" placeholder="Answer" type="text" required>
      </div>
      <div class="form-group inline">
        <input autocomplete="off" autofocus class="form-control toAdd" name="hint" placeholder="Hint" type="text">
      </div>
    `;
  }

  document.getElementById("dependent").innerHTML = to_html;

  // Update addQuestion object to temporarily store all inputs
  document.querySelectorAll('.toAdd').forEach(addSect => {
    addSect.onkeyup = function (e) {
      addQuestion[e.target.name] = e.target.value;
      hitEnter(e, "confirmAdd");
    }
    addSect.onclick = function (e) {
      addQuestion[e.target.name] = e.target.value;
      console.log(addQuestion[e.target.name])
    };
  })
};

// Confirmation text for adding questions 
function confirmAddText() {
  $("#fading-text").fadeIn('fast').delay(1500).fadeOut('fast');
}

// EDIT QUESTIONS   /////////////////////////////////////////////////////////////////////////////////////////////////
function editQs(e) {
  e = e || window.event;

  // Row # in table (starts from 0)
  qNum = parseInt(e.value);

  // Question id
  qid = e.id;
  qid = qid.slice(4, qid.length);

  tdChildren = e.parentNode.parentNode.children;
  type = tdChildren[0].innerHTML;
  var editQuestion = { 'id': qid, "question_type": qBank[qNum]["question_type"], "question": `${tdChildren[1].innerHTML}`, "answer": `${tdChildren[2].innerHTML}`, "hint": `${tdChildren[3].innerHTML}`, "a": `${tdChildren[4].innerHTML}`, "b": `${tdChildren[5].innerHTML}`, "c": `${tdChildren[6].innerHTML}`, "d": `${tdChildren[7].innerHTML}` };

  var to_html = `
    <div class="form-group inline">
      <label>Question:</label>
      <input autocomplete="off" value="${tdChildren[1].innerHTML}" autofocus id="editQinput" class="form-control toEdit" name="question" placeholder="Question" type="text" required>
    </div>  
    <input class="del-btn" value="${qid}" name="qid">
  `;

  if (type === "Multiple Choice" || type === "Dropdown") {
    to_html += `
      <div class="form-group inline">
        <label>Answer:</label>
        <input autocomplete="off" value="${tdChildren[2].innerHTML}" autofocus id="editAnswer" class="form-control toEdit" name="answer" placeholder="Answer" type="text" required>
      </div>
      <div class="form-group inline">
        <label>Option 1:</label>
        <input autocomplete="off" value="${tdChildren[4].innerHTML}" autofocus id="editA" class="form-control toEdit" name="a" placeholder="Option 1" type="text" required>
      </div>
      <div class="form-group inline">
        <label>Option 2:</label>
        <input autocomplete="off" value="${tdChildren[5].innerHTML}" autofocus id="editB" class="form-control toEdit" name="b" placeholder="Option 2" type="text" required>
      </div>
      <div class="form-group inline">
        <label>Option 3:</label>
        <input autocomplete="off" value="${tdChildren[6].innerHTML}" autofocus id="editC" class="form-control toEdit" name="c" placeholder="Option 3" type="text" required>
      </div>
      <div class="form-group inline">
        <label>Option 4:</label>
        <input autocomplete="off" value="${tdChildren[7].innerHTML}" autofocus id="editD" class="form-control toEdit" name="d" placeholder="Option 4" type="text" required>
      </div>
    `;
  }
  else if (type === "True and False") {
    if (tdChildren[2].innerHTML === "TRUE") {
      to_html += `
      <div class="form-group inline">
        <label>Answer:</label>
        <select name="answer" class="form-control dropdown toEdit" id="editAnswer" required>
          <option disabled value="">Answer</option>
          <option class="dropdown" selected value="TRUE">True</option>
          <option class="dropdown" value="FALSE">False</option>
        </select>
      </div>
        `;
    }
    else {
      to_html += `
      <div class="form-group inline">
        <label>Answer:</label>
        <select name="answer" class="form-control dropdown toEdit" id="editAnswer" required>
          <option class="dropdown" value="TRUE">True</option>
          <option class="dropdown" selected value="FALSE">False</option>
        </select>
      </div>
        `;
    }
  }
  else if (type === "Fill In The Blank") {
    to_html += `
    <div class="form-group inline">
      <label>Answer:</label>
      <input autocomplete="off" value="${tdChildren[2].innerHTML}" id="editAnswer" autofocus class="form-control toEdit" name="answer" placeholder="Answer" type="text" required>
    </div>
    <div class="form-group inline">
      <label>Hint:</label>
      <input autocomplete="off" value="${tdChildren[3].innerHTML}" autofocus class="form-control toEdit" name="hint" placeholder="Hint" type="text">
    </div>
    `;
  }
  document.getElementById("editQdiv").innerHTML = to_html;

  // Update addQuestion object to temporarily store all inputs
  document.querySelectorAll('.toEdit').forEach(editSect => {
    editSect.onclick = function (e) {
      e = e || window.event;
      editQuestion[e.target.name] = e.target.value;
    }
    editSect.onkeyup = function (e) {
      e = e || window.event;
      editQuestion[e.target.name] = e.target.value;
      hitEnter(e, "confirmSave");
    }
  });

  document.getElementById("confirmSave").onclick = function () {
    if (editQuestion['question'] == "") {
      document.getElementById("editQinput").setCustomValidity("Please enter a question");
      document.getElementById("editQinput").reportValidity();
      return;
    }
    else if (editQuestion['answer'] == '') {
      document.getElementById("editAnswer").setCustomValidity("Please enter an answer");
      document.getElementById("editAnswer").reportValidity();
      return;
    }
    else if (type === "Multiple Choice" || type === "Dropdown") {
      const choices = [editQuestion['a'], editQuestion['b'], editQuestion['c'], editQuestion['d']];
      const setChoix = new Set(choices);
      if (editQuestion['a'] == "") {
        document.getElementById("editA").reportValidity();
        return;
      }
      else if (editQuestion['b'] == "") {
        document.getElementById("editB").reportValidity();
        return;
      }
      else if (editQuestion['c'] == "") {
        document.getElementById("editC").reportValidity();
        return;
      }
      else if (editQuestion['d'] == "") {
        document.getElementById("editD").reportValidity();
        return;
      }
      else if (choices.length > setChoix.size) {
        document.getElementById("editA").setCustomValidity("Options must be distinct");
        document.getElementById("editA").reportValidity();
        return;
      }
      else if (!choices.includes(editQuestion['answer'])) {
        document.getElementById("editAnswer").setCustomValidity("Answer must be one of the options");
        document.getElementById("editAnswer").reportValidity();
        return;
      }
    }

    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "edit",
        data: `${JSON.stringify(editQuestion)}`
      })
    }).then(data => data.text()).then(text => console.log(text));

    // Update view of table
    $('#editQmodal').modal('toggle');
    qBank[qNum] = editQuestion;
    doSort();
    makeTable();
  }
};


// DELETE QUESTIONS    ///////////////////////////////////////////////////////////////////////////////////////////////

const to_del = [];

function delBtns(e) {
  e = e || window.event;
  var qid = e.childNodes[1].value;
  e.parentNode.innerHTML += `
  <div class="modal fade" id="confirmDelQ" tabindex="-1" role="dialog" aria-labelledby="confirmDelQTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmDelQTitle">Delete question?</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <strong>This action cannot be undone.</strong>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button id="delOne" class="btn btn-danger" value="${qid}">Yes, delete</button>
        </div> 
      </div>
    </div>
  </div>
  `;

  document.getElementById("delOne").onclick = function (e) {
    e = e || window.event;
    qid = e.target.value;
    console.log("deleting", qid)
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "delete",
        data: `${qid}`
      })
    }).then(data => data.text()).then(text => console.log(text));
    $(`#confirmDelQ`).modal('toggle');
    rowID = "row" + qid;
    document.getElementById(rowID).remove();
  }
}

function multiDel(e) {
  e = e || window.event;
  var multiTrash = document.getElementById("multi-trash");
  var qidDel = e.getAttribute("name").substring(3)
  console.log(qidDel)
  if (e.checked) {
    to_del.push(qidDel)
  }
  else {
    const index = to_del.indexOf(qidDel);
    if (index > -1) {
      to_del.splice(index, 1);
    }
  }
  console.log(to_del);
  if (to_del.length === 1) {
    multiTrash.style.display = "block";
  }
  else if (to_del.length === 0) {
    multiTrash.style.display = "none";
  }
}


// TABLE STRUCTURE   /////////////////////////////////////////////////////////////////////////////////////////

// Default sort (newest at the top)
var sorted = "Date Added";

// Sort qBank //
function compareObjects(object1, object2, key) {
  const obj1 = object1[key].toUpperCase();
  const obj2 = object2[key].toUpperCase();

  if (obj1 < obj2) {
    return -1
  }
  if (obj1 > obj2) {
    return 1
  }
  return 0
}

function compareObjTimes(a, b) {
  return b.id - a.id
}

function doSort() {
  qBank.sort((row1, row2) => {
    if (sorted === "Question") {
      return compareObjects(row1, row2, 'question')
    }
    else if (sorted === "Type") {
      return compareObjects(row1, row2, 'question_type')
    }
    else if (sorted === "Date Added") {
      return compareObjTimes(row1, row2)
    }
  })
}

// Check how to sort 
function checkSort(sortVal) {
  if (sorted === sortVal) {
    qBank.reverse();
  }
  else {
    sorted = sortVal;
    doSort();
  }
  makeTable();
}

// Add rows in question bank table //
function makeTable() {
  var to_table_html = "";
  for (var q = 0; q < qBank.length; q++) {
    to_table_html += `
    <tr id="row${qBank[q]["id"]}">
      <td>${qBank[q]["question_type"]}</td>
      <td>${qBank[q]["question"]}</td>
      <td>${qBank[q]["answer"]}</td>
      <td>${qBank[q]["hint"]}</td>
      <td>${qBank[q]["a"]}</td>
      <td>${qBank[q]["b"]}</td>
      <td>${qBank[q]["c"]}</td>
      <td>${qBank[q]["d"]}</td>
      <td><button type="button" class="btn btn-warning editQ" id="edit${qBank[q]["id"]}" value="${q}" onclick="editQs(this)" data-toggle="modal" data-target="#editQmodal">EDIT</button></td>
      <td>
          <i class="del-question fa fa-trash fa-2x" data-toggle="modal" data-target="#confirmDelQ" onclick="delBtns(this)">
              <button class="del-btn" value=${qBank[q]["id"]}></button>
          </i>
      </td>
      <td><div class="form-check multi-del"><input class="form-check-input multi-sel-check" type="checkbox" name="sel${qBank[q]["id"]}" onclick="multiDel(this)"></div></td>
    </tr>
    `;
  }
  document.getElementById("qBankBody").innerHTML = to_table_html;
};

document.addEventListener('DOMContentLoaded', function () {

  // Make table for the first time
  makeTable();

  // Make currently visited page into set modes //
  var storedTheme = sessionStorage.getItem('theme') || curTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  // ^ Line Above ^ ------- SOURCE: https://lukelowrey.com/css-variable-theme-switcher/
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme)
    sessionStorage.setItem('theme', storedTheme);

    // Move sphere to indicate saved mode is dark
    if (storedTheme == "dark") {
      document.querySelectorAll('.ball')[0].style.transform = 'translateX(24px)';
    }
  }

  var storedHint = sessionStorage.getItem('hint-mode') || curHint;
  if (storedHint === "no-hint") {
    document.querySelectorAll('.ball')[1].style.transform = 'translateX(24px)';
  }

  // SWITCH MODES /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Switch mode - theme //
  document.getElementById("bg-mode").onclick = function () {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";

    // Move the white sphere button to show mode has been changed
    if (currentTheme === "light") {
      targetTheme = "dark";
      document.querySelectorAll('.ball')[0].style.transform = 'translateX(24px)';
    }
    else {
      document.querySelectorAll('.ball')[0].style.transform = 'translateX(0px)';
    }

    document.documentElement.setAttribute('data-theme', targetTheme)
    sessionStorage.setItem('theme', targetTheme);
  };


  // Switch mode - hints //
  const chk = document.getElementById('chk');

  // Move the white sphere button to show mode has been changed
  chk.addEventListener('change', () => {
    if (chk.checked === true) {
      document.querySelectorAll('.ball')[1].style.transform = 'translateX(24px)';
      sessionStorage.setItem('hint-mode', "no-hint");
    }
    else {
      console.log("hint back!")
      document.querySelectorAll('.ball')[1].style.transform = 'translateX(0px)';
      sessionStorage.setItem('hint-mode', "yes-hint");
    }
  });

  // Save current modes as values in a form within logout btn to be saved in user database //
  var logoutBtn = document.getElementById("logout");
  logoutBtn.onclick = function () {
    to_value = sessionStorage.getItem('theme') + " " + sessionStorage.getItem('hint-mode');
    logoutBtn.value = to_value;
    sessionStorage.clear();
  };


  document.getElementById("newUser").onclick = function () {
    var newUser = document.getElementById("new-username").value;
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "newUsername",
            data: `${newUser}`
        })
    }).then(data => data.text()).then(text => {
      console.log(text);
      if (text === "existing") {
        document.getElementById("new-username").setCustomValidity("Username has already been taken");
        document.getElementById("new-username").reportValidity();
        return;
      }
    });
  };
  document.getElementById("new-username").onkeyup = function (e) {
    hitEnter(e, "newUser");
  }
  
  document.getElementById("newPass").onclick = function () {
    var password = document.getElementById("new-password").value;
    var confirmation = document.getElementById("new-confirmation").value;
    if (password === confirmation) {
      fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "newPassword",
            data: `${password}`
        })
      }).then(data => data.text()).then(text => console.log(text));
      document.getElementById("new-password").value = "";
      document.getElementById("new-confirmation").value = "";
      $("#fading-text-pw").fadeIn('fast').delay(1500).fadeOut('fast');
    }
    else {
      document.getElementById("new-confirmation").setCustomValidity("Passwords are not the same");
      document.getElementById("new-confirmation").reportValidity();
      return;
    }
  };  
  document.getElementById("new-password").onkeyup = function (e) {
    hitEnter(e, "newPass");
  }
  document.getElementById("new-confirmation").onkeyup = function (e) {
    hitEnter(e, "newPass");
  }

  // Simulate form validation
  document.getElementById("confirmAdd").onclick = function () {
    if (addQuestion['question_type'] == "") {
      document.getElementById("question_type").setCustomValidity("Choose a type");
      document.getElementById("question_type").reportValidity();
      return;
    }
    else if (addQuestion['question'] == "") {
      document.getElementById("addQinput").setCustomValidity("Please enter a question");
      document.getElementById("addQinput").reportValidity();
      return;
    }
    else if (addQuestion['answer'] == '') {
      document.getElementById("addAnswer").setCustomValidity("Please enter an answer");
      document.getElementById("addAnswer").reportValidity();
      return;
    }
    else if (addQuestion['question_type'] === "Multiple Choice" || addQuestion['question_type'] === "Dropdown") {
      const choices = [addQuestion['a'], addQuestion['b'], addQuestion['c'], addQuestion['d']];
      const setChoix = new Set(choices);
      if (addQuestion['a'] == "") {
        document.getElementById("addA").reportValidity();
        return;
      }
      else if (addQuestion['b'] == "") {
        document.getElementById("addB").reportValidity();
        return;
      }
      else if (addQuestion['c'] == "") {
        document.getElementById("addC").reportValidity();
        return;
      }
      else if (addQuestion['d'] == "") {
        document.getElementById("addD").reportValidity();
        return;
      }
      else if (choices.length > setChoix.size) {
        document.getElementById("addA").setCustomValidity("Options must be distinct");
        document.getElementById("addA").reportValidity();
        return;
      }
      else if (!choices.includes(addQuestion['answer'])) {
        document.getElementById("addAnswer").setCustomValidity("Answer must be one of the options");
        document.getElementById("addAnswer").reportValidity();
        return;
      }
    }

    // Send question to Flask to be added in database
    addQuestion['id'] = qBank.length + 3;
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "add",
        data: `${JSON.stringify(addQuestion)}`
      })
    }).then(data => data.text()).then(text => console.log(text));

    // Update view of question bank table
    qBank.push(addQuestion)
    doSort();
    makeTable();

    // Clear addQuestion obj and add questions form
    addQuestion = { 'question_type': "", "question": "", "answer": "", "hint": "", "a": "", "b": "", "c": "", "d": "" };
    document.getElementById("question_type").innerHTML = `
      <option disabled selected value="">Choose a question type:</option>
      <option class="dropdown" value="True and False">True and False</option>
      <option class="dropdown" value="Fill In The Blank">Fill In The Blank</option>
      <option class="dropdown" value="Multiple Choice">Multiple Choice</option>
      <option class="dropdown" value="Dropdown">Dropdown</option>
    `;
    document.getElementById("addQinput").value = "";
    document.getElementById("dependent").innerHTML = "";

    // Show user confirmation 
    confirmAddText();
  }

  document.getElementById("question_type").onclick = function (e) {
    e = e || window.event;
    if (e.target.value.length > 0) {
      addingQType(e);
    }
    else {
      console.log("no type chosen!!")
    }
  };


  // Delete questions /////////////////////////////////////////////////////////////////////////////////////////////////////

  document.getElementById("mulTrashing").onclick = function () {
    // Send array of question IDs to Flask
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "delete",
        data: `${to_del}`
      })
    }).then(data => data.text()).then(text => console.log(text));

    // Delete rows from question bank table in view
    for (var k = 0; k < to_del.length; k++) {
      rowID = "row" + to_del[k]
      document.getElementById(rowID).remove();
    }
    to_del.length = 0;
    $('#confirmDelQs').modal('toggle');
    $('#multi-trash').fadeOut('fast');
  }


  // Sort question bank table /////////////////////////////////////////////////////////////////////////////////////////////////////
  document.getElementById("sorting").addEventListener("click", () => {
    document.getElementById("sorting").addEventListener("click", (e) => {
      e = e || window.event;
      var sortVal = e.target.value;
      console.log(sorted, "to", sortVal);
      checkSort(sortVal)
    })
  });

  document.getElementById("sortByType").onclick = function () {
    checkSort("Type")
  };

  document.getElementById("sortByQuestion").onclick = function () {
    checkSort("Question")
  };

  document.getElementById("qbank-btn").onclick = function () {
    if (document.getElementById("toggleCollapse2").classList.contains("show")) {
      document.getElementById("qbank-btn").innerHTML = "View Current";
    }
    else {
      document.getElementById("qbank-btn").innerHTML = "Collapse Current";
    }
  }

});