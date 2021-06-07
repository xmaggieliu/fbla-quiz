// Make currently visited page into set modes //
// ------ line below ------- SOURCE: https://lukelowrey.com/css-variable-theme-switcher/

var storedTheme = sessionStorage.getItem('theme') || curTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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


document.addEventListener('DOMContentLoaded', function() {
  // Switch mode - theme //
  document.getElementById("bg-mode").onclick = function() {
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
  logoutBtn.onclick = function() {
    to_value = sessionStorage.getItem('theme') + " " + sessionStorage.getItem('hint-mode');
    logoutBtn.value = to_value;
    sessionStorage.clear();
  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var addQuestion = {'type': "", "question": "", "answer": "", "hint": "", "a": "", "b": "", "c": "", "d": ""};

  // Add questions to user database //
  var qTypes = document.querySelectorAll(".dropdown");

  function checkAddQ() {
    console.log("hi");
    if (addQuestion['type'] === "Multiple Choice" || type === "Dropdown") {
      console.log("hello")
    }
  }

  function addingQType(e) {
    var type = e.target.value;
    addQuestion['type'] = type;
    if (type === "Multiple Choice" || type === "Dropdown") {
      var to_html = `
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control" name="answer" placeholder="Answer" type="text" required>
      </div>
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control" name="a" placeholder="Option 1" type="text" required>
      </div>
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control" name="b" placeholder="Option 2" type="text" required>
      </div>
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control" name="c" placeholder="Option 3" type="text" required>
      </div>
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control" name="d" placeholder="Option 4" type="text" required>
      </div>
      `;
    }
    else if (type === "True and False") {
      var to_html = `
        <div class="form-group inline">
          <select name="answer" class="form-control dropdown" required>
            <option disabled selected value="">Answer</option>
            <option class="dropdown" value="TRUE">True</option>
            <option class="dropdown" value="FALSE">False</option>
          </select>
        </div>
          `;
    }
    else if (type === "Fill In The Blank"){
      var to_html = `
      <div class="form-group inline">
          <input autocomplete="off" autofocus class="form-control" name="answer" placeholder="Answer" type="text" required>
      </div>
      <div class="form-group inline">
        <input autocomplete="off" autofocus class="form-control" name="hint" placeholder="Hint" type="text">
      </div>
      `;
    }
    to_html += `<button class="btn btn-primary info" type="button" id="add">Add</button>`
    document.getElementById("dependent").innerHTML = to_html;
  };

  // SOURCE: https://stackoverflow.com/questions/39199082/validate-html-form-when-button-click 
  $('#add').click(function() {
    console.log("add!")
    $("#addQform").valid();
    checkAddQ();
  });
  // END OF SOURCE

  for (var i = 0; i < qTypes.length; i++) {
    qTypes[i].addEventListener("click", (e) => {
      if (e.target.value.length > 0) {
        addingQType(e);
      }
      else {
        console.log("no type chosen!!")
      }
    });
  }

  // Delete questions //
  const to_del = [];

  var delBtns = document.querySelectorAll(".del-question");
  var multiDel = document.querySelectorAll(".multi-sel-check");
  var multiTrash = document.getElementById("multi-trash");

  for (var j = 0; j < delBtns.length; j++) {
    delBtns[j].addEventListener("click", (e) => {
      var qid = e.target.childNodes[1].value;
      e.target.parentNode.innerHTML += `
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

      document.getElementById("delOne").addEventListener("click", (e) => {
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
        document.getElementById(rowID).innerHTML = "";
      })
    })

    multiDel[j].addEventListener("click", (e) => {
      var qidDel = e.target.getAttribute("name").substring(3)
      console.log(qidDel)
      if (e.target.checked) {
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
    })
  }

  document.getElementById("mulTrashing").addEventListener("click", () => {
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
      document.getElementById(rowID).innerHTML = "";
    }
    to_del.length = 0;
    $('#confirmDelQs').modal('toggle');
  })


  // Edit questions //
  var editBtns = document.querySelectorAll(".editQ");

  function editQs(e) {
    qid = e.target.id;
    qid = qid.slice(4, qid.length);
    tdChildren = e.target.parentNode.parentNode.children;
    type = tdChildren[0].innerHTML;

    var to_html = `
      <div class="form-group inline">
        <label>Question:</label>
        <input autocomplete="off" value="${tdChildren[1].innerHTML}" autofocus class="form-control" name="question" placeholder="Question" type="text" required>
      </div>  
      <input class="del-btn" value="${qid}" name="qid">
    `;

    if (type === "Multiple Choice" || type === "Dropdown") {
      to_html += `
        <div class="form-group inline">
          <label>Answer:</label>
          <input autocomplete="off" value="${tdChildren[2].innerHTML}" autofocus class="form-control" name="answer" placeholder="Answer" type="text" required>
        </div>
        <div class="form-group inline">
          <label>Option 1:</label>
          <input autocomplete="off" value="${tdChildren[4].innerHTML}" autofocus class="form-control" name="a" placeholder="Option 1" type="text" required>
        </div>
        <div class="form-group inline">
          <label>Option 2:</label>
          <input autocomplete="off" value="${tdChildren[5].innerHTML}" autofocus class="form-control" name="b" placeholder="Option 2" type="text" required>
        </div>
        <div class="form-group inline">
          <label>Option 3:</label>
          <input autocomplete="off" value="${tdChildren[6].innerHTML}" autofocus class="form-control" name="c" placeholder="Option 3" type="text" required>
        </div>
        <div class="form-group inline">
          <label>Option 4:</label>
          <input autocomplete="off" value="${tdChildren[7].innerHTML}" autofocus class="form-control" name="d" placeholder="Option 4" type="text" required>
        </div>
      `;
    }
    else if (type === "True and False") {
      if (tdChildren[2].value === "TRUE") {
        to_html += `
        <div class="form-group inline">
          <label>Answer:</label>
          <select name="answer" class="form-control dropdown" required>
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
          <select name="answer" class="form-control dropdown" required>
            <option class="dropdown" value="TRUE">True</option>
            <option class="dropdown" selected value="FALSE">False</option>
          </select>
        </div>
          `;
      }
    }
    else if (type === "Fill In The Blank"){
      to_html += `
      <div class="form-group inline">
        <label>Answer:</label>
        <input autocomplete="off" value="${tdChildren[2].innerHTML}" autofocus class="form-control" name="answer" placeholder="Answer" type="text" required>
      </div>
      <div class="form-group inline">
        <label>Hint:</label>
        <input autocomplete="off" value="${tdChildren[3].innerHTML}" autofocus class="form-control" name="hint" placeholder="Hint" type="text">
      </div>
      `;
    }
    document.getElementById("editQdiv").innerHTML = to_html;
  };

  for (var l = 0; l < editBtns.length; l++) {
    editBtns[l].addEventListener("click", (e) => {
      editQs(e);
    })
  }
});