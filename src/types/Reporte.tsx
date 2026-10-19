export type CategoriaReporte =
  | 'electricidad'
  | 'agua'
  | 'mobiliario'
  | 'equipos';

export type EstadoReporte =
  | 'pendiente'
  | 'en curso'
  | 'resuelto';

export type Reporte = {
  id: number;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  estado: EstadoReporte;

  foto?: string;

  latitud?: number;
  longitud?: number;

  sector?: string;
};