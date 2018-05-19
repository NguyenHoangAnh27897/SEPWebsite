var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].title;
}

var love = document.querySelector('.vl-like__product');
var noLike = document.getElementsByTagName('path[id="no"]');
love.onclick = hasLike;

function hasLike() {
  love.classList.toggle('love');
}

var quantity = document.getElementById('vl-detail-product__info--footer-quantity');
quantity.onchange = checkChange;
quantity.onkeypress = quantity.onpaste = checkInput;

function checkInput(e) {
  var e = e || event;
  var char = e.type == 'keypress'
      ? String.fromCharCode(e.keyCode || e.which)
      : (e.clipboardData || window.clipboardData).getData('Text');
  if (/[^\d]/gi.test(char)) {
      return false;
  }
}

function checkChange() {
  if ((quantity.value == 0) || (quantity.value == null)) {
    quantity.value = 1;
  }
}
