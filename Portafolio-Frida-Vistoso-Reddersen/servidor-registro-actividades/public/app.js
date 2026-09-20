const mensaje = document.getElementById('mensaje');
const tiempo = document.getElementById('tiempo');
const ultimaConsulta = document.getElementById('ultima-consulta');
const botonActualizar = document.getElementById('actualizar');

async function consultarEstado() {
  if (botonActualizar.disabled) return;
  botonActualizar.disabled = true;
  mensaje.textContent = 'Consultando conexión…';
  const controlador = new AbortController();
  const limite = setTimeout(() => controlador.abort(), 8000);
  try {
    const respuesta = await fetch('./status', { signal: controlador.signal, cache: 'no-store' });
    if (!respuesta.ok) throw new Error('Respuesta no disponible');
    const datos = await respuesta.json();
    if (datos.status !== 'ok' || !Number.isFinite(datos.data?.uptimeSeconds) ||
        !Number.isFinite(Date.parse(datos.data?.timestamp))) {
      throw new Error('Respuesta inválida');
    }
    mensaje.textContent = datos.message;
    tiempo.textContent = datos.data.uptimeSeconds;
    ultimaConsulta.textContent = 'Última consulta: ' + new Date(datos.data.timestamp).toLocaleString('es-CL');
  } catch (error) {
    mensaje.textContent = error.name === 'AbortError'
      ? 'El servidor tardó demasiado en responder.'
      : 'No se pudo consultar la conexión.';
    tiempo.textContent = '—';
    ultimaConsulta.textContent = 'Comprueba que el servidor esté iniciado e intenta nuevamente.';
  } finally {
    clearTimeout(limite);
    botonActualizar.disabled = false;
  }
}

botonActualizar.addEventListener('click', consultarEstado);
consultarEstado();
