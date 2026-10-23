import {
  Stack,
} from 'expo-router';

import * as Notifications from 'expo-notifications';

import {
  ReportesProvider,
} from '@/context/ReportesContext';

Notifications.setNotificationHandler({
  handleNotification:
    async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
});

export default function RootLayout() {
  return (
    <ReportesProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown:
              false,
          }}
        />

        <Stack.Screen
          name="reporte/nuevo"
          options={{
            title:
              'Nuevo reporte',
          }}
        />

        <Stack.Screen
          name="reporte/escanear"
          options={{
            title:
              'Escanear aula',
          }}
        />

        <Stack.Screen
          name="reporte/foto"
          options={{
            title:
              'Adjuntar foto',
          }}
        />

        <Stack.Screen
          name="reporte/ubicacion"
          options={{
            title:
              'Ubicación',
          }}
        />

        <Stack.Screen
          name="reporte/[id]"
          options={{
            title:
              'Detalle del reporte',
          }}
        />

        <Stack.Screen
          name="permisos/[recurso]"
          options={{
            title:
              'Permiso',
            presentation:
              'modal',
          }}
        />

        <Stack.Screen
          name="ajustes-app"
          options={{
            title:
              'Ajustes de la aplicación',
          }}
        />

        <Stack.Screen
          name="+not-found"
          options={{
            title:
              'Página no encontrada',
          }}
        />
      </Stack>
    </ReportesProvider>
  );
}