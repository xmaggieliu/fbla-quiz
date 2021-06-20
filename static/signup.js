function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

document.getElementById("sign-up-btn").onclick = function () {
  var makeUser = document.getElementById("username").value.trim();
  if (hasWhiteSpace(makeUser)) {
    document.getElementById("username").setCustomValidity("Username cannot contain spaces");
      document.getElementById("username").reportValidity();
      return;
  }
  if (makeUser === "") {
    document.getElementById("username").reportValidity();
    return;
  }
  fetch("/signup", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          action: "username",
          data: `${makeUser}`
      })
  }).then(data => data.text()).then(text => {
    if (text === "existing") {
      console.log("username exists already")
      document.getElementById("username").setCustomValidity("Username has already been taken");
      document.getElementById("username").reportValidity();
      return;
    }
    console.log("username is available")
    var password = document.getElementById("password").value;
    var confirmation = document.getElementById("confirmation").value;
    if (password === "") {
      document.getElementById("password").reportValidity();
    }
    else if (confirmation === "") {
      document.getElementById("confirmation").reportValidity();
    }
    else if (hasWhiteSpace(password)) {
      document.getElementById("password").value = "";
      document.getElementById("confirmation").value = "";
      document.getElementById("password").setCustomValidity("Password cannot contain spaces");
      document.getElementById("password").reportValidity();
      return;
    }
    else if (password === confirmation) {
      console.log("YES")
      fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "account",
            userName: `${makeUser}`,
            passWord: `${password}`
        })
      }).then(data => data.text()).then(text => console.log(text)); window.location.href = "/";}
    else {
      console.log("passwords are different")
      document.getElementById("password").value = "";
      document.getElementById("confirmation").value = "";
      document.getElementById("confirmation").setCustomValidity("Passwords are not the same");
      document.getElementById("confirmation").reportValidity();
      return;
    }
  });
}


function hitEnter(e) {
  if (e.code === 'Enter') {
    document.getElementById("sign-up-btn").click();
  }
}

document.getElementById("username").onkeyup = function (e) {
  hitEnter(e);
}

document.getElementById("password").onkeyup = function (e) {
  hitEnter(e);
}

document.getElementById("confirmation").onkeyup = function (e) {
  hitEnter(e);
}