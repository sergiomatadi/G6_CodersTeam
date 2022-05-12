const logUser = () => {
  let boton = document.getElementById("loginButton");
  boton.addEventListener("click", checkUser, false);
};

const checkUser = () => {
  const url = "http://localhost:3001/api/users/login/";

  const dataToSend = {
    email: document.getElementById("inputEmailLogin").value,
    password: document.getElementById("inputPasswordLogin").value,
  };

  enviar(dataToSend, url);

  //Metodo antiguo para hacer login usando fetch 
  /*const response = await fetch(url, {
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
  }*/
};

//Metodo para hacer login usando AJAX
function enviar(datos, url) { 
  const jsonData = JSON.stringify(datos);
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = () => {
    
    if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE = 4
      if (xmlhttp.status == 200) {
        // Guardamos en localStorage el user conectado
        const { data } = JSON.parse(xmlhttp.response);
        localStorage.setItem("sesionUser", JSON.stringify(data));
        
        // Login OK redirigimos al user a las salas
        window.location.href = "/avatar";
      }
      else if (xmlhttp.status == 400) {
        alert("Usuario o contraseña incorrecta!");
      }
      else {
        alert('something else other than 200 was returned');
      }
    }
  };
  
  xmlhttp.open("POST", url, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(jsonData);
  
}

window.addEventListener("load", logUser, false);
