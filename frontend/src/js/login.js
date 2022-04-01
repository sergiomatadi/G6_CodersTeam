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
    window.location.href = "avatar.html";
    //llamada al método
    // avatarElegido();
  } else {
    // Login FAIL deberiamos mostrar un mensaje al user diciendo' usuario o pass incorrecto'
    console.log("login fail", status);
  }
};

//Método para guardar en localStorage el avatar elegido en el login.
//#Hace falta unirlo con el backend
// function avatarElegido() {
//   getElementById(avatar);
//   if (login.avatar("avatar1")) {
//     avatarElegido = "https://img.myloview.de/fototapeten/funny-cartoon-monster-face-vector-halloween-monster-square-avatar-700-176103253.jpg";
//   } else if (login.avatar("avatar2")) {
//     avatarElegido = "../img/ninja-removebg-preview.png";
//   } else if (login.avatar("avatar3")) {
//     avatarElegido = "../img/pirata-removebg-preview.png";
//   } else if (login.avatar("avatar4")) {
//     avatarElegido = "../img/pingu-removebg-preview.png";
//   } else {
//     avatarElegido = "https://img.myloview.de/fototapeten/funny-cartoon-monster-face-vector-halloween-monster-square-avatar-700-176103253.jpg";
//   }
// }

window.addEventListener("load", logUser, false);
