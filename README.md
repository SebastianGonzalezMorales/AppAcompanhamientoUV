# App Acompañamiento UV

<p align="center">
  <img src="docs/images/app-icon.png" alt="Logo de App Acompañamiento UV" width="220" />
  <img src="docs/images/aws-cloud.png" alt="AWS" width="220" />
</p>

Aplicación móvil y backend orientados al acompañamiento y bienestar emocional estudiantil.

## Contexto del proyecto

Este repositorio corresponde al desarrollo de **App Acompañamiento UV**, proyecto realizado inicialmente como **trabajo de título** en la carrera de **Ingeniería Civil Informática** de la **Universidad de Valparaíso**, con foco en apoyo emocional para estudiantes universitarios.

Posteriormente, el proyecto fue retomado y extendido en el contexto de **AWS re/Start**, incorporando funcionalidades y servicios cloud para despliegue, notificaciones push, análisis complementario de imágenes y monitoreo.

## Estructura

- `Frontend/`: aplicación móvil construida con Expo y React Native.
- `Backend/`: API REST construida con Node.js, Express y MongoDB.

## Tecnologías principales

- Expo / React Native
- Node.js / Express
- MongoDB Atlas con Mongoose
- AWS Elastic Beanstalk
- Amazon SNS
- Firebase Cloud Messaging
- Amazon Rekognition
- Amazon CloudWatch

## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Registro y consulta de estados de ánimo
- Frase del día
- Cuestionarios y recursos de apoyo
- Notificaciones push
- Consulta de asistentes sociales
- Análisis complementario de emociones con Amazon Rekognition

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

## Despliegue

- `Backend/` está preparado para despliegue en AWS Elastic Beanstalk.
- `Frontend/` utiliza Expo y puede generar builds móviles con EAS.
