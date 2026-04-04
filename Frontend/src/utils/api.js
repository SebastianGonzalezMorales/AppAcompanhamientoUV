import axios from 'axios';

// Instancia global de axios con timeout de 6 segundos
const api = axios.create({
  timeout: 6000, // Aplica el timeout a todas las peticiones
});

export default api;
