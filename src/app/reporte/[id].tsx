import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import * as Notifications from 'expo-notifications';

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useState,
} from 'react';

import {
  useReportes,
} from '@/context/ReportesContext';

import {
  consultarNotificaciones,
  prepararCanalReportes,
} from '@/lib/permisos';

export default function DetalleReporteScreen() {
  const {
    id,
  } =
    useLocalSearchParams<{
      id: string;
    }>();

  const {
    buscarReporte,
    resolverReporte,
    agregarAviso,
    notificacionesActivas,
  } =
    useReportes();

  const [
    resolviendo,
    setResolviendo,
  ] =
    useState(false);

  const numeroId =
    Number(id);

  if (
    Number.isNaN(
      numeroId
    )
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          El identificador del reporte no es válido.
        </Text>
      </View>
    );
  }

  const reporte =
    buscarReporte(
      numeroId
    );

  if (!reporte) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          El reporte no existe.
        </Text>
      </View>
    );
  }

  const tieneCoordenadas =
    reporte.latitud !==
      undefined &&
    reporte.longitud !==
      undefined;

  const reporteId =
    reporte.id;

  const reporteTitulo =
    reporte.titulo;

  const reporteAula =
    reporte.aula;

  async function simularResolucion() {
    if (resolviendo) {
      return;
    }

    try {
      setResolviendo(
        true
      );

      resolverReporte(
        reporteId
      );

      agregarAviso(
        'Reporte resuelto',
        `El reporte "${reporteTitulo}" del aula ${reporteAula} fue marcado como resuelto.`
      );

      const permiso =
        await consultarNotificaciones();

      if (
        notificacionesActivas &&
        permiso.granted
      ) {
        await prepararCanalReportes();

        await Notifications.scheduleNotificationAsync(
          {
            content: {
              title:
                'Reporte resuelto',

              body:
                `El reporte "${reporteTitulo}" fue resuelto.`,

              data: {
                reporteId,
              },
            },

            trigger: {
              type:
                Notifications
                  .SchedulableTriggerInputTypes
                  .TIME_INTERVAL,

              seconds: 10,

              channelId:
                'reportes',
            },
          }
        );

        return;
      }

      if (
        !permiso.granted
      ) {
        router.push(
          '/avisos'
        );
      }
    } catch (error) {
      console.error(
        'Error al resolver el reporte:',
        error
      );
    } finally {
      setResolviendo(
        false
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.titulo}>
        {reporte.titulo}
      </Text>

      <View style={styles.tarjeta}>
        <Text style={styles.label}>
          Descripción
        </Text>

        <Text style={styles.texto}>
          {reporte.descripcion}
        </Text>

        <Text style={styles.label}>
          Aula
        </Text>

        <Text style={styles.texto}>
          {reporte.aula}
        </Text>

        <Text style={styles.label}>
          Categoría
        </Text>

        <Text
          style={[
            styles.texto,
            styles.capitalize,
          ]}
        >
          {reporte.categoria}
        </Text>

        <Text style={styles.label}>
          Estado
        </Text>

        <Text
          style={[
            styles.estado,

            reporte.estado ===
              'resuelto' &&
              styles.estadoResuelto,
          ]}
        >
          {reporte.estado}
        </Text>
      </View>

      {reporte.foto && (
        <View style={styles.tarjeta}>
          <Text style={styles.label}>
            Foto
          </Text>

          <Image
            source={{
              uri:
                reporte.foto,
            }}
            style={styles.imagen}
          />
        </View>
      )}

      <View style={styles.tarjeta}>
        <Text style={styles.label}>
          Ubicación
        </Text>

        {reporte.sector ? (
          <>
            <Text style={styles.texto}>
              Sector:
            </Text>

            <Text
              style={
                styles.ubicacionDestacada
              }
            >
              {reporte.sector}
            </Text>
          </>
        ) : tieneCoordenadas ? (
          <>
            <Text style={styles.texto}>
              Latitud:{' '}
              {reporte.latitud?.toFixed(
                6
              )}
            </Text>

            <Text style={styles.texto}>
              Longitud:{' '}
              {reporte.longitud?.toFixed(
                6
              )}
            </Text>
          </>
        ) : (
          <Text style={styles.texto}>
            No se agregó ubicación.
          </Text>
        )}
      </View>

      {reporte.estado !==
        'resuelto' && (
        <Pressable
          style={styles.boton}
          onPress={
            simularResolucion
          }
          disabled={
            resolviendo
          }
        >
          <Text
            style={
              styles.botonTexto
            }
          >
            {resolviendo
              ? 'Resolviendo...'
              : 'Simular resolución'}
          </Text>
        </Pressable>
      )}

      {reporte.estado ===
        'resuelto' && (
        <View style={styles.resuelto}>
          <Text
            style={
              styles.resueltoTitulo
            }
          >
            Reporte resuelto
          </Text>

          <Text
            style={
              styles.resueltoTexto
            }
          >
            El desperfecto fue marcado como resuelto.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexGrow: 1,
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

    tarjeta: {
      backgroundColor:
        '#ffffff',
      borderRadius: 16,
      padding: 18,
      gap: 7,
    },

    label: {
      marginTop: 5,
      fontWeight: '800',
      color: '#17313d',
    },

    texto: {
      color: '#6b7b83',
      lineHeight: 21,
    },

    estado: {
      color: '#c27a00',
      fontWeight: '800',
      textTransform:
        'capitalize',
    },

    estadoResuelto: {
      color: '#16a01d',
    },

    capitalize: {
      textTransform:
        'capitalize',
    },

    imagen: {
      width: '100%',
      height: 280,
      borderRadius: 14,
      marginTop: 8,
      backgroundColor:
        '#e3dccb',
    },

    ubicacionDestacada: {
      color: '#17313d',
      fontSize: 18,
      fontWeight: '800',
    },

    boton: {
      backgroundColor:
        '#16a01d',
      padding: 16,
      borderRadius: 14,
      alignItems: 'center',
    },

    botonTexto: {
      color: '#ffffff',
      fontWeight: '800',
      fontSize: 16,
    },

    resuelto: {
      backgroundColor:
        '#dff2dc',
      padding: 18,
      borderRadius: 16,
    },

    resueltoTitulo: {
      color: '#0f7d18',
      fontSize: 18,
      fontWeight: '800',
    },

    resueltoTexto: {
      marginTop: 5,
      color: '#0f7d18',
    },

    error: {
      fontSize: 18,
      color: '#c83d4d',
      fontWeight: '700',
    },
  });