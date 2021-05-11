// --------------- source: https://css-tricks.com/snippets/css/typewriter-effect/ ---------------------
var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
  this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
  this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
  delta = this.period;
  this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
  this.isDeleting = false;
  this.loopNum++;
  delta = 500;
  }

  setTimeout(function() {
  that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('typewrite');
  for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #170020}";
  document.body.appendChild(css);
  // -------------------------------------------------- END OF SOURCE
  /////////////////////////////////////////////////////////////////////////////////////////DEL
  // const html = document.getElementsByTagName('html')[0];
  // const toggleTheme = (theme) => {
  //   html.dataset.theme = theme;
  // }

  // document.getElementById("toggle-mode").onclick = function fun() {
  //   toggleTheme();
  // }
  const chk = document.getElementById('chk');

  chk.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    const theme = document.body.classList
    localStorage.setItem('theme', theme);
  });
};

document.addEventListener('DOMContentLoaded', function() {
  const currentTheme = localStorage.getItem('theme');
  if (document.body.classList != currentTheme) {
    document.body.classList.toggle('dark');
  }
});

// Automatic reload of page when accessing history (e.g. alt + left-arrow)
//---------------- SOURCE: https://stackoverflow.com/questions/43043113/how-to-force-reloading-a-page-when-using-browser-back-button ---------------------------------
window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      window.location.reload();
    }
});
//--------------------------------------------------- END OF SOURCE
