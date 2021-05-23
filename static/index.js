window.onload = function() {
  // Make currently visited page into set modes
  // ------------------ SOURCE: https://lukelowrey.com/css-variable-theme-switcher/
  var storedTheme = sessionStorage.getItem('theme') || curTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme)
    sessionStorage.setItem('theme', storedTheme);
    if (storedTheme == "dark") {
      document.querySelectorAll('.ball')[0].style.transform = 'translateX(24px)';
    }
  }

  // Switch mode
  document.getElementById("bg-mode").onclick = function() {
    console.log("ChANGGE MAINTENAT")
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
  // -------------------- END OF SOURCE


  var storedHint = sessionStorage.getItem('hint-mode') || curHint;
  if (storedHint === "no-hint") {
    document.querySelectorAll('.ball')[1].style.transform = 'translateX(24px)';
  }

  const chk = document.getElementById('chk');

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
    
  
  var logoutBtn = document.getElementById("logout");
  logoutBtn.onclick = function() {
    to_value = sessionStorage.getItem('theme') + " " + sessionStorage.getItem('hint-mode')
    logoutBtn.value = to_value
    sessionStorage.clear() // del this line if clears session in app.py too
  };
};