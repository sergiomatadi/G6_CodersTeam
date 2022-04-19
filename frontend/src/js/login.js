const loggedUser = [];

const logUser = () => {
  let boton = document.getElementById("loginButton");
  boton.addEventListener("click", checkUser, false);
};

const checkUser = async () => {
  const url = "http://localhost:3001/users/login/";

  const dataToSend = {
    email: document.getElementById("inputEmailLogin").value,
    password: document.getElementById("inputPasswordLogin").value,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
  });

  const { ok, data } = await response.json();

  // Depende del statusCode sabemos si ha ido bien el inicio de sesión o no
  if (ok) {
    loggedUser.push(data);

    // Guardamos en localStorage el user conectado
    localStorage.setItem("sesionUser", JSON.stringify(data));

    
    // Login OK redirigimos al user a las salas
    window.location.href = "/avatar";
  } else {
    alert("Usuario o contraseña incorrecta!");
    // Login FAIL deberiamos mostrar un mensaje al user diciendo' usuario o pass incorrecto'
    console.log("login fail", statusCode);
  }
};

window.addEventListener("load", logUser, false);
