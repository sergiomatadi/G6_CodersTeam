function obtenerDatos() {
  //Espero a que el usuario clicke el boton para arrancar la funcion guardarDatos.
  let boton = document.getElementById("botonregistro");
  // boton.addEventListener("click", guardarDatos, false);
}

async function guardarDatos() {
  const url = "http://localhost:3001/api/users/";

  //Guardo los datos del usuario en el localStorage.
  let email = document.getElementById("inputEmail3").value;
  let name = document.getElementById("Username").value;
  let password = document.getElementById("inputPassword3").value;

  // Info que se envia al back
  const dataToSend = {
    name,
    email,
    password,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
  });

  const { ok, error } = await response.json();

  if (ok) {
    window.location.href = "/login";
  } else {
    // Registro FAIL deberiamos mostrar un mensaje al user diciendo 'Ha ocurrido un error al registrarse' o algo asi
    console.error("Registro fail", error);
  }
}

window.addEventListener("load", obtenerDatos, false);
