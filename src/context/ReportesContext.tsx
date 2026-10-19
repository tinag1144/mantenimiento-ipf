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

type NuevoReporte = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
};

type ReportesContextType = {
  reportes: Reporte[];

  crearReporte: (
    datos: NuevoReporte
  ) => Reporte;

  buscarReporte: (
    id: number
  ) => Reporte | undefined;

  resolverReporte: (
    id: number
  ) => void;
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

  function crearReporte(
    datos: NuevoReporte
  ): Reporte {
    const nuevoReporte: Reporte = {
      id: Date.now(),

      titulo: datos.titulo,
      descripcion: datos.descripcion,
      aula: datos.aula,
      categoria: datos.categoria,

      estado: 'pendiente',
    };

    setReportes((actuales) => [
      ...actuales,
      nuevoReporte,
    ]);

    return nuevoReporte;
  }

  function buscarReporte(
    id: number
  ) {
    return reportes.find(
      (reporte) => reporte.id === id
    );
  }

  function resolverReporte(
    id: number
  ) {
    setReportes((actuales) =>
      actuales.map((reporte) =>
        reporte.id === id
          ? {
              ...reporte,
              estado: 'resuelto',
            }
          : reporte
      )
    );
  }

  return (
    <ReportesContext.Provider
      value={{
        reportes,
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
    useContext(ReportesContext);

  if (!contexto) {
    throw new Error(
      'useReportes debe usarse dentro de ReportesProvider'
    );
  }

  return contexto;
}