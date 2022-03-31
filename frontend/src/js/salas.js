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

function leave(ev) {
  ev.target.style.opacity = "1";
  let elegida = document.getElementById("elegida");
  elegida.innerHTML = "";
}

// Este bloque mira que en las diferentes casillas de game contenga el avatar, si es asi asigna el numero de la sala
// Despues lo imprimimos en pantalla.
// TODO: Falta borrado de sala al cambiar de una a otra y utilizar ese dato en el localstorage
function salaElegida() {
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
  let elegida = document.getElementById("elegida");
  elegida.insertAdjacentHTML("afterbegin", sala);
}
