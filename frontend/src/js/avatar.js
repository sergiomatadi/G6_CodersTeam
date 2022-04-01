function elegirAvatar(avatar) {
  sessionStorage.avatarJugador = avatar;
  window.location.href = "salas.html";
}

const headerNameElement = document.getElementById("username");
const sesion = JSON.parse(localStorage.getItem("sesionUser"));

headerNameElement.insertAdjacentHTML(
  "beforeend",
  sesion ? `${sesion.user}!` : "Jugador!"
);
