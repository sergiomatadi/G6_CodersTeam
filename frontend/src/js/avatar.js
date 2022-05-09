// Comprobamos que el user esta autenticado
if (!localStorage.getItem("sesionUser")) {
  window.location.href = "/login";
}
const sesion = JSON.parse(localStorage.getItem("sesionUser"));
const URL = "http://localhost:3001/api/users/";

//Metodo elegirAvatar usando metodo async y fetch
/*async function elegirAvatar(avatar) {
  const response = await fetch(`${URL}${sesion.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ avatar }),
  });
  const { ok, error } = await response.json();

  if (ok) {
    // Guardamos en localStorage el avatar elegido
    sesion.avatar = avatar;
    localStorage.setItem("sesionUser", JSON.stringify(sesion));
    window.location.href = "/salas";
  } else {
    console.error("Error al actualizar el avatar del usuario", error);
  }
}*/

// Metodo elegirAvatar en formato AJAX
function elegirAvatar(avatar) {
  const jsonAvatar = JSON.stringify({ avatar });
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        localStorage.setItem("sesionUser", JSON.stringify(sesion.data));
        window.location.href = "/salas";
      } else if (xmlhttp.status == 400) { 
        console.error("Error al actualizar el avatar del usuario", error);
      }
    }
  }
  xmlhttp.open("PUT", `${URL}${sesion.data.id}`, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(jsonAvatar);
};



const logout = async () => {
  localStorage.removeItem("sesionUser");
  window.location.href = "/login";
};

let logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout, false);

const headerNameElement = document.getElementById("username");

headerNameElement.insertAdjacentHTML(
  "beforeend",
  sesion.name ? `${sesion.name}!` : "Jugador!"
);
