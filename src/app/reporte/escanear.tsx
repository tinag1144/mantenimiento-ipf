import {
  BarcodeScanningResult,
  CameraView,
} from 'expo-camera';

import {
  router,
} from 'expo-router';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useState,
} from 'react';

import {
  usePermiso,
} from '@/hooks/usePermiso';

import {
  useReportes,
} from '@/context/ReportesContext';

export default function EscanearScreen() {
  const {
    actualizarBorrador,
  } = useReportes();

  const {
    estado,
  } = usePermiso('camara');

  const [
    aulaManual,
    setAulaManual,
  ] = useState('');

  const [
    escaneado,
    setEscaneado,
  ] = useState(false);

  const [
    codigoDetectado,
    setCodigoDetectado,
  ] = useState('');

  function procesarQR(
    resultado: BarcodeScanningResult
  ) {
    if (escaneado) {
      return;
    }

    setEscaneado(true);
    setCodigoDetectado(
      resultado.data
    );
  }

  function usarCodigo() {
    if (
      codigoDetectado.trim() === ''
    ) {
      return;
    }

    actualizarBorrador({
      aula:
        codigoDetectado.trim(),
    });

    router.back();
  }

  function usarManual() {
    if (
      aulaManual.trim() === ''
    ) {
      return;
    }

    actualizarBorrador({
      aula:
        aulaManual.trim(),
    });

    router.back();
  }

  if (estado === 'cargando') {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator
          size="large"
          color="#2f4652"
        />

        <Text style={styles.texto}>
          Consultando permiso de cámara...
        </Text>
      </View>
    );
  }

  if (
    estado === 'preguntable' ||
    estado === 'bloqueado'
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>
          Escanear QR
        </Text>

        <Text style={styles.texto}>
          Para escanear el código del aula necesitás
          habilitar el acceso a la cámara.
        </Text>

        <Pressable
          style={styles.boton}
          onPress={() =>
            router.push(
              '/permisos/camara'
            )
          }
        >
          <Text style={styles.botonTexto}>
            Configurar cámara
          </Text>
        </Pressable>

        <CargaManual
          valor={aulaManual}
          onChange={setAulaManual}
          onUsar={usarManual}
        />
      </View>
    );
  }

  return (
    <View style={styles.pantallaCamara}>
      <CameraView
        style={styles.camara}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={
          escaneado
            ? undefined
            : procesarQR
        }
      />

      <View style={styles.panel}>
        {!escaneado ? (
          <>
            <Text style={styles.panelTitulo}>
              Escaneá el QR del aula
            </Text>

            <Text style={styles.panelTexto}>
              Apuntá la cámara al código QR.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.panelTitulo}>
              Código detectado
            </Text>

            <Text style={styles.codigo}>
              {codigoDetectado}
            </Text>

            <Pressable
              style={styles.boton}
              onPress={usarCodigo}
            >
              <Text style={styles.botonTexto}>
                Usar este código
              </Text>
            </Pressable>

            <Pressable
              style={styles.botonSecundario}
              onPress={() => {
                setEscaneado(false);
                setCodigoDetectado('');
              }}
            >
              <Text
                style={
                  styles.botonSecundarioTexto
                }
              >
                Escanear otra vez
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

function CargaManual({
  valor,
  onChange,
  onUsar,
}: {
  valor: string;
  onChange: (
    texto: string
  ) => void;
  onUsar: () => void;
}) {
  return (
    <View style={styles.manual}>
      <Text style={styles.subtitulo}>
        Alternativa manual
      </Text>

      <Text style={styles.texto}>
        Si no querés usar la cámara,
        escribí el código del aula.
      </Text>

      <TextInput
        placeholder="Ejemplo: AULA-12"
        value={valor}
        onChangeText={onChange}
        style={styles.input}
      />

      <Pressable
        style={styles.botonSecundario}
        onPress={onUsar}
      >
        <Text
          style={
            styles.botonSecundarioTexto
          }
        >
          Usar código escrito
        </Text>
      </Pressable>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 16,
      backgroundColor:
        '#f7f0dc',
    },

    centrado: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 15,
      padding: 20,
      backgroundColor:
        '#f7f0dc',
    },

    titulo: {
      fontSize: 28,
      fontWeight: '800',
      color: '#17313d',
    },

    subtitulo: {
      fontSize: 18,
      fontWeight: '800',
      color: '#17313d',
    },

    texto: {
      color: '#6b7b83',
      fontSize: 16,
      lineHeight: 22,
    },

    boton: {
      backgroundColor:
        '#16a01d',
      padding: 16,
      borderRadius: 14,
      alignItems: 'center',
    },

    botonTexto: {
      color: '#ffffff',
      fontWeight: '800',
    },

    botonSecundario: {
      backgroundColor:
        '#ffffff',
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
    },

    botonSecundarioTexto: {
      color: '#17313d',
      fontWeight: '700',
    },

    manual: {
      marginTop: 15,
      gap: 12,
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

    pantallaCamara: {
      flex: 1,
      backgroundColor:
        '#000000',
    },

    camara: {
      flex: 1,
    },

    panel: {
      backgroundColor:
        '#f7f0dc',
      padding: 20,
      gap: 12,
    },

    panelTitulo: {
      fontSize: 20,
      fontWeight: '800',
      color: '#17313d',
    },

    panelTexto: {
      color: '#6b7b83',
    },

    codigo: {
      fontSize: 18,
      fontWeight: '700',
      color: '#17313d',
      backgroundColor:
        '#ffffff',
      padding: 12,
      borderRadius: 10,
    },
  });