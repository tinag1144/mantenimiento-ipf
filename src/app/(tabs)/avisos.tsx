import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useReportes,
} from '@/context/ReportesContext';

export default function AvisosScreen() {
  const {
    avisos,
  } =
    useReportes();

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.titulo}>
        Avisos
      </Text>

      <Text style={styles.descripcion}>
        Acá podés consultar las novedades de tus reportes.
      </Text>

      {avisos.length === 0 ? (
        <View style={styles.vacio}>
          <Text
            style={
              styles.vacioTitulo
            }
          >
            No hay avisos
          </Text>

          <Text
            style={
              styles.vacioTexto
            }
          >
            Cuando haya novedades sobre tus reportes van a aparecer acá.
          </Text>
        </View>
      ) : (
        avisos.map(
          (aviso) => (
            <View
              key={aviso.id}
              style={
                styles.aviso
              }
            >
              <Text
                style={
                  styles.avisoTitulo
                }
              >
                {aviso.titulo}
              </Text>

              <Text
                style={
                  styles.avisoMensaje
                }
              >
                {aviso.mensaje}
              </Text>

              <Text
                style={
                  styles.fecha
                }
              >
                {aviso.fecha.toLocaleTimeString(
                  [],
                  {
                    hour:
                      '2-digit',
                    minute:
                      '2-digit',
                  }
                )}
              </Text>
            </View>
          )
        )
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      gap: 14,
      backgroundColor:
        '#f7f0dc',
    },

    titulo: {
      fontSize: 28,
      fontWeight: '800',
      color: '#17313d',
    },

    descripcion: {
      color: '#6b7b83',
      lineHeight: 21,
    },

    vacio: {
      backgroundColor:
        '#ffffff',
      padding: 25,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 10,
    },

    vacioTitulo: {
      color: '#17313d',
      fontWeight: '800',
      fontSize: 17,
    },

    vacioTexto: {
      marginTop: 5,
      color: '#6b7b83',
      textAlign: 'center',
    },

    aviso: {
      backgroundColor:
        '#ffffff',
      borderRadius: 16,
      padding: 17,
      gap: 6,
    },

    avisoTitulo: {
      color: '#17313d',
      fontWeight: '800',
      fontSize: 17,
    },

    avisoMensaje: {
      color: '#6b7b83',
      lineHeight: 20,
    },

    fecha: {
      marginTop: 5,
      color: '#8b969b',
      fontSize: 12,
    },
  });