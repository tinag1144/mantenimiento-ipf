import { useLocalSearchParams } from 'expo-router';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PermisoRecursoScreen() {
  const { recurso } = useLocalSearchParams<{
    recurso: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Permiso de {recurso}
      </Text>

      <Text style={styles.texto}>
        Antes de solicitar el permiso, acá vamos a
        explicar claramente para qué lo necesita
        Mantenimiento IPF.
      </Text>

      <Pressable style={styles.boton}>
        <Text style={styles.botonTexto}>
          Continuar
        </Text>
      </Pressable>

      <Text style={styles.aclaracion}>
        Podés cambiar este permiso más adelante desde
        los Ajustes del teléfono.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    gap: 18,
    backgroundColor: '#f7f0dc',
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17313d',
  },

  texto: {
    fontSize: 16,
    color: '#6b7b83',
    lineHeight: 23,
  },

  boton: {
    backgroundColor: '#16a01d',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  botonTexto: {
    color: '#ffffff',
    fontWeight: '800',
  },

  aclaracion: {
    fontSize: 13,
    color: '#6b7b83',
  },
});