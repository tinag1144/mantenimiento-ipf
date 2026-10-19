import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function EscanearScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Escanear aula
      </Text>

      <Text style={styles.texto}>
        Acá utilizaremos la cámara para leer el código
        QR pegado en la puerta del aula.
      </Text>

      <Text style={styles.aviso}>
        La cámara todavía no se activa automáticamente.
        Primero implementaremos el manejo de permisos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 15,
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

  aviso: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    color: '#2f4652',
  },
});