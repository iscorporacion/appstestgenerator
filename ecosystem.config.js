module.exports = {
  apps: [
    {
      name: "APPTESTGENERATOR",
      script: "./dist/src/index.js",
      interpreter: "node", // Asegúrate de que esté configurado
      autorestart: true,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};