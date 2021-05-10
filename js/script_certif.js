//
// DECLARATION CONSTANTES
//
const appears_text_cert1 = document.getElementById("appears_text_cert1");
const appears_text_cert2 = document.getElementById("appears_text_cert2");

//
// EXECUTION EVENTS
//
appears_text_cert1.addEventListener("mouseover", appears_text);
appears_text_cert1.addEventListener("mouseout", desappears_text);

appears_text_cert2.addEventListener("mouseover", appears_text);
appears_text_cert2.addEventListener("mouseout", desappears_text);

//
// FUNCTIONS
//
function appears_text() {
    this.style.opacity = "75%";
    this.style.transition = "1s";
}

function desappears_text() {
    this.style.opacity = "100%";
    this.style.transition = "1s";
}
