document.getElementById("log-in-btn").onclick = function () {
    var usrName = document.getElementById("login-username").value;
    var usrPassword = document.getElementById("login-password").value;
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userName: `${usrName}`,
            passWord: `${usrPassword}`
        })
    }).then(data => data.text()).then(text => {
        if (text === "DNE") {
            console.log("smt wrong")
            document.getElementById("login-password").setCustomValidity("Incorrect username or password");
            document.getElementById("login-password").reportValidity();
            return;
        }
        else {
            window.location.href = "/";
        }
    });
}


function hitEnter(e) {
    if (e.code === 'Enter') {
      document.getElementById("log-in-btn").click();
    }
}

document.getElementById("login-username").onkeyup = function (e) {
    hitEnter(e);
}

document.getElementById("login-password").onkeyup = function (e) {
    hitEnter(e);
}
