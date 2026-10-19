import { Link } from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.numero}>
        404
      </Text>

      <Text style={styles.titulo}>
        Pantalla no encontrada
      </Text>

      <Link
        href="/"
        style={styles.link}
      >
        Volver al inicio
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f0dc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  numero: {
    fontSize: 55,
    fontWeight: '900',
    color: '#2f4652',
  },

  titulo: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '700',
    color: '#17313d',
  },

  link: {
    marginTop: 20,
    backgroundColor: '#16a01d',
    color: '#ffffff',
    padding: 14,
    borderRadius: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
});