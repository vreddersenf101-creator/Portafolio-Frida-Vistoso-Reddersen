(function (root) {
  const key = 'trinkyWallet.v1';
  function read() {
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : { saldo: Number(localStorage.getItem('saldo') || 0), movimientos: [] };
    if (!data || !Number.isSafeInteger(data.saldo) || data.saldo < 0 || !Array.isArray(data.movimientos)) {
      throw new Error('Los datos guardados no son válidos. Respáldalos antes de reiniciar la demo.');
    }
    if (data.movimientos.some(t => !t || !Number.isSafeInteger(t.monto) || ['tipo','descripcion','fecha'].some(k => typeof t[k] !== 'string'))) {
      throw new Error('El historial guardado no es válido.');
    }
    return data;
  }
  function move(amount, tipo, descripcion) {
    const data = read();
    const saldo = data.saldo + amount;
    if (!Number.isSafeInteger(amount) || amount === 0 || !Number.isSafeInteger(saldo) || saldo < 0) {
      throw new Error('Monto inválido o saldo insuficiente. Usa pesos enteros.');
    }
    data.saldo = saldo;
    data.movimientos.unshift({ tipo, descripcion, monto: amount, fecha: new Date().toLocaleString('es-CL') });
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (error) { throw new Error('No se pudo guardar la operación.'); }
    return data;
  }
  function contacts(defaults) {
    const raw = localStorage.getItem('contactos');
    const data = raw ? JSON.parse(raw) : defaults;
    if (!Array.isArray(data) || data.some(c => !c || ['nombre','alias','cbu'].some(k => typeof c[k] !== 'string'))) {
      throw new Error('La agenda guardada no es válida.');
    }
    return data;
  }
  root.Wallet = { read, move, contacts };
  if (typeof window !== 'undefined') window.addEventListener('error', function () {
    let aviso = document.getElementById('storageError');
    if (!aviso) {
      aviso = document.createElement('p'); aviso.id = 'storageError'; aviso.setAttribute('role', 'alert');
      aviso.textContent = 'No se pudo cargar la aplicación. Revisa el almacenamiento y recarga la página.';
      document.body.prepend(aviso);
    }
  });
})(globalThis);
