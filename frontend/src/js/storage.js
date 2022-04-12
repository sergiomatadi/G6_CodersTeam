// import Jugador from "./Jugador"; // --> Esto genera error "Uncaught SyntaxError: import declarations may only appear at top level of a module"

function obtenerDatos() {
  //Espero a que el usuario clicke el boton para arrancar la funcion guardarDatos.
  let boton = document.getElementById("botonregistro");
  boton.addEventListener("click", guardarDatos, false);
}

async function guardarDatos() {
  const url = "http://localhost:3001/users/register";

  //Guardo los datos del usuario en el localStorage.
  let email = document.getElementById("inputEmail3").value;
  let user = document.getElementById("Username").value;
  let password = document.getElementById("inputPassword3").value;

  // Info que se envia al back
  const dataToSend = {
    user,
    email,
    password,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(dataToSend),
  });

  const { content, statusCode } = await response.json();

  const bodyResponse = content;

  if (statusCode === 200) {
    // Registro OK redirigimos al user al Login. O podemos mostrar un mensaje de 'registro success' y poner un boton que redirija al login. SE HABLA!!
    // const player = new Jugador(email, password); --> genera error, ver linea 1
    window.location.href = "/login";
  } else {
    // Registro FAIL deberiamos mostrar un mensaje al user diciendo 'Ha ocurrido un error al registrarse' o algo asi
    console.log("Registro fail", statusCode);
  }

  // Respuesta del server
  console.log("bodyResponse", bodyResponse);

  //Obtengo el almacenamiento de localStorage en consola.
  let guardarEmail = localStorage.getItem(email);
  console.log("localStorage", guardarEmail);
}

window.addEventListener("load", obtenerDatos, false);
