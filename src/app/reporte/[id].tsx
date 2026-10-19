import { useLocalSearchParams } from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function DetalleReporteScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Reporte #{id}
      </Text>

      <Text style={styles.texto}>
        Más adelante vamos a buscar el reporte por este
        identificador y validar si existe.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f0dc',
    padding: 20,
    gap: 12,
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17313d',
  },

  texto: {
    color: '#6b7b83',
    lineHeight: 22,
  },
});