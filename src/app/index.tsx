import { Link } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function InicioScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        Mantenimiento IPF
      </Text>

      <Text style={styles.descripcion}>
        Reportá desperfectos del Instituto y seguí su estado.
      </Text>

      <View style={styles.lista}>
        <Link href="/reporte/nuevo" style={styles.link}>
          Nuevo reporte
        </Link>

        <Link href="/avisos" style={styles.link}>
          Avisos
        </Link>

        <Link href="/permisos" style={styles.link}>
          Permisos
        </Link>

        <Link href="/ajustes-app" style={styles.link}>
          Ajustes
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  descripcion: {
    fontSize: 16,
    color: '#666',
  },

  lista: {
    gap: 12,
  },

  link: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
});