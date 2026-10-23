import {
  CameraView,
  CameraType,
} from 'expo-camera';

import * as ImagePicker from 'expo-image-picker';

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useRef,
  useState,
} from 'react';

import {
  usePermiso,
} from '@/hooks/usePermiso';

export default function FotoScreen() {
  const {
    estado,
    pedir,
    abrirAjustes,
  } = usePermiso('camara');

  const cameraRef =
    useRef<CameraView>(null);

  const [modoCamara, setModoCamara] =
    useState(false);

  const [foto, setFoto] =
    useState<string | null>(null);

  const [facing] =
    useState<CameraType>('back');

  async function elegirGaleria() {
    const resultado =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

    if (!resultado.canceled) {
      setFoto(
        resultado.assets[0].uri
      );
    }
  }

  async function abrirCamara() {
    if (estado === 'concedido') {
      setModoCamara(true);
      return;
    }

    if (estado === 'preguntable') {
      const concedido =
        await pedir();

      if (concedido) {
        setModoCamara(true);
      }

      return;
    }

    if (estado === 'bloqueado') {
      await abrirAjustes();
    }
  }

  async function sacarFoto() {
    if (!cameraRef.current) {
      return;
    }

    const resultado =
      await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

    if (!resultado) {
      return;
    }

    setFoto(resultado.uri);
    setModoCamara(false);
  }

  if (modoCamara) {
    return (
      <View style={styles.pantallaCamara}>
        <CameraView
          ref={cameraRef}
          style={styles.camara}
          facing={facing}
        />

        <View style={styles.controles}>
          <Pressable
            style={styles.botonFoto}
            onPress={sacarFoto}
          >
            <Text style={styles.botonFotoTexto}>
              Sacar foto
            </Text>
          </Pressable>

          <Pressable
            style={styles.botonCancelar}
            onPress={() =>
              setModoCamara(false)
            }
          >
            <Text
              style={
                styles.botonCancelarTexto
              }
            >
              Cancelar
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Adjuntar foto
      </Text>

      <Text style={styles.texto}>
        Podés sacar una foto del desperfecto
        o elegir una imagen desde tu dispositivo.
      </Text>

      {foto ? (
        <View style={styles.preview}>
          <Image
            source={{ uri: foto }}
            style={styles.imagen}
          />

          <Text style={styles.ok}>
            Imagen seleccionada
          </Text>
        </View>
      ) : (
        <View style={styles.sinFoto}>
          <Text style={styles.sinFotoTexto}>
            Todavía no seleccionaste ninguna imagen.
          </Text>
        </View>
      )}

      <Pressable
        style={styles.botonPrincipal}
        onPress={abrirCamara}
      >
        <Text style={styles.botonPrincipalTexto}>
          Sacar foto
        </Text>
      </Pressable>

      <Pressable
        style={styles.botonSecundario}
        onPress={elegirGaleria}
      >
        <Text style={styles.botonSecundarioTexto}>
          Elegir de la galería
        </Text>
      </Pressable>

      {estado === 'bloqueado' && (
        <Text style={styles.aviso}>
          La cámara está bloqueada. Podés habilitarla
          desde Ajustes o elegir una imagen de la galería.
        </Text>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 15,
      backgroundColor:
        '#f7f0dc',
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

    preview: {
      gap: 10,
    },

    imagen: {
      width: '100%',
      height: 280,
      borderRadius: 16,
      backgroundColor: '#ddd',
    },

    ok: {
      color: '#16a01d',
      fontWeight: '700',
      textAlign: 'center',
    },

    sinFoto: {
      backgroundColor:
        '#ffffff',
      padding: 30,
      borderRadius: 16,
      alignItems: 'center',
    },

    sinFotoTexto: {
      color: '#6b7b83',
      textAlign: 'center',
    },

    botonPrincipal: {
      backgroundColor:
        '#2f4652',
      padding: 16,
      borderRadius: 14,
      alignItems: 'center',
    },

    botonPrincipalTexto: {
      color: '#ffffff',
      fontWeight: '800',
    },

    botonSecundario: {
      backgroundColor:
        '#ffffff',
      padding: 16,
      borderRadius: 14,
      alignItems: 'center',
    },

    botonSecundarioTexto: {
      color: '#17313d',
      fontWeight: '700',
    },

    aviso: {
      backgroundColor:
        '#fff0f0',
      color: '#c83d4d',
      padding: 14,
      borderRadius: 12,
    },

    pantallaCamara: {
      flex: 1,
      backgroundColor:
        '#000000',
    },

    camara: {
      flex: 1,
    },

    controles: {
      backgroundColor:
        '#17313d',
      padding: 20,
      gap: 12,
    },

    botonFoto: {
      backgroundColor:
        '#16a01d',
      padding: 16,
      borderRadius: 14,
      alignItems: 'center',
    },

    botonFotoTexto: {
      color: '#ffffff',
      fontWeight: '800',
    },

    botonCancelar: {
      backgroundColor:
        '#ffffff',
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
    },

    botonCancelarTexto: {
      color: '#17313d',
      fontWeight: '700',
    },
  });