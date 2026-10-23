import * as Location from 'expo-location';

import {
  router,
} from 'expo-router';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
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

const sectores = [
  'Patio',
  'Estacionamiento',
  'Pasillo',
];

export default function UbicacionScreen() {
  const {
    estado,
    parcial,
    detalleParcial,
    pedir,
    abrirAjustes,
  } = usePermiso('ubicacion');

  const {
    actualizarBorrador,
  } = useReportes();

  const [
    buscando,
    setBuscando,
  ] = useState(false);

  const [
    coordenadas,
    setCoordenadas,
  ] = useState<{
    latitud: number;
    longitud: number;
  } | null>(null);

  const [
    sector,
    setSector,
  ] = useState<string | null>(null);

async function obtenerUbicacion() {
  if (
    estado !== 'concedido'
  ) {
    router.push(
      '/permisos/ubicacion'
    );

    return;
  }

  try {
    setBuscando(true);

    const posicion =
      await Location.getCurrentPositionAsync({
        accuracy:
          Location.Accuracy.Balanced,
      });

    setCoordenadas({
      latitud:
        posicion.coords.latitude,

      longitud:
        posicion.coords.longitude,
    });

    setSector(null);
  } catch (error) {
    console.error(
      'Error obteniendo ubicación:',
      error
    );
  } finally {
    setBuscando(false);
  }
}

  function usarUbicacion() {
    if (!coordenadas) {
      return;
    }

    actualizarBorrador({
      latitud:
        coordenadas.latitud,

      longitud:
        coordenadas.longitud,

      sector: undefined,
    });

    router.back();
  }

  function usarSector() {
    if (!sector) {
      return;
    }

    actualizarBorrador({
      sector,

      latitud: undefined,
      longitud: undefined,
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
          Consultando permiso de ubicación...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Ubicación del problema
      </Text>

      <Text style={styles.texto}>
        Podés usar tu ubicación actual o indicar
        manualmente el sector donde se encuentra
        el desperfecto.
      </Text>

      {estado === 'concedido' && (
        <Pressable
          style={styles.botonPrincipal}
          onPress={obtenerUbicacion}
          disabled={buscando}
        >
          <Text
            style={
              styles.botonPrincipalTexto
            }
          >
            {buscando
              ? 'Buscando ubicación...'
              : 'Usar mi ubicación actual'}
          </Text>
        </Pressable>
      )}

  {estado === 'preguntable' && (
    <Pressable
      style={styles.botonPrincipal}
      onPress={() =>
        router.push(
          '/permisos/ubicacion'
        )
      }
    >
      <Text
        style={
          styles.botonPrincipalTexto
        }
      >
        Usar mi ubicación actual
      </Text>
    </Pressable>
  )}

{estado === 'bloqueado' && (
  <Pressable
    style={styles.botonAjustes}
    onPress={() =>
      router.push(
        '/permisos/ubicacion'
      )
    }
  >
    <Text
      style={
        styles.botonAjustesTexto
      }
    >
      Administrar ubicación
    </Text>
  </Pressable>
)}

      {coordenadas && (
        <>
          <View style={styles.resultado}>
            {parcial ? (
              <>
                <Text
                  style={
                    styles.resultadoTitulo
                  }
                >
                  {detalleParcial ??
                    'Ubicación aproximada'}
                </Text>

                <Text
                  style={
                    styles.resultadoTexto
                  }
                >
                  No mostramos coordenadas exactas
                  porque el dispositivo concedió
                  ubicación aproximada.
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={
                    styles.resultadoTitulo
                  }
                >
                  Ubicación obtenida
                </Text>

                <Text
                  style={
                    styles.resultadoTexto
                  }
                >
                  Latitud:{' '}
                  {coordenadas.latitud.toFixed(6)}
                </Text>

                <Text
                  style={
                    styles.resultadoTexto
                  }
                >
                  Longitud:{' '}
                  {coordenadas.longitud.toFixed(6)}
                </Text>
              </>
            )}
          </View>

          <Pressable
            style={styles.botonPrincipal}
            onPress={usarUbicacion}
          >
            <Text
              style={
                styles.botonPrincipalTexto
              }
            >
              Usar esta ubicación
            </Text>
          </Pressable>
        </>
      )}

      <View style={styles.separador} />

      <Text style={styles.subtitulo}>
        Elegir sector manualmente
      </Text>

      <Text style={styles.texto}>
        Esta opción siempre está disponible aunque
        no quieras compartir tu ubicación.
      </Text>

      {sectores.map((opcion) => {
        const seleccionado =
          sector === opcion;

        return (
          <Pressable
            key={opcion}
            style={[
              styles.sector,

              seleccionado &&
                styles.sectorSeleccionado,
            ]}
            onPress={() => {
              setSector(opcion);
              setCoordenadas(null);
            }}
          >
            <Text
              style={[
                styles.sectorTexto,

                seleccionado &&
                  styles.sectorTextoSeleccionado,
              ]}
            >
              {opcion}
            </Text>
          </Pressable>
        );
      })}

      {sector && (
        <>
          <View style={styles.resultado}>
            <Text
              style={
                styles.resultadoTitulo
              }
            >
              Sector seleccionado
            </Text>

            <Text
              style={
                styles.resultadoTexto
              }
            >
              {sector}
            </Text>
          </View>

          <Pressable
            style={styles.botonPrincipal}
            onPress={usarSector}
          >
            <Text
              style={
                styles.botonPrincipalTexto
              }
            >
              Usar este sector
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 14,
      backgroundColor:
        '#f7f0dc',
    },

    centrado: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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

    subtitulo: {
      fontSize: 19,
      fontWeight: '800',
      color: '#17313d',
    },

    texto: {
      color: '#6b7b83',
      lineHeight: 22,
    },

    botonPrincipal: {
      backgroundColor:
        '#16a01d',
      padding: 16,
      borderRadius: 14,
      alignItems: 'center',
    },

    botonPrincipalTexto: {
      color: '#ffffff',
      fontWeight: '800',
    },

    botonAjustes: {
      backgroundColor:
        '#2f4652',
      padding: 16,
      borderRadius: 14,
      alignItems: 'center',
    },

    botonAjustesTexto: {
      color: '#ffffff',
      fontWeight: '800',
    },

    aviso: {
      backgroundColor:
        '#ffffff',
      padding: 14,
      borderRadius: 12,
      color: '#17313d',
    },

    error: {
      backgroundColor:
        '#fff0f0',
      color: '#c83d4d',
      padding: 14,
      borderRadius: 12,
      fontWeight: '700',
    },

    resultado: {
      backgroundColor:
        '#ffffff',
      padding: 16,
      borderRadius: 14,
      gap: 4,
    },

    resultadoTitulo: {
      fontWeight: '800',
      color: '#17313d',
    },

    resultadoTexto: {
      color: '#6b7b83',
    },

    separador: {
      height: 1,
      backgroundColor:
        '#e3dccb',
      marginVertical: 5,
    },

    sector: {
      backgroundColor:
        '#ffffff',
      borderWidth: 1,
      borderColor:
        '#e3dccb',
      borderRadius: 12,
      padding: 15,
    },

    sectorSeleccionado: {
      backgroundColor:
        '#2f4652',
      borderColor:
        '#2f4652',
    },

    sectorTexto: {
      color: '#17313d',
      fontWeight: '600',
    },

    sectorTextoSeleccionado: {
      color: '#ffffff',
      fontWeight: '800',
    },
  });