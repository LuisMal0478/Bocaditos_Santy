/**
 * Utilidades de formateo para moneda, fechas y texto.
 */

export function formatearMoneda(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') {
    return 'Precio por cotizar';
  }
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  if (isNaN(numero) || numero <= 0) {
    return 'Precio por cotizar';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(numero);
}

export function formatearFecha(fechaStr: string | undefined): string {
  if (!fechaStr) return '';
  const [año, mes, dia] = fechaStr.split('-');
  if (!año || !mes || !dia) return fechaStr;
  return `${dia}/${mes}/${año}`;
}

export function formatearFechaLarga(fechaStr: string | undefined): string {
  if (!fechaStr) return '';
  try {
    const fecha = new Date(`${fechaStr}T00:00:00`);
    return new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(fecha);
  } catch {
    return fechaStr;
  }
}

