import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function FotoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Adjuntar foto
      </Text>

      <Text style={styles.texto}>
        Podrás sacar una fotografía del desperfecto o
        elegir una imagen existente.
      </Text>

      <View style={styles.boton}>
        <Text style={styles.botonTexto}>
          Sacar foto
        </Text>
      </View>

      <View style={styles.botonSecundario}>
        <Text style={styles.botonSecundarioTexto}>
          Elegir de la galería
        </Text>
      </View>
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

  boton: {
    backgroundColor: '#2f4652',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  botonTexto: {
    color: '#ffffff',
    fontWeight: '700',
  },

  botonSecundario: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  botonSecundarioTexto: {
    color: '#2f4652',
    fontWeight: '700',
  },
});