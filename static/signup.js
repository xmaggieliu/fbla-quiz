document.getElementById("sign-up-btn").onclick = function () {
  var makeUser = document.getElementById("username").value;
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
    if (text === "blank") {
      document.getElementById("username").reportValidity();
      return;
    }
    else if (text === "existing") {
      console.log("username exists already")
      document.getElementById("username").setCustomValidity("Username has already been taken");
      document.getElementById("username").reportValidity();
      return;
    }
    console.log("username is available")
    var password = document.getElementById("password").value;
    var confirmation = document.getElementById("confirmation").value;
    fetch("/signup", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          action: "account",
          userName: `${makeUser}`,
          passWord: `${password}`,
          confirmationPW: `${confirmation}`
      })
    }).then(data => data.text()).then(text => {
      console.log(text); 
      if (text === "noPassword") {
        document.getElementById("password").reportValidity();
        return;
      }
      else if (text === "noConfirmation") {
        document.getElementById("confirmation").reportValidity();
        return;
      }
      else if (text === "blank") {
        document.getElementById("password").value = "";
        document.getElementById("confirmation").value = "";
        document.getElementById("password").setCustomValidity("Password cannot contain spaces");
        document.getElementById("password").reportValidity();
        return;
      }
      else if (text === "differentPw"){
        console.log("passwords are different")
        document.getElementById("password").value = "";
        document.getElementById("confirmation").value = "";
        document.getElementById("confirmation").setCustomValidity("Passwords are not the same");
        document.getElementById("confirmation").reportValidity();
        return;
      }
      window.location.href = "/";
    });
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