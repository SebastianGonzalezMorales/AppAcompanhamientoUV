import axios from 'axios';

// Instancia global de axios con timeout de 5 segundos
const api = axios.create({
  timeout: 10000, // Aplica el timeout a todas las peticiones
});

export default api;
