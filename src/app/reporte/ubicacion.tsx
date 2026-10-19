import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function UbicacionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Ubicación
      </Text>

      <Text style={styles.texto}>
        Podrás utilizar tu ubicación actual para indicar
        dónde se encuentra el desperfecto.
      </Text>

      <Text style={styles.subtitulo}>
        Alternativa manual
      </Text>

      <View style={styles.opcion}>
        <Text>Patio</Text>
      </View>

      <View style={styles.opcion}>
        <Text>Estacionamiento</Text>
      </View>

      <View style={styles.opcion}>
        <Text>Pasillo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: '#f7f0dc',
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

  subtitulo: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#17313d',
  },

  opcion: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
  },
});