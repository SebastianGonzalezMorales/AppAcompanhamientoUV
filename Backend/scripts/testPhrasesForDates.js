// scripts/testPhrasesForDates.js
require('dotenv').config({ path: __dirname + '/../.env.development' });

const mockdate = require('mockdate');
const mongoose = require('mongoose');
const { getRandomPhraseOfTheDay } = require('../controllers/phraseOfTheDay');
const { UserPhrase } = require('../models/userPhrase');

const MONGO_URI = process.env.CONNECTION_STRING;
if (!MONGO_URI) {
  console.error('❌ No se encontró CONNECTION_STRING en el .env');
  process.exit(1);
}
console.log('🔗 Mongo URI:', MONGO_URI);

const TEST_USER_ID = '68894ce504884a8959d2bf29';  // Ajusta a tu userId real
const dates = [
  '2025-07-30','2025-07-31','2025-08-01','2025-08-02',
  '2025-08-03','2025-08-04','2025-08-05','2025-08-06',
  '2025-08-07','2025-08-08','2025-08-09','2025-08-10'
];

function makeRes() {
  return {
    _status: 200,
    _sent: null,
    status(code) { this._status = code; return this; },
    send(payload) { this._sent = payload; return this; },
    json(payload) { return this.send(payload); }
  };
}

async function main() {
  // Conecta forzando el nombre de BD
  await mongoose.connect(MONGO_URI, { dbName: 'my-app' });
  console.log('🔌 Conectado a Mongo, empezamos pruebas:\n');

  // Limpia historial una sola vez
  await UserPhrase.deleteMany({ userId: TEST_USER_ID });

  // Procesa con índice
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    mockdate.set(date);
    process.env.TEST_DATE = date;

    const req = { auth: { userId: TEST_USER_ID } };
    const res = makeRes();

    await getRandomPhraseOfTheDay(req, res);

    const msg = res._sent?.message || '(error)';
    console.log(`${i + 1}.- ${date} → ${msg}`);
  }

  mockdate.reset();
  await mongoose.disconnect();
  console.log('\n🏁 Pruebas completadas. Total de fechas probadas:', dates.length);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
