import {
  useLocalSearchParams,
} from 'expo-router';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useReportes,
} from '@/context/ReportesContext';

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
  } = useReportes();

  const numeroId =
    Number(id);

  if (
    Number.isNaN(numeroId)
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          El identificador del reporte
          no es válido.
        </Text>
      </View>
    );
  }

  const reporte =
    buscarReporte(numeroId);

  if (!reporte) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          El reporte no existe.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

        <Text style={styles.estado}>
          {reporte.estado}
        </Text>
      </View>

      {reporte.estado !==
        'resuelto' && (
        <Pressable
          style={
            styles.boton
          }
          onPress={() =>
            resolverReporte(
              reporte.id
            )
          }
        >
          <Text
            style={
              styles.botonTexto
            }
          >
            Simular resolución
          </Text>
        </Pressable>
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

    tarjeta: {
      backgroundColor:
        '#ffffff',
      borderRadius: 16,
      padding: 18,
      gap: 5,
    },

    label: {
      marginTop: 9,
      fontWeight: '800',
      color: '#17313d',
    },

    texto: {
      color: '#6b7b83',
    },

    estado: {
      color: '#16a01d',
      fontWeight: '800',
      textTransform:
        'capitalize',
    },

    capitalize: {
      textTransform:
        'capitalize',
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
    },

    error: {
      fontSize: 18,
      color: '#c83d4d',
      fontWeight: '700',
    },
  });