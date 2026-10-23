import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Link } from 'expo-router';

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

export default function PermisosScreen() {
  const camara =
    usePermiso('camara');

  const ubicacion =
    usePermiso('ubicacion');

  const notificaciones =
    usePermiso('notificaciones');

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.titulo}>
        Permisos
      </Text>

      <Text style={styles.plataforma}>
        Plataforma: {Platform.OS}
      </Text>

      <View style={styles.tarjeta}>
        <Text style={styles.nombre}>
          Cámara
        </Text>

        <Text style={styles.estado}>
          {textoEstado(camara.estado)}
        </Text>

        <Link
          href="/permisos/camara"
          style={styles.link}
        >
          Administrar permiso
        </Link>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.nombre}>
          Ubicación
        </Text>

        <Text style={styles.estado}>
          {textoEstado(
            ubicacion.estado
          )}
        </Text>

        {ubicacion.parcial && (
          <Text style={styles.parcial}>
            {ubicacion.detalleParcial}
          </Text>
        )}

        <Link
          href="/permisos/ubicacion"
          style={styles.link}
        >
          Administrar permiso
        </Link>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.nombre}>
          Notificaciones
        </Text>

        <Text style={styles.estado}>
          {textoEstado(
            notificaciones.estado
          )}
        </Text>

        <Link
          href="/permisos/notificaciones"
          style={styles.link}
        >
          Administrar permiso
        </Link>
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

    plataforma: {
      color: '#6b7b83',
      marginBottom: 5,
    },

    tarjeta: {
      backgroundColor:
        '#ffffff',
      padding: 18,
      borderRadius: 16,
      gap: 7,
    },

    nombre: {
      fontSize: 19,
      fontWeight: '800',
      color: '#17313d',
    },

    estado: {
      color: '#6b7b83',
    },

    parcial: {
      color: '#c27a00',
      fontWeight: '700',
    },

    link: {
      marginTop: 7,
      color: '#16a01d',
      fontWeight: '700',
    },
  });