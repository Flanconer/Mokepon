const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const jugadores = [];

class Jugador {
  constructor(id) {
    this.id = id;
    this.mokepon = null;
  }

  asignarMokepon(mokepon) {
    this.mokepon = mokepon;
  }
}

// GET: Unirse al juego
app.get('/unirse', (req, res) => {
  const id = `${Math.random()}`;
  const jugador = new Jugador(id);
  jugadores.push(jugador);
  console.log('Jugador unido:', jugador);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(id);
});

// POST: Seleccionar mokepon para un jugador específico
app.post("/mokepon/:jugadorId", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const mokepon = req.body.mokepon || "";

  const jugador = jugadores.find(j => j.id === jugadorId);

  if (jugador) {
    jugador.asignarMokepon(mokepon);
    console.log("Jugadores:", jugadores);
    console.log("Jugador actualizado:", jugador);
  } else {
    console.log("Jugador no encontrado");
  }

  res.end();
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
