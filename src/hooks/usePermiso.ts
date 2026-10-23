import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AppState,
  Linking,
} from 'react-native';

import {
  useCameraPermissions,
} from 'expo-camera';

import {
  consultarNotificaciones,
  consultarUbicacion,
  RecursoPermiso,
  solicitarNotificaciones,
  solicitarUbicacion,
} from '@/lib/permisos';

export type EstadoPermiso =
  | 'cargando'
  | 'concedido'
  | 'preguntable'
  | 'bloqueado';

export function usePermiso(
  recurso: RecursoPermiso
) {
  const [
    permisoCamara,
    pedirCamara,
    consultarCamara,
  ] = useCameraPermissions();

  const [estado, setEstado] =
    useState<EstadoPermiso>('cargando');

  const [parcial, setParcial] =
    useState(false);

  const [
    detalleParcial,
    setDetalleParcial,
  ] = useState<string | null>(null);

  const estadoAnterior = useRef(
    AppState.currentState
  );

  const procesar = useCallback(
    (
      granted: boolean,
      status: string,
      canAskAgain: boolean,
      esParcial = false,
      detalle: string | null = null
    ) => {
      setParcial(esParcial);
      setDetalleParcial(detalle);

      if (granted) {
        setEstado('concedido');
        return;
      }

      if (status === 'undetermined') {
        setEstado('preguntable');
        return;
      }

      if (canAskAgain) {
        setEstado('preguntable');
        return;
      }

      setEstado('bloqueado');
    },
    []
  );

  const actualizar =
    useCallback(async () => {
      try {
        setEstado('cargando');

        if (recurso === 'camara') {
          const permiso =
            await consultarCamara();

          procesar(
            permiso.granted,
            permiso.status,
            permiso.canAskAgain
          );

          return;
        }

        if (recurso === 'ubicacion') {
          const permiso =
            await consultarUbicacion();

          procesar(
            permiso.granted,
            permiso.status,
            permiso.canAskAgain,
            permiso.parcial,
            permiso.detalleParcial
          );

          return;
        }

        const permiso =
          await consultarNotificaciones();

        procesar(
          permiso.granted,
          permiso.status,
          permiso.canAskAgain
        );
      } catch (error) {
        console.error(
          `Error consultando permiso de ${recurso}:`,
          error
        );
      }
    },
    [
      recurso,
      consultarCamara,
      procesar,
    ]
  );

  const pedir =
    useCallback(async () => {
      try {
        if (recurso === 'camara') {
          const permiso =
            await pedirCamara();

          procesar(
            permiso.granted,
            permiso.status,
            permiso.canAskAgain
          );

          return permiso.granted;
        }

        if (recurso === 'ubicacion') {
          const permiso =
            await solicitarUbicacion();

          procesar(
            permiso.granted,
            permiso.status,
            permiso.canAskAgain,
            permiso.parcial,
            permiso.detalleParcial
          );

          return permiso.granted;
        }

        const permiso =
          await solicitarNotificaciones();

        procesar(
          permiso.granted,
          permiso.status,
          permiso.canAskAgain
        );

        return permiso.granted;
      } catch (error) {
        console.error(
          `Error solicitando permiso de ${recurso}:`,
          error
        );

        return false;
      }
    },
    [
      recurso,
      pedirCamara,
      procesar,
    ]
  );

  const abrirAjustes =
    useCallback(async () => {
      await Linking.openSettings();
    }, []);

  useEffect(() => {
    actualizar();
  }, [actualizar]);

  useEffect(() => {
    const suscripcion =
      AppState.addEventListener(
        'change',
        (nuevoEstado) => {
          const estabaAfuera =
            estadoAnterior.current ===
              'background' ||
            estadoAnterior.current ===
              'inactive';

          if (
            estabaAfuera &&
            nuevoEstado === 'active'
          ) {
            actualizar();
          }

          estadoAnterior.current =
            nuevoEstado;
        }
      );

    return () => {
      suscripcion.remove();
    };
  }, [actualizar]);

  return {
    estado,
    parcial,
    detalleParcial,
    pedir,
    abrirAjustes,
    actualizar,
  };
}