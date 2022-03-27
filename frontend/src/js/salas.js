function dragstart(e) {
    this.style.opacity = '0.1';

  }
  function allowDrop(ev) {
    
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.cursor ="pointer";
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    ev.target.style.display = 'block';
  }