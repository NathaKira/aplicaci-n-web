# Usa la imagen oficial de Node.js
FROM node:14

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código de la aplicación
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 3000

# Define el comando para correr la aplicación
CMD ["node", "index.js"]
