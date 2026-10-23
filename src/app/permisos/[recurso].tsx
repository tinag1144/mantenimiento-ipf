import {
  useLocalSearchParams,
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
  RecursoPermiso,
} from '@/lib/permisos';

import {
  usePermiso,
} from '@/hooks/usePermiso';

const textos: Record<
  RecursoPermiso,
  {
    titulo: string;
    beneficio: string;
  }
> = {
  camara: {
    titulo: 'Permiso de cámara',
    beneficio:
      'Usamos tu cámara para leer el QR del aula o sacar una foto del desperfecto.',
  },

  ubicacion: {
    titulo: 'Permiso de ubicación',
    beneficio:
      'Usamos tu ubicación para indicar dónde se encuentra el desperfecto dentro del Instituto.',
  },

  notificaciones: {
    titulo: 'Permiso de notificaciones',
    beneficio:
      'Usamos las notificaciones para avisarte cuando tu reporte se resuelve.',
  },
};

export default function PermisoRecursoScreen() {
  const {
    recurso,
  } =
    useLocalSearchParams<{
      recurso: string;
    }>();

  const recursoValido =
    recurso === 'camara' ||
    recurso === 'ubicacion' ||
    recurso === 'notificaciones';

  if (!recursoValido) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          El recurso solicitado no es válido.
        </Text>
      </View>
    );
  }

  return (
    <ContenidoPermiso
      recurso={recurso}
    />
  );
}

function ContenidoPermiso({
  recurso,
}: {
  recurso: RecursoPermiso;
}) {
  const {
    estado,
    parcial,
    detalleParcial,
    pedir,
    abrirAjustes,
  } = usePermiso(recurso);

  const info =
    textos[recurso];

  async function continuar() {
    const concedido =
      await pedir();

    if (concedido) {
      router.back();
    }
  }

  if (estado === 'cargando') {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator
          size="large"
          color="#2f4652"
        />

        <Text style={styles.cargando}>
          Consultando permiso...
        </Text>
      </View>
    );
  }

  if (estado === 'concedido') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>
          {info.titulo}
        </Text>

        <Text style={styles.concedido}>
          Permiso concedido
        </Text>

        {parcial && (
          <Text style={styles.parcial}>
            {detalleParcial}
          </Text>
        )}

        <Text style={styles.texto}>
          Este permiso ya está habilitado.
        </Text>

        <Pressable
          style={styles.botonSecundario}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={
              styles.botonSecundarioTexto
            }
          >
            Volver
          </Text>
        </Pressable>
      </View>
    );
  }

  if (estado === 'bloqueado') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>
          {info.titulo}
        </Text>

        <Text style={styles.bloqueado}>
          Permiso bloqueado
        </Text>

        <Text style={styles.texto}>
          Este permiso ya no puede
          solicitarse desde la app.
        </Text>

        <Text style={styles.texto}>
          Para habilitarlo, abrí los
          Ajustes del teléfono y
          permití el acceso para
          Mantenimiento IPF.
        </Text>

        <Pressable
          style={styles.boton}
          onPress={abrirAjustes}
        >
          <Text
            style={styles.botonTexto}
          >
            Abrir Ajustes
          </Text>
        </Pressable>

        <Text style={styles.aclaracion}>
          Cuando vuelvas a la app,
          volveremos a consultar el
          estado automáticamente.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {info.titulo}
      </Text>

      <Text style={styles.texto}>
        {info.beneficio}
      </Text>

      <Pressable
        style={styles.boton}
        onPress={continuar}
      >
        <Text style={styles.botonTexto}>
          Continuar
        </Text>
      </Pressable>

      <Text style={styles.aclaracion}>
        Podés cambiar este permiso
        más adelante desde los Ajustes
        del teléfono.
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 25,
      gap: 18,
      backgroundColor:
        '#f7f0dc',
    },

    centrado: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      fontSize: 16,
      color: '#6b7b83',
      lineHeight: 23,
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
      fontSize: 16,
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
      fontWeight: '800',
    },

    aclaracion: {
      fontSize: 13,
      color: '#6b7b83',
    },

    concedido: {
      color: '#16a01d',
      fontWeight: '800',
      fontSize: 18,
    },

    bloqueado: {
      color: '#c83d4d',
      fontWeight: '800',
      fontSize: 18,
    },

    parcial: {
      color: '#c27a00',
      fontWeight: '700',
    },

    cargando: {
      color: '#6b7b83',
    },

    error: {
      fontSize: 18,
      fontWeight: '700',
      color: '#c83d4d',
    },
  });