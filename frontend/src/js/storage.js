function obtenerEmail() {
  let boton = document.getElementById("botonregistro");
  boton.addEventListener("click", guardarMail, false);
}

function guardarMail() {
  let email = document.getElementById("inputEmail3").value;
  let user = document.getElementById("Username").value;
  localStorage.setItem(user, email);
}

window.addEventListener("load", obtenerEmail, false);
