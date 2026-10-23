import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

import {
  CategoriaReporte,
  Reporte,
} from '@/types/Reporte';

type BorradorReporte = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;

  foto?: string;

  latitud?: number;
  longitud?: number;

  sector?: string;
};

type ReportesContextType = {
  reportes: Reporte[];

  borrador: BorradorReporte;

  actualizarBorrador: (
    datos: Partial<BorradorReporte>
  ) => void;

  limpiarBorrador: () => void;

  crearReporte: () => Reporte;

  buscarReporte: (
    id: number
  ) => Reporte | undefined;

  resolverReporte: (
    id: number
  ) => void;
};

const borradorInicial: BorradorReporte = {
  titulo: '',
  descripcion: '',
  aula: '',
  categoria: 'electricidad',
};

const ReportesContext =
  createContext<ReportesContextType | null>(
    null
  );

export function ReportesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [reportes, setReportes] =
    useState<Reporte[]>([]);

  const [borrador, setBorrador] =
    useState<BorradorReporte>(
      borradorInicial
    );

  function actualizarBorrador(
    datos: Partial<BorradorReporte>
  ) {
    setBorrador((actual) => ({
      ...actual,
      ...datos,
    }));
  }

  function limpiarBorrador() {
    setBorrador(
      borradorInicial
    );
  }

  function crearReporte(): Reporte {
    const nuevoReporte: Reporte = {
      id: Date.now(),

      titulo: borrador.titulo,
      descripcion:
        borrador.descripcion,
      aula: borrador.aula,
      categoria:
        borrador.categoria,

      estado: 'pendiente',

      foto: borrador.foto,

      latitud:
        borrador.latitud,

      longitud:
        borrador.longitud,

      sector:
        borrador.sector,
    };

    setReportes((actuales) => [
      ...actuales,
      nuevoReporte,
    ]);

    limpiarBorrador();

    return nuevoReporte;
  }

  function buscarReporte(
    id: number
  ) {
    return reportes.find(
      (reporte) =>
        reporte.id === id
    );
  }

  function resolverReporte(
    id: number
  ) {
    setReportes((actuales) =>
      actuales.map(
        (reporte) =>
          reporte.id === id
            ? {
                ...reporte,
                estado:
                  'resuelto',
              }
            : reporte
      )
    );
  }

  return (
    <ReportesContext.Provider
      value={{
        reportes,

        borrador,
        actualizarBorrador,
        limpiarBorrador,

        crearReporte,
        buscarReporte,
        resolverReporte,
      }}
    >
      {children}
    </ReportesContext.Provider>
  );
}

export function useReportes() {
  const contexto =
    useContext(
      ReportesContext
    );

  if (!contexto) {
    throw new Error(
      'useReportes debe usarse dentro de ReportesProvider'
    );
  }

  return contexto;
}