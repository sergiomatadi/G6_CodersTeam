const loggedUser = [];

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

  const { content, statusCode } = await response.json();

  // Depende del statusCode sabemos si ha ido bien el inicio de sesión o no
  if (statusCode === 200 && content) {
    loggedUser.push(content);

    // Guardamos en localStorage el user conectado
    localStorage.setItem("sesionUser", JSON.stringify(content));

    // Login OK redirigimos al user a las salas
    window.location.href = "avatar.html";
    //llamada al método
    // avatarElegido();
  } else {
    // Login FAIL deberiamos mostrar un mensaje al user diciendo' usuario o pass incorrecto'
    console.log("login fail", statusCode);
  }
};

//Método para guardar en localStorage el avatar elegido en el login.
//#Hace falta unirlo con el backend
// function avatarElegido() {
//   getElementById(avatar);
//   if (login.avatar("avatar1")) {
//     avatarElegido = "https://img.myloview.de/fototapeten/monster.jpg";
//   } else if (login.avatar("avatar2")) {
//     avatarElegido = "../img/ninja.png";
//   } else if (login.avatar("avatar3")) {
//     avatarElegido = "../img/pirata.png";
//   } else if (login.avatar("avatar4")) {
//     avatarElegido = "../img/pinguino.png";
//   } else {
//     avatarElegido = "https://img.myloview.de/fototapeten/monster.jpg";
//   }
// }

window.addEventListener("load", logUser, false);
