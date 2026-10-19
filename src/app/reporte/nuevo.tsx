import { Link } from 'expo-router';

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function NuevoReporteScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.titulo}>
        Nuevo reporte
      </Text>

      <TextInput
        placeholder="Título"
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        multiline
        style={[styles.input, styles.descripcion]}
      />

      <TextInput
        placeholder="Aula"
        style={styles.input}
      />

      <Text style={styles.subtitulo}>
        Categoría
      </Text>

      <View style={styles.categorias}>
        <Text style={styles.categoria}>
          Electricidad
        </Text>

        <Text style={styles.categoria}>
          Agua
        </Text>

        <Text style={styles.categoria}>
          Mobiliario
        </Text>

        <Text style={styles.categoria}>
          Equipos
        </Text>
      </View>

      <Text style={styles.subtitulo}>
        Herramientas
      </Text>

      <Link
        href="/reporte/escanear"
        style={styles.boton}
      >
        Escanear QR del aula
      </Link>

      <Link
        href="/reporte/foto"
        style={styles.boton}
      >
        Adjuntar foto
      </Link>

      <Link
        href="/reporte/ubicacion"
        style={styles.boton}
      >
        Marcar ubicación
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 14,
    backgroundColor: '#f7f0dc',
    flexGrow: 1,
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17313d',
  },

  subtitulo: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: '700',
    color: '#17313d',
  },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3dccb',
    borderRadius: 12,
    padding: 14,
  },

  descripcion: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  categorias: {
    gap: 8,
  },

  categoria: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    color: '#17313d',
  },

  boton: {
    backgroundColor: '#2f4652',
    color: '#ffffff',
    padding: 15,
    borderRadius: 12,
    textAlign: 'center',
    fontWeight: '700',
    overflow: 'hidden',
  },
});