import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

import {
  Platform,
} from 'react-native';

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
    detalleParcial =
      'Ubicación aproximada';
  }

  if (
    Platform.OS === 'ios' &&
    permiso.ios?.accuracy === 'reduced'
  ) {
    parcial = true;
    detalleParcial =
      'Ubicación aproximada';
  }

  return {
    status: permiso.status,
    granted: permiso.granted,
    canAskAgain:
      permiso.canAskAgain,

    parcial,
    detalleParcial,
  };
}

export async function consultarUbicacion() {
  const permiso =
    await Location.getForegroundPermissionsAsync();

  return normalizarUbicacion(
    permiso
  );
}

export async function solicitarUbicacion() {
  const permiso =
    await Location.requestForegroundPermissionsAsync();

  return normalizarUbicacion(
    permiso
  );
}

export async function prepararCanalReportes() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    'reportes',
    {
      name: 'Reportes',
      importance:
        Notifications.AndroidImportance.MAX,
    }
  );
}

export async function consultarNotificaciones(): Promise<RespuestaPermiso> {
  const permiso =
    await Notifications.getPermissionsAsync();

  return {
    status: permiso.status,
    granted: permiso.granted,
    canAskAgain:
      permiso.canAskAgain,

    parcial: false,
    detalleParcial: null,
  };
}

export async function solicitarNotificaciones(): Promise<RespuestaPermiso> {
  // En Android creamos el canal ANTES
  // de mostrar el permiso del sistema.
  await prepararCanalReportes();

  const permiso =
    await Notifications.requestPermissionsAsync();

  return {
    status: permiso.status,
    granted: permiso.granted,
    canAskAgain:
      permiso.canAskAgain,

    parcial: false,
    detalleParcial: null,
  };
}