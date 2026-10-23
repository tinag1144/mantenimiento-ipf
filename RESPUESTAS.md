# Trabajo Práctico N° 3 — Permisos móviles

## Parte A · ¿Qué es un permiso y por qué existe?

### A1. Conceptos

**a)** Un permiso es una autorización que necesita una aplicación para acceder a información o funciones protegidas del dispositivo. La aplicación solicita el acceso, el sistema operativo controla el permiso y muestra el diálogo correspondiente, y la persona usuaria decide si lo concede o no.

**b)** La sandbox es el espacio aislado donde se ejecuta cada aplicación. Una app puede trabajar con sus propios archivos, interfaz y datos internos sin pedir permisos. Para salir de ese espacio y acceder a recursos sensibles como cámara, ubicación, contactos o micrófono necesita autorización.

**c)** Los permisos existen principalmente para:

1. **Privacidad:** evitar que una app acceda a información personal sin autorización. Ejemplo: ubicación.
2. **Seguridad:** impedir que una aplicación use recursos sensibles sin control. Ejemplo: micrófono.
3. **Control del usuario:** permitir que cada persona decida qué datos comparte. Ejemplo: aceptar cámara pero rechazar contactos.
4. **Transparencia y mínimo acceso:** hacer visible qué recurso quiere usar la aplicación y limitarla solamente a lo que necesita. Ejemplo: usar un selector de fotos en vez de leer toda la galería.

**d)** En la analogía del portero, la aplicación es la visita, el sistema operativo es el portero y la persona usuaria es la dueña del departamento. Que el portero recuerde la respuesta significa que el sistema guarda la decisión y no pregunta nuevamente cada vez que la aplicación intenta usar el recurso.

### A2. Declarar y solicitar

| | Declarar, al compilar | Solicitar, al ejecutar |
|---|---|---|
| ¿Qué se hace? | Se indica que la aplicación puede necesitar determinado recurso. | Se consulta al usuario si permite utilizarlo. |
| Android | En `AndroidManifest.xml`. En Expo se configura mediante plugins y `android.permissions`. | Mediante funciones como `request...PermissionsAsync()`. |
| iOS | En `Info.plist`, normalmente con una clave y un texto de propósito. | Mediante la API correspondiente cuando la función se va a utilizar. |
| Expo | En `app.json` o `app.config.ts`, principalmente mediante config plugins. | Con el módulo correspondiente, por ejemplo `expo-camera` o `expo-location`. |
| Si se omite | La build puede no tener autorización para solicitar el recurso, o en iOS incluso puede cerrarse la app si falta un purpose string. | El usuario nunca tiene oportunidad de conceder el permiso y la función protegida no puede utilizarse. |

### A3. Verdadero o falso

**a) Falso.** El diálogo lo muestra el sistema operativo, no los componentes de React Native.

**b) Verdadero.** En un proyecto Expo administrado la configuración principal se hace desde `app.json` o `app.config.ts`. Los archivos nativos se generan a partir de esa configuración.

**c) Falso.** Cambiar permisos nativos necesita una nueva build. Una actualización OTA no puede modificar el `Info.plist`.

**d) Falso.** El permiso debe estar declarado en el manifiesto para que Android pueda concederlo correctamente.

**e) Falso.** `expo-permissions` está obsoleto. Cada módulo administra sus propios permisos.

**f) Verdadero.** Las notificaciones de iOS no utilizan un purpose string del `Info.plist` como cámara o ubicación.

**g) Verdadero.** El permiso puede aparecer como `granted`, pero el nivel real de acceso se conoce mediante `accessPrivileges`.

**h) Verdadero.** Desinstalar y volver a instalar la aplicación es una forma confiable de volver a probar el flujo inicial de permisos.

### A4. Estados de un permiso

**a)** El flujo general es:

```text
Sin decidir
   ↓
Solicitud
   ↓
Concedido
   o
Denegado
   ↓
Bloqueado
```

La diferencia principal es que iOS normalmente muestra una sola vez el diálogo de un permiso. Si se rechaza, para habilitarlo nuevamente suele ser necesario ir a Ajustes. Android puede permitir volver a preguntar mientras `canAskAgain` siga siendo `true`.

**b)**

| Estado | `status` | `canAskAgain` | ¿Puede aparecer diálogo? |
|---|---|---|---|
| Sin decidir | `undetermined` | `true` | Sí |
| Concedido | `granted` | normalmente `true` | No hace falta |
| Denegado, pero se puede volver a pedir | `denied` | `true` | Sí |
| Bloqueado | `denied` | `false` | No |

---

# Parte B · Android: tipos de permisos y manifiesto

### B1. Clasificación

| Permiso | Tipo | ¿Cómo se obtiene? |
|---|---|---|
| `INTERNET` | Instalación | Se concede automáticamente |
| `CAMERA` | Tiempo de ejecución | Se declara y luego se solicita |
| `VIBRATE` | Instalación | Se concede automáticamente |
| `SYSTEM_ALERT_WINDOW` | Especial | Se habilita desde una pantalla especial de Ajustes |
| `POST_NOTIFICATIONS` | Tiempo de ejecución | Se solicita en Android 13 o superior |
| `ACCESS_NETWORK_STATE` | Instalación | Se concede automáticamente |
| `READ_CONTACTS` | Tiempo de ejecución | Se solicita al usuario |
| `SCHEDULE_EXACT_ALARM` | Especial | Requiere acceso especial según versión y caso |
| `RECORD_AUDIO` | Tiempo de ejecución | Se solicita al usuario |
| `MANAGE_EXTERNAL_STORAGE` | Especial | Se habilita desde Ajustes y tiene restricciones de tienda |

### B2. Grupos y nombres

**a)** Un grupo reúne permisos relacionados. Si se solicitan `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos, Android los presenta dentro de una misma experiencia de permiso de ubicación.

**b)** Los permisos completos utilizan el prefijo:

```text
android.permission.
```

Por ejemplo:

```text
android.permission.CAMERA
```

**c)** Los permisos `signature` solo se conceden a aplicaciones firmadas con el mismo certificado que la aplicación o el sistema que los declara. Por eso no son permisos normales para aplicaciones comunes.

### B3. Leer el manifiesto

**a)** `INTERNET` se concede automáticamente. Cámara, ubicación y `POST_NOTIFICATIONS` necesitan solicitud en tiempo de ejecución cuando corresponde. `READ_EXTERNAL_STORAGE` dependía de la versión de Android. `RECORD_AUDIO` está siendo eliminado del manifiesto del ejemplo.

**b)**

```xml
android:maxSdkVersion="32"
```

significa que ese permiso se utiliza como máximo hasta Android API 32. Desde Android 13 aparecen permisos más específicos como:

```text
READ_MEDIA_IMAGES
READ_MEDIA_VIDEO
READ_MEDIA_AUDIO
```

**c)**

```xml
tools:node="remove"
```

hace que ese permiso sea eliminado al fusionarse los manifiestos.

En Expo puede lograrse con:

```json
"android": {
  "blockedPermissions": [
    "android.permission.RECORD_AUDIO"
  ]
}
```

**d)** Se agregaría en:

```json
"android": {
  "permissions": [
    "android.permission.SCHEDULE_EXACT_ALARM"
  ]
}
```

**e)** No conviene editar manualmente el `AndroidManifest.xml` porque Expo puede volver a generarlo y perder esos cambios. Se configura desde `app.json`. `blockedPermissions` afecta la build propia, no cambia los permisos de la aplicación Expo Go.

### B4. Así pregunta Android

**a)** No se puede colocar cualquier texto propio dentro del diálogo estándar. La explicación debe mostrarse antes, dentro de la interfaz de la aplicación.

**b)** “Mientras la app está en uso” mantiene el permiso mientras la aplicación está siendo utilizada. “Solo esta vez” concede un acceso temporal que luego vence. Esta opción se utiliza en permisos como cámara, micrófono y ubicación.

**c)** En versiones modernas de Android, después de rechazos repetidos el sistema puede dejar de mostrar el diálogo y `canAskAgain` pasa a `false`.

**d)** Una ubicación aproximada puede servir para mostrar puntos de reciclaje del barrio. No sería suficiente, por ejemplo, para indicar una entrada exacta de un edificio.

**e)** Android puede reiniciar el proceso de la aplicación cuando cambia ciertos permisos desde Ajustes. Por eso al regresar la aplicación debe volver a consultar el estado.

### B5. Android, versión por versión

| Cambio | Versión | Consecuencia |
|---|---|---|
| Permisos en tiempo de ejecución | Android 6, API 23 | Hay que consultar y solicitar permisos sensibles durante la ejecución |
| Ubicación en segundo plano separada | Android 10, API 29 | Se declara `ACCESS_BACKGROUND_LOCATION` |
| Dos rechazos pueden impedir volver a preguntar | Android 11, API 30 | Hay que revisar `canAskAgain` y ofrecer Ajustes |
| “Solo esta vez” | Android 11, API 30 | El permiso puede ser temporal |
| Ubicación aproximada o precisa | Android 12, API 31 | La app debe funcionar incluso con ubicación aproximada |
| `POST_NOTIFICATIONS` | Android 13, API 33 | Las notificaciones pasan a necesitar permiso en runtime |
| Acceso parcial a fotos | Android 14, API 34 | Hay que manejar selección parcial de medios |
| `ACCESS_LOCAL_NETWORK` | Android 17, API 37 | El acceso amplio a la red local requiere permiso en runtime |

`targetSdkVersion` indica para qué nivel de API Android está preparada la aplicación y qué comportamientos nuevos acepta.

Expo SDK 57 apunta a API 36.

---

# Parte C · iOS: textos de propósito y acceso parcial

### C1. Claves de Info.plist

| Recurso | Clave |
|---|---|
| Cámara | `NSCameraUsageDescription` |
| Micrófono | `NSMicrophoneUsageDescription` |
| Ubicación en uso | `NSLocationWhenInUseUsageDescription` |
| Ubicación siempre | `NSLocationAlwaysAndWhenInUseUsageDescription` |
| Fotos, lectura | `NSPhotoLibraryUsageDescription` |
| Fotos, solo guardar | `NSPhotoLibraryAddUsageDescription` |
| Contactos | `NSContactsUsageDescription` |
| Face ID | `NSFaceIDUsageDescription` |
| Rastreo entre apps | `NSUserTrackingUsageDescription` |
| Notificaciones | No lleva una clave de propósito equivalente |

### C2. Sin texto, no hay permiso

**a)** Si la aplicación intenta acceder a la cámara sin `NSCameraUsageDescription`, iOS puede finalizar la aplicación. App Store Connect también puede detectar el problema y rechazar la build con:

```text
ITMS-90683
```

**b)** iOS normalmente muestra una vez el diálogo. Si la persona lo rechaza, la aplicación debe explicar cómo habilitarlo desde Ajustes.

**c)** El sistema arma el cuadro, nombre de la aplicación y botones. Nosotros escribimos el texto que explica para qué se usa el recurso. En Expo se configura normalmente en `app.json` mediante el plugin del módulo.

**d)** Apple analiza también las APIs incluidas por librerías. Aunque nuestro código no llame directamente a esa API, una dependencia puede provocar que App Store espere el texto de propósito. Se debe eliminar esa capacidad o dependencia, configurarla correctamente o incluir la clave necesaria.

### C3. Textos de propósito

| Texto | ¿Aprobado? | Mejor versión |
|---|---|---|
| “Necesitamos tu ubicación.” | No | “Usamos tu ubicación para mostrarte servicios cercanos.” |
| “Para mejorar tu experiencia.” | No | “Usamos tu ubicación para mostrarte las farmacias más cercanas.” |
| “Usamos tu ubicación para mostrarte las farmacias de turno más cercanas.” | Sí | No necesita cambio |
| “La app no funciona sin ubicación.” | No | “Usamos tu ubicación para mostrarte las farmacias de turno más cercanas.” |
| “Ubicación requerida por el sistema.” | No | “Usamos tu ubicación para mostrarte servicios cercanos a tu posición.” |

La idea es explicar concretamente qué dato se usa y para qué beneficio.

### C4. Acceso parcial y gradual

| Caso | Desde iOS | En Expo |
|---|---|---|
| Fotos limitadas | iOS 14 | `accessPrivileges === 'limited'` |
| Ubicación aproximada | iOS 14 | `permission.ios?.accuracy === 'reduced'` |
| “Permitir una vez” | iOS 13 | Se refleja en el estado del permiso de ubicación |
| Escalar de “en uso” a “Siempre” | iOS 13 | Primero foreground y después background |
| Notificaciones provisionales | iOS 12 | Estado `PROVISIONAL` de notificaciones |
| App Tracking Transparency | iOS 14.5 | `expo-tracking-transparency` |

Expo SDK 57 requiere como mínimo iOS 16.4, por lo tanto todas estas funcionalidades ya existen en las versiones de iOS soportadas por este SDK.

### C5. Android vs iOS

| | Android | iOS |
|---|---|---|
| Declaración | `AndroidManifest.xml` | `Info.plist` |
| Texto propio en diálogo | Generalmente no | Sí, mediante purpose string |
| Oportunidades para preguntar | Puede haber más de una | Normalmente una |
| “Solo esta vez” | Sí, cámara, micrófono y ubicación | “Permitir una vez” en ubicación |
| Notificaciones | Runtime desde Android 13 | Siempre se solicita autorización |
| Ubicación background | Permiso separado desde Android 10 | Se escala desde “en uso” hacia “Siempre” |
| Falta declaración | El permiso puede no poder solicitarse | Puede provocar cierre o rechazo de App Store |

---

# Parte D · Expo: una API, dos plataformas

### D1. Módulos y funciones

| Necesidad | Módulo | Función / hook |
|---|---|---|
| Escanear QR | `expo-camera` | `useCameraPermissions()` |
| Grabar video con sonido | `expo-camera` | permiso de cámara y micrófono |
| Farmacias cercanas | `expo-location` | `useForegroundPermissions()` |
| Seguir un envío en background | `expo-location` | foreground y luego background |
| Mostrar recordatorio | `expo-notifications` | `requestPermissionsAsync()` |
| Nota de voz | `expo-audio` | `requestRecordingPermissionsAsync()` |
| Galería propia | `expo-media-library` | `requestPermissionsAsync()` |
| Publicidad personalizada iOS | `expo-tracking-transparency` | `requestTrackingPermissionsAsync()` |

Si un tutorial usa:

```ts
import * as Permissions from 'expo-permissions';
```

es una señal de que está desactualizado.

### D2. Consultar, pedir y hook

**a)** `get...PermissionsAsync()` solamente consulta el estado actual. `request...PermissionsAsync()` puede mostrar el diálogo del sistema.

**b)** El hook devuelve:

```ts
[permiso, pedirPermiso, consultarPermiso]
```

- `permiso`: estado actual.
- `pedirPermiso`: solicita el permiso.
- `consultarPermiso`: vuelve a leerlo.

En el primer render `permiso` puede ser `null`, por lo que debería mostrarse un estado de carga.

**c)** Si `canAskAgain` es `false`, llamar nuevamente a `request...()` no sirve porque el sistema ya no mostrará el diálogo. Llamarlo continuamente puede producir un bucle y una interfaz que parece quedar pidiendo permiso para siempre.

### D3. Leer la respuesta

| Respuesta | Acción |
|---|---|
| `null` | Mostrar carga |
| `granted` | Usar la función |
| `undetermined`, `canAskAgain: true` | Mostrar explicación y permitir continuar |
| `denied`, `canAskAgain: true` | Permitir intentar nuevamente cuando el usuario lo decida |
| `denied`, `canAskAgain: false` | Mostrar “Abrir Ajustes” |
| `granted`, `accessPrivileges: 'limited'` | Funcionar con el acceso parcial |
| `granted`, Android `accuracy: 'coarse'` | Tratar la ubicación como aproximada |

Los dos campos principales son:

```text
status
canAskAgain
```

`status` responde si el recurso está concedido o denegado.  
`canAskAgain` indica si todavía puede aparecer el diálogo del sistema.

### D4. Ciclo completo

#### Android 14

| Paso | Estado | canAskAgain | Diálogo |
|---|---|---|---|
| Consulta inicial | `undetermined` | `true` | No |
| Primer “No permitir” | `denied` | `true` | Sí |
| Segundo “No permitir” | `denied` | `false` | Sí |
| Se solicita otra vez | `denied` | `false` | No |
| Se habilita desde Ajustes y se consulta | `granted` | — | No |
| Se habilita pero la app no consulta | La interfaz queda con el estado viejo | — | No |

En iOS cambia antes: después de rechazar el primer diálogo normalmente no puede volver a mostrarse desde la aplicación y hay que dirigir a Ajustes.

Con “Permitir una vez”, la autorización es temporal. Al terminar ese uso y volver a necesitarla, el sistema puede solicitarla nuevamente.

### D5. Configuración app.json

```json
{
  "expo": {
    "android": {
      "blockedPermissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW"
      ]
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos tu cámara para escanear códigos QR.",
          "microphonePermission": false,
          "recordAudioAndroid": false,
          "barcodeScannerEnabled": true
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación para mostrarte puntos de reciclaje cercanos.",
          "isIosBackgroundLocationEnabled": false,
          "isAndroidBackgroundLocationEnabled": false
        }
      ]
    ]
  }
}
```

`expo-camera` puede incluir permisos relacionados con grabación debido a que el módulo también permite grabar video. Si la app solo escanea QR, esos permisos deben desactivarse siguiendo el principio de mínimo privilegio.

### D6. Expo Go no es tu app

**a)** Los textos de propósito no aparecen como los configuramos porque Expo Go es una aplicación ya compilada con su propia configuración nativa.

**b)** En Expo Go se pueden probar muchas funciones comunes, pero cambios nativos específicos, algunas capacidades de notificaciones push y funcionalidades como ubicación de segundo plano requieren una development build propia.

**c)** Para generar los archivos nativos:

```bash
npx expo prebuild --clean
```

Para una development build Android:

```bash
npx eas-cli@latest build --platform android --profile development
```

**d)** Android, por ejemplo para cámara:

```bash
adb shell pm revoke com.ejemplo.app android.permission.CAMERA
adb shell pm clear-permission-flags com.ejemplo.app android.permission.CAMERA user-set user-fixed
```

En un simulador iOS:

```bash
xcrun simctl privacy booted reset camera com.ejemplo.app
```

---

# Parte E · Recetas: leer y corregir código

### E1. Errores de cámara

Problemas del código:

1. Usa `permiso.status` sin verificar si `permiso` todavía es `null`.
2. No distingue un permiso que todavía se puede pedir de uno bloqueado.
3. No utiliza `canAskAgain`.
4. No ofrece “Abrir Ajustes”.
5. El botón dice “Permitir”, aunque el permiso lo decide el sistema.

Una versión corregida sería:

```tsx
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import {
  ActivityIndicator,
  Button,
  Linking,
  Text,
  View,
} from 'react-native';

export default function Escanear() {
  const [
    permiso,
    pedirPermiso,
  ] = useCameraPermissions();

  if (!permiso) {
    return (
      <ActivityIndicator />
    );
  }

  if (permiso.granted) {
    return (
      <CameraView
        style={{ flex: 1 }}
        facing="back"
      />
    );
  }

  if (
    permiso.status ===
      'denied' &&
    !permiso.canAskAgain
  ) {
    return (
      <View>
        <Text>
          La cámara está bloqueada.
        </Text>

        <Button
          title="Abrir Ajustes"
          onPress={() =>
            Linking.openSettings()
          }
        />
      </View>
    );
  }

  return (
    <View>
      <Text>
        Usamos la cámara para leer el QR del aula.
      </Text>

      <Button
        title="Continuar"
        onPress={
          pedirPermiso
        }
      />
    </View>
  );
}
```

### E2. Orden de ubicación

**a)** Está mal pedir primero el permiso de segundo plano. Primero debe solicitarse ubicación en uso.

En Android 11 o superior el acceso de segundo plano requiere un flujo especial y puede derivar a Ajustes. En iOS también debe escalarse desde el permiso de uso.

**b)**

```ts
import * as Location from 'expo-location';

export async function activarSeguimiento() {
  const enUso =
    await Location.requestForegroundPermissionsAsync();

  if (!enUso.granted) {
    return false;
  }

  const siempre =
    await Location.requestBackgroundPermissionsAsync();

  return siempre.granted;
}
```

**c)**

```ts
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export async function obtenerUbicacion() {
  const permiso =
    await Location.requestForegroundPermissionsAsync();

  if (!permiso.granted) {
    return null;
  }

  const posicion =
    await Location.getCurrentPositionAsync();

  let aproximada = false;

  if (
    Platform.OS === 'android' &&
    permiso.android?.accuracy === 'coarse'
  ) {
    aproximada = true;
  }

  if (
    Platform.OS === 'ios' &&
    permiso.ios?.accuracy === 'reduced'
  ) {
    aproximada = true;
  }

  return {
    coordenadas: posicion.coords,
    aproximada,
  };
}
```

**d)** No hace falta ubicación en segundo plano para mostrar farmacias cercanas mientras la aplicación está abierta. Solicitar background sin necesitarlo aumenta el acceso a datos sensibles y además Google Play exige justificar que sea una función principal.

### E3. Notificaciones

**a)** En Android moderno una causa habitual es no haber creado primero un canal de notificaciones. Conviene crear el canal y después pedir permiso.

**b)** En Android 12 o anteriores no existe `POST_NOTIFICATIONS` como permiso de runtime.

**c)** iOS permite notificaciones provisionales. Se puede solicitar autorización provisional y comprobar el estado específico de iOS.

**d)** Conviene pedir notificaciones cuando el usuario activa una función que realmente las necesita.

Buen momento:

```text
El usuario activa “Avisarme cuando mi pedido esté listo”.
```

Mal momento:

```text
Apenas abre la aplicación por primera vez.
```

### E4. Fotos sin pedir permiso

| Necesidad | Herramienta | Permiso |
|---|---|---|
| Elegir foto de perfil | Selector del sistema | No acceso amplio |
| Sacar foto | Cámara | Cámara |
| Editor que muestra toda la galería | Media Library | Acceso a fotos |
| Adjuntar comprobante | Selector del sistema | No acceso amplio |

Google Play limita `READ_MEDIA_IMAGES` y `READ_MEDIA_VIDEO` porque permiten acceso amplio a archivos personales. Para un uso ocasional se debe preferir un selector del sistema.

El mejor permiso es el permiso más pequeño que permite cumplir la función.

### E5. Volver de Ajustes

```ts
import {
  useEffect,
  useRef,
} from 'react';

import {
  AppState,
} from 'react-native';

export function useRevisarAlVolver(
  revisar: () => void
) {
  const anterior =
    useRef(
      AppState.currentState
    );

  useEffect(() => {
    const sub =
      AppState.addEventListener(
        'change',
        (nuevo) => {
          const estabaAfuera =
            anterior.current ===
              'background' ||
            anterior.current ===
              'inactive';

          if (
            estabaAfuera &&
            nuevo === 'active'
          ) {
            revisar();
          }

          anterior.current =
            nuevo;
        }
      );

    return () =>
      sub.remove();
  }, [revisar]);
}
```

**a)** Porque el permiso cambia fuera de la aplicación y el hook no necesariamente recibe automáticamente ese cambio.

**b)** Del hook de cámara se puede pasar la función que vuelve a consultar el permiso.

```ts
consultarPermiso
```

**c)** Porque el estado real pertenece al sistema operativo y puede cambiar desde Ajustes en cualquier momento. Guardarlo permanentemente podría dejar información desactualizada.

---

# Parte F · Buenas prácticas y tiendas

### F1. Pedir en contexto

| App y permiso | Momento correcto | Alternativa |
|---|---|---|
| Delivery · ubicación | Al pedir usar ubicación actual | Escribir dirección manualmente |
| Billetera · cámara | Al escanear QR | Escribir los datos manualmente |
| Red social · contactos | Al elegir buscar amigos en contactos | Buscar por usuario |
| Mensajería · micrófono | Al grabar primer audio | Enviar texto |
| Turnos médicos · notificaciones | Al activar recordatorios | Consultar turnos dentro de la app |
| Editor de fotos · galería completa | Cuando se entra a una función que necesita administrar toda la biblioteca | Selector del sistema cuando alcanza |

Pedir varios permisos apenas se abre la aplicación hace que la persona todavía no entienda el beneficio y tenga más tendencia a tocar “No permitir”. Los permisos deben aparecer cuando su necesidad es evidente.

### F2. Pantalla previa

**a)** Una buena pantalla previa contiene:

1. una explicación clara del recurso;
2. el beneficio concreto;
3. un botón para continuar al diálogo del sistema.

**b)** Debe decir “Continuar” porque la aplicación no puede garantizar que el permiso será concedido. La decisión final pertenece al sistema y a la persona.

**c)** No conviene diseñar una pantalla previa que manipule la decisión con botones engañosos. El flujo debe conducir claramente al diálogo oficial y permitir que sea el sistema quien presente la elección.

**d)** Si el permiso ya está bloqueado no debe volver a intentar solicitarlo. Debe explicar la situación y reemplazar “Continuar” por:

```text
Abrir Ajustes
```

### F3. Mínimo privilegio

**a)** Para puntos de reciclaje del barrio alcanza con ubicación aproximada.

**b)** Para registrar una carrera con el teléfono en el bolsillo puede ser necesario segundo plano si la aplicación necesita seguir registrando con la pantalla apagada o fuera de primer plano.

**c)** Para subir una sola foto del DNI alcanza con el selector del sistema.

**d)** Para escanear el QR del aula se utiliza `expo-camera` sin micrófono.

### F4. Tiendas

**a) Google Play**

- Justificar permisos sensibles y usar solamente los necesarios.
- Preferir selectores del sistema frente a permisos amplios cuando exista una alternativa.

**App Store**

- Incluir purpose strings claros para recursos protegidos.
- Informar correctamente las prácticas de privacidad y datos utilizados por la aplicación.

**b)** `PrivacyInfo.xcprivacy` es el manifiesto de privacidad de Apple. Describe determinados usos de datos y APIs sensibles. En un proyecto Expo puede configurarse mediante la configuración nativa de iOS y los plugins correspondientes.

**c)** Android 17 agrega, entre otros cambios, el permiso:

```text
ACCESS_LOCAL_NETWORK
```

para aplicaciones que necesitan acceso amplio a dispositivos de la red local.

También introduce un selector de contactos más respetuoso de la privacidad.

Desde el **27 de enero de 2027**, las aplicaciones que apunten a Android 17 o superior y quieran seguir utilizando `READ_CONTACTS` deberán cumplir la política de contactos de Google Play. Cuando el selector de contactos sea suficiente, se espera que se utilice en lugar del permiso amplio.

### F5. Errores comunes

**a)**

```text
This app has crashed because it attempted to access privacy-sensitive data without a usage description.
```

**Causa:** falta la clave correspondiente en `Info.plist`.

**Solución:** agregar un purpose string claro mediante el plugin o configuración de iOS y volver a generar la build.

---

**b) En Expo Go funciona pero en la build la cámara no pregunta.**

**Causa:** la build propia no tiene correctamente declarado el permiso nativo.

**Solución:** revisar el plugin de `expo-camera` en `app.json` y generar nuevamente la build.

---

**c) Después de habilitar ubicación desde Ajustes sigue diciendo bloqueado.**

**Causa:** la aplicación conserva el estado anterior.

**Solución:** al regresar a estado `active`, volver a llamar a la función que consulta el permiso.

---

**d) La pantalla queda en “Pidiendo permiso...” permanentemente.**

**Causa:** `requestPermissionsAsync()` se ejecuta durante cada render.

**Solución:** llamar al pedido únicamente desde una acción concreta del usuario o un efecto correctamente controlado.

---

**e) Una aplicación de turnos bloquea todo si se rechazan notificaciones.**

**Causa:** trata un permiso opcional como si fuera obligatorio para usar toda la aplicación.

**Solución:** permitir que la aplicación continúe funcionando y ofrecer una alternativa, por ejemplo una bandeja interna de avisos.

---

# Conclusión

Los permisos no deberían pedirse todos al iniciar una aplicación. Lo correcto es solicitarlos cuando la persona intenta utilizar una función que realmente los necesita, explicar previamente para qué se utilizarán y ofrecer una alternativa si son rechazados.

También es importante distinguir entre declarar un permiso durante la compilación y solicitarlo durante la ejecución, manejar los estados `granted`, `denied`, `undetermined` y `canAskAgain`, y volver a consultar el estado cuando la persona regresa desde Ajustes.

En nuestro proyecto Mantenimiento IPF esto se aplica utilizando permisos de cámara, ubicación y notificaciones solamente cuando corresponde, y evitando solicitar acceso amplio a la galería para seleccionar una única fotografía.