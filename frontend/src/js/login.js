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

  const { ok, data, error } = await response.json();

  // Depende del statusCode sabemos si ha ido bien el inicio de sesión o no
  if (ok) {
    // Guardamos en localStorage el user conectado
    localStorage.setItem("sesionUser", JSON.stringify(data));

    // Login OK redirigimos al user a las salas
    window.location.href = "/avatar";
  } else {
    alert("Usuario o contraseña incorrecta!");
    console.error("login fail", error);
  }
};

window.addEventListener("load", logUser, false);
