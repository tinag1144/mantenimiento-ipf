import {
  router,
} from 'expo-router';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  CategoriaReporte,
} from '@/types/Reporte';

import {
  useReportes,
} from '@/context/ReportesContext';

import {
  useState,
} from 'react';

const categorias: CategoriaReporte[] = [
  'electricidad',
  'agua',
  'mobiliario',
  'equipos',
];

export default function NuevoReporteScreen() {
  const {
    borrador,
    actualizarBorrador,
    crearReporte,
  } = useReportes();

  const [
    error,
    setError,
  ] = useState('');

  function guardar() {
    if (
      borrador.titulo.trim() === '' ||
      borrador.descripcion.trim() === '' ||
      borrador.aula.trim() === ''
    ) {
      setError(
        'Completá título, descripción y aula.'
      );

      return;
    }

    const reporte =
      crearReporte();

    router.replace({
      pathname:
        '/reporte/[id]',

      params: {
        id: reporte.id.toString(),
      },
    });
  }

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.titulo}>
        Nuevo reporte
      </Text>

      <TextInput
        placeholder="Título"
        value={borrador.titulo}
        onChangeText={(texto) =>
          actualizarBorrador({
            titulo: texto,
          })
        }
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        multiline
        value={
          borrador.descripcion
        }
        onChangeText={(texto) =>
          actualizarBorrador({
            descripcion:
              texto,
          })
        }
        style={[
          styles.input,
          styles.descripcion,
        ]}
      />

      <TextInput
        placeholder="Aula"
        value={borrador.aula}
        onChangeText={(texto) =>
          actualizarBorrador({
            aula: texto,
          })
        }
        style={styles.input}
      />

      <Text style={styles.subtitulo}>
        Categoría
      </Text>

      <View
        style={
          styles.categorias
        }
      >
        {categorias.map(
          (opcion) => {
            const seleccionada =
              borrador.categoria ===
              opcion;

            return (
              <Pressable
                key={opcion}
                onPress={() =>
                  actualizarBorrador({
                    categoria:
                      opcion,
                  })
                }
                style={[
                  styles.categoria,

                  seleccionada &&
                    styles.categoriaSeleccionada,
                ]}
              >
                <Text
                  style={[
                    styles.categoriaTexto,

                    seleccionada &&
                      styles.categoriaTextoSeleccionada,
                  ]}
                >
                  {opcion}
                </Text>
              </Pressable>
            );
          }
        )}
      </View>

      <Text style={styles.subtitulo}>
        Herramientas
      </Text>

      <Pressable
        style={
          styles.botonSecundario
        }
        onPress={() =>
          router.push(
            '/reporte/escanear'
          )
        }
      >
        <Text
          style={
            styles.botonSecundarioTexto
          }
        >
          Escanear QR del aula
        </Text>
      </Pressable>

      {borrador.aula !== '' && (
        <Text style={styles.ok}>
          Aula: {borrador.aula}
        </Text>
      )}

      <Pressable
        style={
          styles.botonSecundario
        }
        onPress={() =>
          router.push(
            '/reporte/foto'
          )
        }
      >
        <Text
          style={
            styles.botonSecundarioTexto
          }
        >
          Adjuntar foto
        </Text>
      </Pressable>

      {borrador.foto && (
        <Text style={styles.ok}>
          ✓ Foto adjuntada
        </Text>
      )}

      <Pressable
        style={
          styles.botonSecundario
        }
        onPress={() =>
          router.push(
            '/reporte/ubicacion'
          )
        }
      >
        <Text
          style={
            styles.botonSecundarioTexto
          }
        >
          Marcar ubicación
        </Text>
      </Pressable>

      {(borrador.sector ||
        borrador.latitud !==
          undefined) && (
        <Text style={styles.ok}>
          ✓ Ubicación cargada
        </Text>
      )}

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <Pressable
        style={
          styles.botonGuardar
        }
        onPress={guardar}
      >
        <Text
          style={
            styles.botonGuardarTexto
          }
        >
          Crear reporte
        </Text>
      </Pressable>
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

    subtitulo: {
      marginTop: 5,
      fontSize: 17,
      fontWeight: '700',
      color: '#17313d',
    },

    input: {
      backgroundColor:
        '#ffffff',
      borderWidth: 1,
      borderColor:
        '#e3dccb',
      borderRadius: 12,
      padding: 14,
    },

    descripcion: {
      minHeight: 100,
      textAlignVertical:
        'top',
    },

    categorias: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    categoria: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor:
        '#ffffff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor:
        '#e3dccb',
    },

    categoriaSeleccionada: {
      backgroundColor:
        '#2f4652',
    },

    categoriaTexto: {
      color: '#17313d',
      textTransform:
        'capitalize',
    },

    categoriaTextoSeleccionada: {
      color: '#ffffff',
      fontWeight: '700',
    },

    botonSecundario: {
      backgroundColor:
        '#ffffff',
      borderRadius: 12,
      padding: 15,
    },

    botonSecundarioTexto: {
      color: '#2f4652',
      fontWeight: '700',
      textAlign: 'center',
    },

    botonGuardar: {
      marginTop: 8,
      backgroundColor:
        '#16a01d',
      padding: 16,
      borderRadius: 14,
      alignItems: 'center',
    },

    botonGuardarTexto: {
      color: '#ffffff',
      fontWeight: '800',
      fontSize: 16,
    },

    ok: {
      color: '#0f7d18',
      fontWeight: '700',
    },

    error: {
      color: '#c83d4d',
      fontWeight: '700',
    },
  });