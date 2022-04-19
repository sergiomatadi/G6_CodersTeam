if (!localStorage.getItem("sesionUser")) {
  window.location.href = "/login";
} else {

const sesionUser = JSON.parse(localStorage.getItem("sesionUser"));
const url = "http://localhost:3001/salas/guardar";

document.getElementById("avatar").setAttribute("src", sesionUser.avatar);

function dragstart(e) {
  this.style.opacity = "0.1";
}
function allowDrop(ev) {
  ev.target.style.opacity = "0.4";
  ev.preventDefault();
}

function drag(ev) {
  ev.cursor = "pointer";
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  ev.target.style.display = "block";
  ev.target.style.opacity = "1";
  salaElegida();
}

// Este bloque cambia la opacidad de la sala cuando el avatar abandona la mitad del recuadro de sala.
// Ademas extrae y borra lo que contiene el elemento con id elegida, es decir la sala elegida.
function leave(ev) {
  ev.target.style.opacity = "1";
  let elegida = document.getElementById("elegida");
  elegida.innerHTML = "";
}

// Este bloque mira que en las diferentes casillas de game contenga el avatar, si es asi asigna el numero de la sala.
// Despues lo imprimimos en pantalla.
// TODO: Arreglar bug de guardado sala si sales del recuadro pero vuelves a la misma sala.
// Y emparejar dato de salaJugador en localstorage con el email del usuario que haga login
async function salaElegida() {
  if (game1.contains(avatar)) {
    sala = 1;
  } else if (game2.contains(avatar)) {
    sala = 2;
  } else if (game3.contains(avatar)) {
    sala = 3;
  } else if (game4.contains(avatar)) {
    sala = 4;
  } else {
    sala = "";
  }
  window.location.href = "/juego";

  // Nose si es muy util esta parte, con la redireccion al juego no se ve el numero de sala!
  let elegida = document.getElementById("elegida");
  elegida.insertAdjacentHTML("afterbegin", sala);
  localStorage.salaJugador = sala;
}

const headerNameElement = document.getElementById("username");

headerNameElement.insertAdjacentHTML(
  "beforeend",
  sesionUser.name ? `${sesionUser.name}!` : "Jugador!"
);

const logout = () => {
  localStorage.removeItem("sesionUser");
  window.location.href = "/login";
};

let logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout, false);
}
