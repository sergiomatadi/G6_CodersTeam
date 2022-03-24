function obtenerDatos() {

  //Espero a que el usuario clicke el boton para arrancar la funcion guardarDatos.
  let boton = document.getElementById("botonregistro");
  boton.addEventListener("click", guardarDatos, false);
}

function guardarDatos() {

  //Guardo los datos del usuario en el localStorage.
  let email = document.getElementById("inputEmail3").value;
  let user = document.getElementById("Username").value;
  localStorage.setItem(user, email);

  //Obtengo el almacenamiento de localStorage en consola.
  let guardarEmail = localStorage.getItem(email)
  console.log(guardarEmail);
}

window.addEventListener("load", obtenerDatos, false);

