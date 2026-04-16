# Sistema PAE Nutri Check

Explicación paso a paso de ejecución

## Instalación

Instalar Node js en una versión mayor a 20 (LTS recomendable)

Después de tener Node js en tu pc entrar a la carpeta del proyecto y ejecutar los siguientes comandos:

```bash
cd server
npm install
```

se instalarán las dependencias requeridas para la ejecución

## Varaibles de entorno

Para correr correctamente el proyecto se usarán variables de entorno, en la raíz de "server" se crea un archivo llamado `.env` para su ejecución en mysql puede cambiar el USER, PUERTO, CONTRASEÑA, etc según tu configuración, normalmente funciona con los valores que dejaré por defecto

`HOST=localhost`

`PORT=3000`

`DB_HOST=localhost`

`DB_PORT=3306`

`DB_USER=root`

`DB_PASSWORD=''`

`DB_DATABASE=PAE`

`CORS_ORIGIN=http://localhost:3000`

`SECRET_KEY=secret`

`NODE_ENV=development`

## Ejecución en desarrollo

Se ejecutará el siguiente comando y mandará un mensaje del puerto donde se correrá la aplicación

```bash
npm run dev
```
