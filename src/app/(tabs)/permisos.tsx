import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Link,
} from 'expo-router';

import {
  EstadoPermiso,
  usePermiso,
} from '@/hooks/usePermiso';

function textoEstado(
  estado: EstadoPermiso
) {
  switch (estado) {
    case 'cargando':
      return 'Consultando...';

    case 'concedido':
      return 'Concedido';

    case 'preguntable':
      return 'Se puede solicitar';

    case 'bloqueado':
      return 'Bloqueado';
  }
}

function textoPlataforma() {
  if (Platform.OS === 'android') {
    return 'Android';
  }

  if (Platform.OS === 'ios') {
    return 'iOS';
  }

  return Platform.OS;
}

function TarjetaPermiso({
  nombre,
  descripcion,
  estado,
  recurso,
  detalle,
}: {
  nombre: string;
  descripcion: string;
  estado: EstadoPermiso;
  recurso:
    | 'camara'
    | 'ubicacion'
    | 'notificaciones';
  detalle?: string | null;
}) {
  const concedido =
    estado === 'concedido';

  const bloqueado =
    estado === 'bloqueado';

  return (
    <View style={styles.tarjeta}>
      <View style={styles.encabezadoTarjeta}>
        <Text style={styles.nombre}>
          {nombre}
        </Text>

        <View
          style={[
            styles.estadoBadge,

            concedido &&
              styles.estadoConcedido,

            bloqueado &&
              styles.estadoBloqueado,
          ]}
        >
          <Text
            style={[
              styles.estadoBadgeTexto,

              concedido &&
                styles.estadoConcedidoTexto,

              bloqueado &&
                styles.estadoBloqueadoTexto,
            ]}
          >
            {textoEstado(
              estado
            )}
          </Text>
        </View>
      </View>

      <Text style={styles.descripcion}>
        {descripcion}
      </Text>

      {detalle && (
        <View style={styles.detalle}>
          <Text
            style={
              styles.detalleTexto
            }
          >
            {detalle}
          </Text>
        </View>
      )}

      <Link
        href={{
          pathname:
            '/permisos/[recurso]',
          params: {
            recurso,
          },
        }}
        style={styles.link}
      >
        Administrar permiso
      </Link>
    </View>
  );
}

export default function PermisosScreen() {
  const camara =
    usePermiso(
      'camara'
    );

  const ubicacion =
    usePermiso(
      'ubicacion'
    );

  const notificaciones =
    usePermiso(
      'notificaciones'
    );

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.titulo}>
        Permisos
      </Text>

      <Text
        style={
          styles.descripcionPrincipal
        }
      >
        Consultá qué accesos tiene actualmente
        Mantenimiento IPF y administralos de forma
        individual.
      </Text>

      <View style={styles.plataforma}>
        <Text
          style={
            styles.plataformaLabel
          }
        >
          Plataforma
        </Text>

        <Text
          style={
            styles.plataformaValor
          }
        >
          {textoPlataforma()}
        </Text>
      </View>

      <TarjetaPermiso
        nombre="Cámara"
        descripcion="Se utiliza para leer el QR del aula y sacar fotografías del desperfecto."
        estado={
          camara.estado
        }
        recurso="camara"
      />

      <TarjetaPermiso
        nombre="Ubicación"
        descripcion="Se utiliza únicamente en primer plano para indicar dónde se encuentra el desperfecto."
        estado={
          ubicacion.estado
        }
        recurso="ubicacion"
        detalle={
          ubicacion.parcial
            ? ubicacion.detalleParcial
            : null
        }
      />

      <TarjetaPermiso
        nombre="Notificaciones"
        descripcion="Se utilizan para avisarte cuando uno de tus reportes es marcado como resuelto."
        estado={
          notificaciones.estado
        }
        recurso="notificaciones"
      />

      <View style={styles.info}>
        <Text style={styles.infoTitulo}>
          Sobre los permisos
        </Text>

        <Text style={styles.infoTexto}>
          Mantenimiento IPF solicita cada permiso
          solamente cuando necesitás utilizar la
          función correspondiente.
        </Text>
      </View>
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
      fontSize: 30,
      fontWeight: '800',
      color: '#17313d',
    },

    descripcionPrincipal: {
      color: '#6b7b83',
      lineHeight: 21,
    },

    plataforma: {
      backgroundColor:
        '#2f4652',
      padding: 16,
      borderRadius: 14,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    plataformaLabel: {
      color: '#dce4e8',
      fontWeight: '600',
    },

    plataformaValor: {
      color: '#ffffff',
      fontWeight: '800',
    },

    tarjeta: {
      backgroundColor:
        '#ffffff',
      padding: 18,
      borderRadius: 16,
      gap: 10,
    },

    encabezadoTarjeta: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      gap: 10,
    },

    nombre: {
      flex: 1,
      fontSize: 19,
      fontWeight: '800',
      color: '#17313d',
    },

    descripcion: {
      color: '#6b7b83',
      lineHeight: 20,
    },

    estadoBadge: {
      backgroundColor:
        '#fff3d6',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 20,
    },

    estadoBadgeTexto: {
      color: '#a86600',
      fontWeight: '700',
      fontSize: 12,
    },

    estadoConcedido: {
      backgroundColor:
        '#dff2dc',
    },

    estadoConcedidoTexto: {
      color: '#0f7d18',
    },

    estadoBloqueado: {
      backgroundColor:
        '#ffe1e1',
    },

    estadoBloqueadoTexto: {
      color: '#c83d4d',
    },

    detalle: {
      backgroundColor:
        '#fff3d6',
      padding: 10,
      borderRadius: 10,
    },

    detalleTexto: {
      color: '#a86600',
      fontWeight: '700',
    },

    link: {
      marginTop: 3,
      color: '#16a01d',
      fontWeight: '800',
    },

    info: {
      backgroundColor:
        '#ffffff',
      padding: 18,
      borderRadius: 16,
      marginTop: 5,
    },

    infoTitulo: {
      fontWeight: '800',
      color: '#17313d',
      marginBottom: 6,
    },

    infoTexto: {
      color: '#6b7b83',
      lineHeight: 20,
    },
  });