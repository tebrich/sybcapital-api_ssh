// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'sybcapital-api',
      // Arrancamos con npm start (o tu script equivalente)
      script: 'npm',
      args: 'run start',
      // Directorio de trabajo (por defecto se toma esta carpeta)
      cwd: '/root/sybcapital-api',
      // Variables de entorno que necesita la app para firmar/verificar JWT:
      env: {
        NODE_ENV: 'production',
        JWT_SECRET: 'playgardenprep'
      }
    }
  ]
}

