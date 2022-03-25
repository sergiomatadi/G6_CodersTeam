const logUser = () => {
  let boton = document.getElementById("loginButton");
  boton.addEventListener("click", checkUser, false);
};

const checkUser = async () => {
  const url = "http://localhost:3001/users/login";

  const dataToSend = {
    email: document.getElementById("inputEmailLogin").value,
    password: document.getElementById("inputPasswordLogin").value,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(dataToSend),
  });

  const { status } = response;

  // Depende del statusCode sabemos si ha ido bien el inicio de sesión o no
  if (status === 200) {
    // Login OK redirigimos al user a las salas
    window.location.href = "salas.html";
  } else {
    // Login FAIL deberiamos mostrar un mensaje al user diciendo' usuario o pass incorrecto'
    console.log("login fail", status);
  }
};

window.addEventListener("load", logUser, false);
