document.addEventListener('DOMContentLoaded', () => {
  const btnIniciar = document.getElementById('btnIniciarASTECNOR');

  if (btnIniciar) btnIniciar.addEventListener('click', iniciarGestor);

});

function iniciarGestor() {
  const boton = document.getElementById('btnIniciarASTECNOR');
  if (boton.disabled) return;
  boton.disabled = true;
  const card = document.querySelector('.cardGlassASTECNOR');
  card.style.transition = 'opacity 0.3s';
  card.style.opacity = '0';

  setTimeout(() => {
    card.innerHTML = `
      <h1 class="tituloASTECNOR">Gestor PRL</h1>
      <p class="subtituloASTECNOR">Registro de charlas - Antofagasta</p>
      
      <form id="formCharla" style="text-align:left; margin-bottom:15px;">
        <label for="tema">Tema de la charla</label>
        <input id="tema" maxlength="160" placeholder="Tema de la charla" required 
          style="width:100%; padding:10px; margin-bottom:8px; border-radius:8px; border:none; background:rgba(255,255,255,0.1); color:white;">
        
        <label for="rubro">Rubro</label>
        <select id="rubro" required 
          style="width:100%; padding:10px; margin-bottom:8px; border-radius:8px; border:none; background:rgba(255,255,255,0.1); color:white;">
          <option value="">Selecciona rubro</option>
          <option>Minería</option>
          <option>Construcción</option>
          <option>Transporte</option>
          <option>Retail</option>
        </select>
        
        <label for="responsable">Responsable PRL</label>
        <input id="responsable" maxlength="120" placeholder="Responsable PRL" required 
          style="width:100%; padding:10px; margin-bottom:8px; border-radius:8px; border:none; background:rgba(255,255,255,0.1); color:white;">
        
        <label for="fecha">Fecha</label>
        <input id="fecha" type="date" required 
          style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:none; background:rgba(255,255,255,0.1); color:white; color-scheme: dark;">
        
        <button type="submit" class="btnIniciarASTECNOR" style="margin-bottom:0;">Guardar charla</button>
      </form>

      <p id="estadoCharla" role="status" aria-live="polite"></p>
      <div id="listaCharlas" aria-label="Charlas registradas" style="max-height:160px; overflow-y:auto; text-align:left; font-size:0.8rem; margin-bottom:10px;"></div>
      
      <button class="btnIniciarASTECNOR" id="btnVolver" type="button" style="background:rgba(255,255,255,0.15);">Volver</button>
      <div class="footerInfoASTECNOR" style="margin-top:10px;">Ley 16.744 | D.S. 594 | Antofagasta</div>
    `;
    card.style.opacity = '1';

    document.getElementById('formCharla').addEventListener('submit', guardarCharla);
    document.getElementById('btnVolver').addEventListener('click', () => location.reload());
    document.getElementById('fecha').value = fechaLocal();

    mostrarCharlas();
  }, 300);
}

function guardarCharla(e) {
  e.preventDefault();
  
  const charla = {
    id: Date.now(),
    tema: document.getElementById('tema').value.trim(),
    rubro: document.getElementById('rubro').value,
    responsable: document.getElementById('responsable').value.trim(),
    fecha: document.getElementById('fecha').value
  };

  if (!charla.tema || !charla.responsable || !charla.rubro || !charla.fecha) {
    informar('Completa todos los campos con texto válido.'); return;
  }
  let charlas;
  try { charlas = leerCharlas(); }
  catch (error) { informar(error.message); return; }
  charlas.unshift(charla);
  try { localStorage.setItem('charlasASTECNOR', JSON.stringify(charlas)); }
  catch (error) { informar('No se pudo guardar. Revisa el almacenamiento del navegador.'); return; }

  document.getElementById('formCharla').reset();
  document.getElementById('fecha').value = fechaLocal();
  mostrarCharlas();
  informar('Charla guardada correctamente.');
}

function mostrarCharlas() {
  const lista = document.getElementById('listaCharlas');
  let charlas;
  try { charlas = leerCharlas(); }
  catch (error) { informar(error.message); lista.textContent = 'No se pudieron cargar los registros.'; return; }

  if (charlas.length === 0) {
    lista.innerHTML = '<p style="color:#94a3b8; text-align:center;">Sin registros aún</p>';
    return;
  }

  lista.innerHTML = charlas.map(c => `
    <div style="background:rgba(255,255,255,0.08); padding:8px 10px; border-radius:8px; margin-bottom:6px; border-left:3px solid #0077b6;">
      <strong>${escapar(c.tema)}</strong><br>
      <span style="color:#cbd5e1;">${escapar(c.rubro)} • ${escapar(c.fecha)}</span><br>
      <span style="font-size:0.75rem;">${escapar(c.responsable)}</span>
    </div>
  `).join('');
}
function escapar(valor) {
  const elemento = document.createElement('span');
  elemento.textContent = String(valor ?? '');
  return elemento.innerHTML;
}
function leerCharlas() {
  try {
    const datos = JSON.parse(localStorage.getItem('charlasASTECNOR') || '[]');
    if (!Array.isArray(datos) || datos.some(c => !c || ['tema','rubro','fecha','responsable'].some(k => typeof c[k] !== 'string'))) throw new Error();
    return datos;
  } catch (error) {
    throw new Error('Los registros guardados no se pueden leer. Revisa o respalda el almacenamiento antes de continuar.');
  }
}
function fechaLocal() {
  const hoy = new Date();
  return [hoy.getFullYear(), String(hoy.getMonth()+1).padStart(2,'0'), String(hoy.getDate()).padStart(2,'0')].join('-');
}
function informar(mensaje) {
  document.getElementById('estadoCharla').textContent = mensaje;
}
