import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

import { Platform } from 'react-native';

export type RecursoPermiso =
  | 'camara'
  | 'ubicacion'
  | 'notificaciones';

export type RespuestaPermiso = {
  status: string;
  granted: boolean;
  canAskAgain: boolean;

  parcial: boolean;
  detalleParcial: string | null;
};

export function normalizarUbicacion(
  permiso: Location.LocationPermissionResponse
): RespuestaPermiso {
  let parcial = false;
  let detalleParcial: string | null = null;

  if (
    Platform.OS === 'android' &&
    permiso.android?.accuracy === 'coarse'
  ) {
    parcial = true;
    detalleParcial = 'Ubicación aproximada';
  }

  if (
    Platform.OS === 'ios' &&
    permiso.ios?.accuracy === 'reduced'
  ) {
    parcial = true;
    detalleParcial = 'Ubicación aproximada';
  }

  return {
    status: permiso.status,
    granted: permiso.granted,
    canAskAgain: permiso.canAskAgain,

    parcial,
    detalleParcial,
  };
}

export function normalizarNotificaciones(
  permiso: Notifications.NotificationPermissionsStatus
): RespuestaPermiso {
  return {
    status: permiso.status,
    granted: permiso.granted,
    canAskAgain: permiso.canAskAgain,

    parcial: false,
    detalleParcial: null,
  };
}

export async function consultarUbicacion() {
  const permiso =
    await Location.getForegroundPermissionsAsync();

  return normalizarUbicacion(permiso);
}

export async function solicitarUbicacion() {
  const permiso =
    await Location.requestForegroundPermissionsAsync();

  return normalizarUbicacion(permiso);
}

async function prepararCanalNotificaciones() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    'reportes',
    {
      name: 'Reportes',
      importance:
        Notifications.AndroidImportance.DEFAULT,
    }
  );
}

export async function consultarNotificaciones() {
  const permiso =
    await Notifications.getPermissionsAsync();

  return normalizarNotificaciones(permiso);
}

export async function solicitarNotificaciones() {
  await prepararCanalNotificaciones();

  const permiso =
    await Notifications.requestPermissionsAsync();

  return normalizarNotificaciones(permiso);
}