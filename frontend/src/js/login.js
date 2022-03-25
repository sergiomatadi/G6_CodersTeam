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

  if (status === 200) {
    console.log("login ok", status);
    window.location.href = "salas.html";
  } else {
    console.log("login fail", status);
  }
};

window.addEventListener("load", logUser, false);
