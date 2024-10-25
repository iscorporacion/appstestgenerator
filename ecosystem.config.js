module.exports = {
	apps: [
		{
			name: "APPTESTGENERATOR", // Nombre de la app, puedes ponerle el que quieras
			script: "./dist/src/index.js", // El script que corre tu servidor Next.js
			autorestart: true,
			exec_mode: "cluster",
			env: {
				NODE_ENV: "production", // Define las variables de entorno
			},
		},
	],
};