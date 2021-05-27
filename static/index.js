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
    sessionStorage.clear(); // del this line if clears session in app.py too
  };


  // Add questions to user database //
  var qTypes = document.querySelectorAll(".dropdown");

  function addingQType(e) {
    var type = e.target.value;
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
    to_html += `<button class="btn btn-primary info add" type="submit" name="submit" value="add !">Add</button>`
    document.getElementById("dependent").innerHTML = to_html;
  };

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
  // var to_del = "";

  var delBtns = document.querySelectorAll(".del-question");

  for (var j = 0; j < delBtns.length; j++) {
    delBtns[j].addEventListener("click", (e) => {
      console.log(e.target.childNodes)
      var qid = e.target.childNodes[1].value;
      console.log(qid, e.target.innerHTML)
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
              <form action="/" method="post">
                <button class="btn btn-danger" value="remove ${qid}" name="submit" type="submit">Yes, delete</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      `;
      // to_del += e.target.childNodes[0].value + ",";
      // tbody = e.target.parentNode.parentNode.parentNode;
      // tr = e.target.parentNode.parentNode;
      // tbody.removeChild(tr);
    })
  }
});