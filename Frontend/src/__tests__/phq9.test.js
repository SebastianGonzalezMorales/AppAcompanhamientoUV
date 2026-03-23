// __tests__/phq9.test.js
import { getSeverity } from '../utils/phq9';

describe('getSeverity (PHQ-9)', () => {
  it.each([
    [0,  'Normal'],
    [4,  'Normal'],
    [5,  'Leve'],
    [9,  'Leve'],
    [10, 'Moderado'],
    [14, 'Moderado'],
    [15, 'Moderadamente grave'],
    [19, 'Moderadamente grave'],
    [20, 'Grave'],
    [27, 'Grave'],
  ])('para score %i devuelve %s', (score, expected) => {
    expect(getSeverity(score)).toBe(expected);
  });
});
