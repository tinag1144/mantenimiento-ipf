import {
  router,
} from 'expo-router';

import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {
  useEffect,
  useRef,
} from 'react';

import {
  usePermiso,
} from '@/hooks/usePermiso';

import {
  useReportes,
} from '@/context/ReportesContext';

export default function AjustesAppScreen() {
  const {
    estado,
    abrirAjustes,
  } =
    usePermiso(
      'notificaciones'
    );

  const {
    notificacionesActivas,
    setNotificacionesActivas,
  } =
    useReportes();

  const esperandoPermiso =
    useRef(false);

  useEffect(() => {
    if (
      esperandoPermiso.current &&
      estado === 'concedido'
    ) {
      setNotificacionesActivas(
        true
      );

      esperandoPermiso.current =
        false;
    }
  }, [
    estado,
    setNotificacionesActivas,
  ]);

  function cambiarSwitch(
    valor: boolean
  ) {
    if (!valor) {
      setNotificacionesActivas(
        false
      );

      return;
    }

    if (
      estado ===
      'concedido'
    ) {
      setNotificacionesActivas(
        true
      );

      return;
    }

    esperandoPermiso.current =
      true;

    router.push(
      '/permisos/notificaciones'
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Ajustes
      </Text>

      <View style={styles.opcion}>
        <View style={styles.textos}>
          <Text style={styles.nombre}>
            Avisarme cuando se resuelva mi reporte
          </Text>

          <Text
            style={
              styles.descripcion
            }
          >
            Recibí una notificación cuando un reporte sea marcado como resuelto.
          </Text>
        </View>

        <Switch
          value={
            notificacionesActivas
          }
          onValueChange={
            cambiarSwitch
          }
        />
      </View>

      {estado ===
        'concedido' && (
        <Text style={styles.estadoOk}>
          Permiso de notificaciones concedido.
        </Text>
      )}

      {estado ===
        'preguntable' && (
        <Text style={styles.estadoInfo}>
          El permiso se solicitará únicamente si activás las notificaciones.
        </Text>
      )}

      {estado ===
        'bloqueado' && (
        <View style={styles.bloqueado}>
          <Text
            style={
              styles.bloqueadoTexto
            }
          >
            Las notificaciones están bloqueadas en el sistema.
          </Text>

          <Pressable
            style={
              styles.botonAjustes
            }
            onPress={
              abrirAjustes
            }
          >
            <Text
              style={
                styles.botonAjustesTexto
              }
            >
              Abrir Ajustes
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 15,
      backgroundColor:
        '#f7f0dc',
    },

    titulo: {
      fontSize: 28,
      fontWeight: '800',
      color: '#17313d',
    },

    opcion: {
      backgroundColor:
        '#ffffff',
      padding: 18,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },

    textos: {
      flex: 1,
    },

    nombre: {
      fontSize: 16,
      fontWeight: '700',
      color: '#17313d',
    },

    descripcion: {
      marginTop: 4,
      color: '#6b7b83',
      lineHeight: 20,
    },

    estadoOk: {
      backgroundColor:
        '#dff2dc',
      color: '#0f7d18',
      padding: 14,
      borderRadius: 12,
      fontWeight: '700',
    },

    estadoInfo: {
      backgroundColor:
        '#ffffff',
      color: '#6b7b83',
      padding: 14,
      borderRadius: 12,
    },

    bloqueado: {
      backgroundColor:
        '#fff0f0',
      padding: 15,
      borderRadius: 14,
      gap: 10,
    },

    bloqueadoTexto: {
      color: '#c83d4d',
      fontWeight: '700',
    },

    botonAjustes: {
      backgroundColor:
        '#2f4652',
      padding: 13,
      borderRadius: 10,
      alignItems: 'center',
    },

    botonAjustesTexto: {
      color: '#ffffff',
      fontWeight: '700',
    },
  });