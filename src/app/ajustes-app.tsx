import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

export default function AjustesAppScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Ajustes
      </Text>

      <View style={styles.opcion}>
        <View style={styles.textos}>
          <Text style={styles.nombre}>
            Avisarme cuando se resuelva mi reporte
          </Text>

          <Text style={styles.descripcion}>
            Activa las notificaciones de resolución.
          </Text>
        </View>

        <Switch value={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f0dc',
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17313d',
    marginBottom: 20,
  },

  opcion: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  textos: {
    flex: 1,
  },

  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17313d',
  },

  descripcion: {
    marginTop: 4,
    color: '#6b7b83',
  },
});