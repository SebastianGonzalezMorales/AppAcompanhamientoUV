# App Acompañamiento UV

Aplicación móvil y backend orientados al acompañamiento y bienestar estudiantil. El proyecto integra registro de estado de ánimo, frase del día, cuestionarios, notificaciones push y servicios de apoyo universitario.

## Estructura

- `Frontend/`: aplicación móvil construida con Expo y React Native.
- `Backend/`: API REST construida con Node.js, Express y MongoDB.

## Tecnologías principales

- Expo / React Native
- Node.js / Express
- MongoDB Atlas con Mongoose
- AWS Elastic Beanstalk
- Amazon SNS
- Amazon Rekognition

## Ejecución local

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm start
```

## Variables de entorno clave

En backend se utilizan, entre otras:

- `API_URL`
- `CONNECTION_STRING`
- `SECRET`
- `ENCRYPTION_KEY`
- `SIGNING_KEY`
- `AWS_REGION`
- `SNS_PLATFORM_APPLICATION_ARN`

En frontend se utilizan:

- `API_URL`
- `BASE_URL`

## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Registro y consulta de estados de ánimo
- Frase del día
- Notificaciones push con Amazon SNS
- Consulta de asistentes sociales y recursos de apoyo
- Análisis complementario con Amazon Rekognition

## Despliegue

- `Backend/` está preparado para despliegue en AWS Elastic Beanstalk.
- `Frontend/` utiliza Expo y puede generar builds móviles con EAS.
