// --- Comentarios ---
window.onload = function() {
  const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentariosGuardados.forEach(c => mostrarComentario(c));
}
let pass = prompt("Introduce la contraseña para acceder al blog:");
const passwordCorrecta = "1015";

if (pass !== passwordCorrecta) {
    document.body.innerHTML = "<h1>Acceso denegado ❌</h1>";
} else {
    // Solo si la contraseña es correcta, carga los comentarios guardados
    window.onload = function() {
        const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentariosGuardados.forEach(c => mostrarComentario(c));
    }
}

// Vista previa de imagen
document.getElementById('imagen').addEventListener('change', function() {
  const preview = document.getElementById('preview');
  if(this.files && this.files[0]){
    const reader = new FileReader();
    reader.onload = function(e){
      preview.src = e.target.result;
      preview.style.display = "block";
    }
    reader.readAsDataURL(this.files[0]);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
});

function agregarComentario() {
  const nombre = document.getElementById('nombre').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const imagenInput = document.getElementById('imagen');

  if(nombre.length < 3){
    alert("El nombre debe tener al menos 3 caracteres.");
    return;
  }
  if(mensaje.length > 200){
    alert("El mensaje no puede superar 200 caracteres.");
    return;
  }

  const fecha = new Date().toLocaleString();
  let imagenData = null;

  if(imagenInput.files && imagenInput.files[0]){
    const reader = new FileReader();
    reader.onload = function(e){
      imagenData = e.target.result;
      guardarYMostrar({nombre, mensaje, fecha, imagenData, likes:0});
    }
    reader.readAsDataURL(imagenInput.files[0]);
  } else {
    guardarYMostrar({nombre, mensaje, fecha, imagenData:null, likes:0});
  }

  document.getElementById('nombre').value = '';
  document.getElementById('mensaje').value = '';
  document.getElementById('imagen').value = '';
  document.getElementById('preview').style.display = 'none';
}

function guardarYMostrar(comentario){
  const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentariosGuardados.push(comentario);
  localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
  mostrarComentario(comentario, comentariosGuardados.length-1);
}

function mostrarComentario({nombre, mensaje, fecha, imagenData, likes}, index){
  const comentariosDiv = document.getElementById('comentarios');
  const div = document.createElement('div');
  div.classList.add('comment');

  div.innerHTML = `
    <strong>${nombre}</strong>
    <p>${mensaje}</p>
    <small>${fecha}</small>
    ${imagenData ? `<img src="${imagenData}" />` : ''}
    <div class="acciones">
      <button class="like-btn">👍 <span>${likes}</span></button>
      <button class="delete-btn">🗑️ Borrar</button>
    </div>
  `;

  // Me gusta
  div.querySelector('.like-btn').addEventListener('click', ()=>{
    likes++;
    div.querySelector('.like-btn span').textContent = likes;
    const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios'));
    comentariosGuardados[index].likes = likes;
    localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
  });

  // Borrar comentario
  div.querySelector('.delete-btn').addEventListener('click', ()=>{
    if(confirm("¿Seguro que deseas borrar este comentario?")){
      const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios'));
      comentariosGuardados.splice(index,1);
      localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
      comentariosDiv.innerHTML = '<h3>Comentarios</h3>';
      comentariosGuardados.forEach((c,i)=>mostrarComentario(c,i));
    }
  });

  comentariosDiv.appendChild(div);
}

function borrarComentarios(){
  if(confirm("¿Seguro que deseas borrar todos los comentarios?")){
    localStorage.removeItem('comentarios');
    document.getElementById('comentarios').innerHTML = '<h3>Comentarios</h3>';
  }
}
