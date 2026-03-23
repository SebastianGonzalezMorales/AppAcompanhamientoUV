/**
 * tests/isStrongPassword.test.js
 * Pruebas unitarias de la función isStrongPassword usando Jest.
 */

require('dotenv').config({ path: '.env.development' });
const { isStrongPassword } = require('../controllers/users/auth');

describe('isStrongPassword – solo permite contraseñas fuertes', () => {

  // ✔ Caso positivo con descripción explícita
  test('contraseña "Abcd123!" es aceptada (cumple todos los requisitos)', () => {
    expect(isStrongPassword('Abcd123!')).toBe(true);
  });

  // ❌ Casos negativos con descripciones detalladas
  test.each([
    ['abc123!',  'es rechazada por falta de mayúscula'],
    ['ABC123!',  'es rechazada por falta de minúscula'],
    ['Abcdefg!', 'es rechazada por falta de dígito'],
    ['Abcd1234', 'es rechazada por falta de símbolo especial'],
    ['Ab1!',     'es rechazada por tener menos de 8 caracteres'],
  ])('contraseña "%s" %s', (password, descripcion) => {
    expect(isStrongPassword(password)).toBe(false);
  });
});
