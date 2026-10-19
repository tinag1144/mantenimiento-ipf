import {
  Link,
} from 'expo-router';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useReportes,
} from '@/context/ReportesContext';

export default function InicioScreen() {
  const {
    reportes,
  } = useReportes();

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <View
        style={
          styles.encabezado
        }
      >
        <Text style={styles.titulo}>
          Mantenimiento IPF
        </Text>

        <Text
          style={
            styles.descripcion
          }
        >
          Reportá desperfectos del
          Instituto y consultá su
          estado.
        </Text>
      </View>

      <Link
        href="/reporte/nuevo"
        style={
          styles.botonPrincipal
        }
      >
        + Nuevo reporte
      </Link>

      <Text
        style={styles.subtitulo}
      >
        Mis reportes
      </Text>

      {reportes.length === 0 ? (
        <View style={styles.vacio}>
          <Text
            style={
              styles.vacioTitulo
            }
          >
            Todavía no hay reportes
          </Text>

          <Text
            style={
              styles.vacioTexto
            }
          >
            Cuando crees uno,
            aparecerá acá junto con
            su estado.
          </Text>
        </View>
      ) : (
        reportes.map(
          (reporte) => (
            <Link
              key={reporte.id}
              href={{
                pathname:
                  '/reporte/[id]',

                params: {
                  id: reporte.id.toString(),
                },
              }}
              style={
                styles.reporte
              }
            >
              <View>
                <Text
                  style={
                    styles.reporteTitulo
                  }
                >
                  {reporte.titulo}
                </Text>

                <Text
                  style={
                    styles.reporteDato
                  }
                >
                  Aula: {reporte.aula}
                </Text>

                <Text
                  style={
                    styles.reporteDato
                  }
                >
                  Categoría:{' '}
                  {reporte.categoria}
                </Text>

                <Text
                  style={
                    styles.estado
                  }
                >
                  Estado:{' '}
                  {reporte.estado}
                </Text>
              </View>
            </Link>
          )
        )
      )}

      <Link
        href="/ajustes-app"
        style={styles.link}
      >
        Ajustes de la aplicación
      </Link>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor:
        '#f7f0dc',
      padding: 20,
      gap: 16,
    },

    encabezado: {
      gap: 6,
    },

    titulo: {
      fontSize: 30,
      fontWeight: '800',
      color: '#17313d',
    },

    descripcion: {
      fontSize: 16,
      color: '#6b7b83',
      lineHeight: 22,
    },

    botonPrincipal: {
      backgroundColor:
        '#16a01d',
      color: '#ffffff',
      padding: 16,
      borderRadius: 14,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '700',
      overflow: 'hidden',
    },

    subtitulo: {
      fontSize: 21,
      fontWeight: '700',
      color: '#17313d',
    },

    vacio: {
      backgroundColor:
        '#ffffff',
      padding: 25,
      borderRadius: 16,
    },

    vacioTitulo: {
      fontSize: 17,
      fontWeight: '700',
      color: '#17313d',
    },

    vacioTexto: {
      marginTop: 5,
      color: '#6b7b83',
      lineHeight: 20,
    },

    reporte: {
      backgroundColor:
        '#ffffff',
      padding: 18,
      borderRadius: 16,
      overflow: 'hidden',
    },

    reporteTitulo: {
      fontSize: 18,
      fontWeight: '800',
      color: '#17313d',
    },

    reporteDato: {
      color: '#6b7b83',
      marginTop: 4,
    },

    estado: {
      marginTop: 8,
      color: '#16a01d',
      fontWeight: '700',
    },

    link: {
      backgroundColor:
        '#ffffff',
      color: '#2f4652',
      padding: 15,
      borderRadius: 12,
      fontWeight: '700',
      overflow: 'hidden',
    },
  });