import { router } from 'expo-router';

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
    crearReporte,
  } = useReportes();

  const [titulo, setTitulo] =
    useState('');

  const [
    descripcion,
    setDescripcion,
  ] = useState('');

  const [aula, setAula] =
    useState('');

  const [
    categoria,
    setCategoria,
  ] =
    useState<CategoriaReporte>(
      'electricidad'
    );

  const [
    error,
    setError,
  ] = useState('');

  function guardar() {
    if (
      titulo.trim() === '' ||
      descripcion.trim() === '' ||
      aula.trim() === ''
    ) {
      setError(
        'Completá título, descripción y aula.'
      );

      return;
    }

    const reporte =
      crearReporte({
        titulo: titulo.trim(),
        descripcion:
          descripcion.trim(),
        aula: aula.trim(),
        categoria,
      });

    router.replace({
      pathname: '/reporte/[id]',
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
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        multiline
        value={descripcion}
        onChangeText={
          setDescripcion
        }
        style={[
          styles.input,
          styles.descripcion,
        ]}
      />

      <TextInput
        placeholder="Aula"
        value={aula}
        onChangeText={setAula}
        style={styles.input}
      />

      <Text style={styles.subtitulo}>
        Categoría
      </Text>

      <View style={styles.categorias}>
        {categorias.map(
          (opcion) => {
            const seleccionada =
              categoria === opcion;

            return (
              <Pressable
                key={opcion}
                onPress={() =>
                  setCategoria(
                    opcion
                  )
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
        style={styles.botonSecundario}
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

      <Pressable
        style={styles.botonSecundario}
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

      <Pressable
        style={styles.botonSecundario}
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

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <Pressable
        style={styles.botonGuardar}
        onPress={guardar}
      >
        <Text
          style={styles.botonGuardarTexto}
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

    categoriaTextoSeleccionada:
      {
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

    error: {
      color: '#c83d4d',
      fontWeight: '700',
    },
  });