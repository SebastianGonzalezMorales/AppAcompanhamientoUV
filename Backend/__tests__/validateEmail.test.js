/**
 * tests/validateEmail.test.js
 * Pruebas unitarias de validateEmail – backend
 */

require('dotenv').config({ path: '.env.development' });   // ← ¡IMPORTANTE!

const path = require('path');
const { validateEmail } = require('../controllers/users/password');

describe('validateEmail – solo acepta correos institucionales UV', () => {
  test('sebastian.gonzalez@estudiantes.uv.cl es aceptado', () => {
    expect(validateEmail('sebastian.gonzalez@estudiantes.uv.cl')).toBe(true);
  });

  test.each([
    ['sebastian.gonzalez@@estudiantes.uv.cl', 'dos @'],
    ['sebastian.gonzalez@uv.cl',              'dominio no autorizado'],
    ['sebastian!gonzalez@estudiantes.uv.cl',  'carácter “!” no permitido'],
    ['',                                      'cadena vacía'],
  ])('"%s" (%s) es rechazado', (correo) => {
    expect(validateEmail(correo)).toBe(false);
  });
});
