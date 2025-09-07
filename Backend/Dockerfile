# Usa la imagen oficial de Node.js v22.17.0
FROM node:22.17.0-alpine3.22

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de tu proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install

COPY . .

# Comando para iniciar tu aplicación
CMD ["npm", "start"]