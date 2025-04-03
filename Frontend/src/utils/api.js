import axios from 'axios';
import { API_URL } from '@env';

// Instancia global de axios con timeout de 5 segundos
const api = axios.create({
  timeout: 5000, // Aplica el timeout a todas las peticiones
});

export default api;
