let vidasJugador = 3;
let vidasEnemigo = 3;
let juegoTerminado = false;
let nombreMascotaJugador = '';
let nombreMascotaEnemigo = '';

let jugadorId = null; // Variable global

function iniciarJuego() {
    // Asignar eventos solo una vez
    document.getElementById('boton-mascota').addEventListener('click', seleccionarMascotaJugador);
    document.getElementById('Fuego').addEventListener('click', () => ataqueJugador('FUEGO'));
    document.getElementById('Agua').addEventListener('click', () => ataqueJugador('AGUA'));
    document.getElementById('Tierra').addEventListener('click', () => ataqueJugador('TIERRA'));
}

// Unirse al juego y guardar el jugadorId
function unirseAlJuego() {
    return fetch("http://localhost:3000/unirse")
      .then(res => {
          if (res.ok) return res.text();
          else throw new Error("Error en la respuesta del servidor");
      })
      .then(id => {
          console.log("ID recibido:", id);
          jugadorId = id;
          return id; // Devuelvo el id para posibles encadenamientos
      })
      .catch(error => {
          console.error("Error al unirse al juego:", error);
      });
}

// Seleccionar mascota y enviar al servidor
function seleccionarMascotaJugador() {
    if (!jugadorId) {
        alert("Aún no estás unido al juego. Por favor espera un momento y vuelve a intentarlo.");
        return;
    }

    const inputHipodoge = document.getElementById('Hipodoge');
    const inputCapipepo = document.getElementById('Capipepo');
    const inputRatigueya = document.getElementById('Ratigueya');
    const spanMascotaJugador = document.getElementById('mascota-jugador');
    const imagenJugador = document.getElementById('imagen-jugador');

    let mascotaSeleccionada = '';

    if (inputHipodoge.checked) mascotaSeleccionada = 'Hipodoge';
    else if (inputCapipepo.checked) mascotaSeleccionada = 'Capipepo';
    else if (inputRatigueya.checked) mascotaSeleccionada = 'Ratigueya';
    else {
        alert('Selecciona una mascota antes de continuar');
        return;
    }

    nombreMascotaJugador = mascotaSeleccionada;
    spanMascotaJugador.textContent = nombreMascotaJugador;
    imagenJugador.src = `imagenes/${nombreMascotaJugador.toLowerCase()}.png`;

    // Enviar mokepon al servidor
    fetch(`http://localhost:3000/mokepon/${jugadorId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({mokepon: nombreMascotaJugador})
    });

    seleccionarMascotaEnemigo();
}

function seleccionarMascotaEnemigo() {
    const spanMascotaEnemigo = document.getElementById('mascota-enemigo');
    const imagenEnemigo = document.getElementById('imagen-enemigo');
    const mascotas = ['Hipodoge', 'Capipepo', 'Ratigueya'];
    const aleatorio = Math.floor(Math.random() * mascotas.length);

    nombreMascotaEnemigo = mascotas[aleatorio];
    spanMascotaEnemigo.textContent = nombreMascotaEnemigo;
    imagenEnemigo.src = `imagenes/${nombreMascotaEnemigo.toLowerCase()}.png`;
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function ataqueJugador(ataque) {
    if (juegoTerminado) return;
    const imagenJugador = document.getElementById('imagen-jugador');
    const imagenEnemigo = document.getElementById('imagen-enemigo');

    imagenJugador.classList.add('animar');
    setTimeout(() => imagenJugador.classList.remove('animar'), 300);

    let ataqueEnemigo = ataqueAleatorioEnemigo();

    setTimeout(() => {
        imagenEnemigo.classList.add('animar');
        setTimeout(() => imagenEnemigo.classList.remove('animar'), 300);
    }, 300);

    combate(ataque, ataqueEnemigo);
}

function ataqueAleatorioEnemigo() {
    let numero = aleatorio(1, 3);
    return numero === 1 ? 'FUEGO' : numero === 2 ? 'AGUA' : 'TIERRA';
}

function combate(ataqueJugador, ataqueEnemigo) {
    if (juegoTerminado) return;

    let spanVidasJugador = document.getElementById('vidas-jugador');
    let spanVidasEnemigo = document.getElementById('vidas-enemigo');

    if (ataqueJugador === ataqueEnemigo) {
        crearMensaje("EMPATE", ataqueJugador, ataqueEnemigo);
    } else if (
        (ataqueJugador === 'FUEGO' && ataqueEnemigo === 'TIERRA') ||
        (ataqueJugador === 'AGUA' && ataqueEnemigo === 'FUEGO') ||
        (ataqueJugador === 'TIERRA' && ataqueEnemigo === 'AGUA')
    ) {
        crearMensaje("GANASTE", ataqueJugador, ataqueEnemigo);
        vidasEnemigo = Math.max(vidasEnemigo - 1, 0);
        spanVidasEnemigo.textContent = vidasEnemigo;
    } else {
        crearMensaje("PERDISTE", ataqueJugador, ataqueEnemigo);
        vidasJugador = Math.max(vidasJugador - 1, 0);
        spanVidasJugador.textContent = vidasJugador;
    }

    revisarVidas();
}

function revisarVidas() {
    if (vidasEnemigo === 0) {
        crearMensajeFinal("🎉 Felicitaciones, GANASTE el juego 🎉");
        juegoTerminado = true;
    } else if (vidasJugador === 0) {
        crearMensajeFinal("😞 Lo siento, PERDISTE el juego 😞");
        juegoTerminado = true;
    }
}

function crearMensaje(resultado, ataqueJugador, ataqueEnemigo) {
    const sectionMensajes = document.getElementById('mensajes');
    sectionMensajes.innerHTML = '';

    const parrafo = document.createElement('p');
    parrafo.innerHTML = `${nombreMascotaJugador} atacó con ${ataqueJugador}, ${nombreMascotaEnemigo} atacó con ${ataqueEnemigo} - <strong>${resultado}</strong>`;
    sectionMensajes.appendChild(parrafo);
}

function crearMensajeFinal(resultadoFinal) {
    const sectionMensajes = document.getElementById('mensajes');
    sectionMensajes.innerHTML = '';

    const parrafo = document.createElement('p');
    parrafo.innerHTML = `<strong>${resultadoFinal}</strong>`;
    sectionMensajes.appendChild(parrafo);
}

// Cuando la ventana carga:
window.addEventListener('load', () => {
    // Primero unirse al juego, esperar que se asigne el id y luego iniciar el juego
    unirseAlJuego().then(() => {
        iniciarJuego();
    });
});
