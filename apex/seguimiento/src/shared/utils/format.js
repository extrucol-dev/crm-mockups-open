const COP = new Intl.NumberFormat('es-CO', { currency: 'COP' })

export function fmtCurrency(n) {
  if (n == null) return ''
  return COP.format(n)
}

export function fmtCompact(n) {
  if (n == null) return ''
  return `$ ${(n / 1_000_000).toFixed(0)} M`
}

export function fmtPercent(n) {
  if (n == null) return ''
  return new Intl.NumberFormat('es-CO', { style: 'percent', maximumFractionDigits: 1 }).format(n / 100)
}

export function fmtDate(str) {
  if (!str) return ''
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date(str))
}

export function fmtDateShort(str) {
  if (!str) return ''
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short' }).format(new Date(str))
}