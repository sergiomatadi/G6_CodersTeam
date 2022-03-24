function handleDragStart(e) {
    this.style.opacity = '0.2';
  }
  function allowDrop(ev) {
    debugger;
    ev.preventDefault();
  }
  
  function drag(ev) {
    debugger;
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    debugger;
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }