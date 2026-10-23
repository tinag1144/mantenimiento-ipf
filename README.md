# Mantenimiento IPF

Aplicación desarrollada con React Native, Expo SDK 57, TypeScript y Expo Router.

El objetivo de la aplicación es permitir que alumnos y docentes del Instituto Politécnico Formosa puedan registrar desperfectos dentro del edificio, como problemas de electricidad, agua, mobiliario o equipamiento.

Cada reporte puede incluir aula, fotografía y ubicación. Además, la aplicación permite recibir una notificación cuando un reporte es marcado como resuelto.

## Instalación

Instalar las dependencias:

```bash
npm install
```

Iniciar el proyecto:

```bash
npx expo start
```

El proyecto también fue probado utilizando una Development Build de Android creada con EAS Build.

## Estructura de rutas

```text
src/app/
├── _layout.tsx
│
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── avisos.tsx
│   └── permisos.tsx
│
├── reporte/
│   ├── nuevo.tsx
│   ├── escanear.tsx
│   ├── foto.tsx
│   ├── ubicacion.tsx
│   └── [id].tsx
│
├── permisos/
│   └── [recurso].tsx
│
├── ajustes-app.tsx
└── +not-found.tsx
```

### Rutas principales

- `/`: muestra los reportes creados y permite crear uno nuevo.
- `/reporte/nuevo`: formulario para crear un reporte.
- `/reporte/escanear`: escanea el código QR de un aula.
- `/reporte/foto`: permite sacar una foto o elegir una imagen con el selector del sistema.
- `/reporte/ubicacion`: permite utilizar la ubicación actual o seleccionar un sector manualmente.
- `/reporte/[id]`: muestra el detalle de un reporte y permite simular su resolución.
- `/avisos`: muestra los avisos internos de la aplicación.
- `/permisos`: muestra el estado actual de los permisos.
- `/permisos/[recurso]`: explica para qué se necesita un permiso antes de solicitarlo.
- `/ajustes-app`: permite activar las notificaciones de resolución.

## Permisos utilizados

La aplicación sigue el principio de solicitar los permisos únicamente cuando son necesarios.

| Recurso | Módulo | Cuándo se solicita | Alternativa |
|---|---|---|---|
| Cámara | `expo-camera` | Al utilizar el escáner QR o sacar una fotografía | Escribir el aula manualmente o elegir una imagen existente |
| Ubicación | `expo-location` | Al elegir “Usar mi ubicación actual” | Seleccionar manualmente Patio, Estacionamiento o Pasillo |
| Fotos | `expo-image-picker` | No se solicita permiso general de galería | Se utiliza el selector de imágenes del sistema |
| Notificaciones | `expo-notifications` | Al activar “Avisarme cuando se resuelva mi reporte” | Los avisos permanecen disponibles dentro de `/avisos` |

## Estados de permisos

El hook:

```text
src/hooks/usePermiso.ts
```

centraliza el manejo de los permisos.

Los estados utilizados son:

```text
cargando
concedido
preguntable
bloqueado
```

Además, en ubicación se detecta si el sistema otorgó solamente ubicación aproximada.

Cuando el usuario abre los Ajustes del teléfono y luego regresa a la aplicación, el hook utiliza `AppState` para consultar nuevamente el estado del permiso.

De esta manera el panel de permisos se actualiza sin necesidad de reiniciar la aplicación.

## Cámara y QR

La pantalla:

```text
/reporte/escanear
```

utiliza `CameraView` de `expo-camera`.

El escáner reconoce códigos QR y completa el aula del reporte.

Si la cámara no está disponible o el permiso fue rechazado, el usuario puede escribir manualmente el código del aula.

## Fotografías

En:

```text
/reporte/foto
```

existen dos opciones.

### Sacar foto

Utiliza la cámara del dispositivo.

### Elegir de la galería

Utiliza:

```ts
ImagePicker.launchImageLibraryAsync()
```

para abrir el selector de imágenes del sistema.

La aplicación no solicita `READ_MEDIA_IMAGES`.

## Ubicación

La aplicación solamente solicita ubicación en primer plano.

Se utiliza:

```ts
Location.requestForegroundPermissionsAsync()
```

Si Android o iOS conceden ubicación aproximada, la interfaz muestra:

```text
Ubicación aproximada
```

Como alternativa, siempre es posible seleccionar manualmente uno de los siguientes sectores:

- Patio
- Estacionamiento
- Pasillo

## Notificaciones

Las notificaciones se solicitan únicamente cuando el usuario activa:

```text
Avisarme cuando se resuelva mi reporte
```

En Android se crea previamente el canal:

```text
reportes
```

Cuando se utiliza:

```text
Simular resolución
```

el reporte cambia a estado `resuelto`.

Si las notificaciones están habilitadas, se programa una notificación local para aproximadamente 10 segundos después.

Además, siempre se genera un aviso interno visible en:

```text
/avisos
```

Si el permiso de notificaciones está denegado, la aplicación utiliza esa pantalla como alternativa.

## Configuración de permisos en app.json

Los módulos utilizados están configurados mediante plugins de Expo:

```text
expo-camera
expo-location
expo-image-picker
expo-notifications
```

### Cámara

La aplicación utiliza la cámara solamente para:

- escanear el QR de un aula;
- fotografiar un desperfecto.

No utiliza grabación de audio.

Por ese motivo se configuró:

```json
"microphonePermission": false,
"recordAudioAndroid": false
```

### Ubicación

Solo se utiliza ubicación mientras la aplicación está en uso.

No se utiliza ubicación en segundo plano.

### Permisos bloqueados

En Android se bloquearon permisos que la aplicación no necesita:

```json
"blockedPermissions": [
  "android.permission.RECORD_AUDIO",
  "android.permission.SYSTEM_ALERT_WINDOW"
]
```

`RECORD_AUDIO` se bloquea porque la aplicación no graba audio.

`SYSTEM_ALERT_WINDOW` se bloquea porque Mantenimiento IPF no necesita dibujar contenido sobre otras aplicaciones.

## Development Build

Además de Expo Go, el proyecto fue probado con una Development Build para Android.

Se instaló:

```bash
npx expo install expo-dev-client
```

Luego se configuró EAS:

```bash
npx eas-cli@latest build:configure
```

Y se generó la build con:

```bash
npx eas-cli@latest build --platform android --profile development
```

La Development Build permitió probar correctamente las funcionalidades nativas, especialmente las notificaciones.

## Evidencias

Para la entrega se deben incluir capturas o un video donde se puedan observar las siguientes situaciones:

### Escáner QR

- Cámara sin permiso solicitado.
- Cámara con permiso concedido.
- Cámara bloqueada.
- Alternativa de carga manual.

### Ubicación

- Ubicación concedida.
- Ubicación denegada y selección manual de sector.
- Ubicación aproximada, si el dispositivo permite probarla.

### Fotografías

- Selector de imágenes del sistema.
- Imagen seleccionada dentro del reporte.

### Notificaciones

- Permiso de notificaciones.
- Notificación recibida luego de simular la resolución de un reporte.
- Aviso interno visible en la pestaña Avisos.

### Panel de permisos

- Estado de los permisos antes de modificarlos.
- Cambio de un permiso desde los Ajustes del teléfono.
- Panel actualizado luego de regresar a la aplicación.

### Development Build

Incluir una captura del diálogo real del sistema donde pueda verse el texto de propósito configurado por la aplicación.

## Tecnologías utilizadas

- React Native
- Expo SDK 57
- Expo Router
- TypeScript
- expo-camera
- expo-location
- expo-image-picker
- expo-notifications
- expo-dev-client
- EAS Build