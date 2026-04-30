export function toLower(val) {
  if (val === null || val === undefined) return val
  if (Array.isArray(val)) return val.map(toLower)
  if (typeof val === 'object') {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k.toLowerCase(), toLower(v)])
    )
  }
  return val
}

export function unwrap(payload) {
  if (!payload) return payload
  if (Array.isArray(payload)) return payload.map(toLower)
  if (typeof payload === 'object') {
    if (Array.isArray(payload.data)) return payload.data.map(toLower)
    if (Array.isArray(payload.items)) return payload.items.map(toLower)
    if (Array.isArray(payload.rows)) return payload.rows.map(toLower)
    return toLower(payload)
  }
  return payload
}