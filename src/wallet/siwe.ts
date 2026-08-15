export type SiweFields = {
  domain: string | undefined
  address: string | undefined
  statement: string | undefined
  uri: string | undefined
  chain: string | undefined
  nonce: string | undefined
  issuedAt: string | undefined
  expiration: string | undefined
}

function emptyFields(): SiweFields {
  return {
    domain: undefined,
    address: undefined,
    statement: undefined,
    uri: undefined,
    chain: undefined,
    nonce: undefined,
    issuedAt: undefined,
    expiration: undefined,
  }
}

function fieldValue(body: string, label: string): string | undefined {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = body.match(new RegExp(`^${escaped}:\\s*(.*)$`, 'm'))
  const value = match?.[1]?.trim()
  return value && value.length > 0 ? value : undefined
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined
  }
  return value as Record<string, unknown>
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function fieldsFromAuthPayload(payload: Record<string, unknown>): SiweFields {
  const chains = payload.chains
  const chainFromList =
    Array.isArray(chains) && typeof chains[0] === 'string' ? chains[0] : undefined
  return {
    domain: readString(payload, 'domain'),
    address: readString(payload, 'address'),
    statement: readString(payload, 'statement'),
    uri: readString(payload, 'uri') ?? readString(payload, 'aud'),
    chain: readString(payload, 'chain') ?? chainFromList,
    nonce: readString(payload, 'nonce'),
    issuedAt: readString(payload, 'issuedAt') ?? readString(payload, 'iat'),
    expiration: readString(payload, 'expiration') ?? readString(payload, 'exp'),
  }
}

export function parseSiweMessage(message: string): SiweFields {
  const fields = emptyFields()
  const normalized = message.replace(/\r\n/g, '\n').trim()
  if (normalized.length === 0) {
    return fields
  }

  const header = normalized.match(
    /^(.*) wants you to sign in with your Ethereum account:\n([^\n]*)(?:\n([\s\S]*))?$/,
  )
  if (header) {
    const domain = header[1]?.trim()
    const address = header[2]?.trim()
    fields.domain = domain && domain.length > 0 ? domain : undefined
    fields.address = address && address.length > 0 ? address : undefined
    const rest = header[3] ?? ''
    const parts = rest.split(/\n{2,}/)
    if (parts.length === 1) {
      const only = parts[0] ?? ''
      if (/^(URI|Version|Chain ID|Nonce|Issued At|Expiration Time):/m.test(only)) {
        Object.assign(fields, {
          uri: fieldValue(only, 'URI'),
          chain: fieldValue(only, 'Chain ID'),
          nonce: fieldValue(only, 'Nonce'),
          issuedAt: fieldValue(only, 'Issued At'),
          expiration: fieldValue(only, 'Expiration Time'),
        })
      } else if (only.trim().length > 0) {
        fields.statement = only.trim()
      }
    } else {
      const statement = parts[0]?.trim()
      fields.statement = statement && statement.length > 0 ? statement : undefined
      const tail = parts.slice(1).join('\n\n')
      fields.uri = fieldValue(tail, 'URI')
      fields.chain = fieldValue(tail, 'Chain ID')
      fields.nonce = fieldValue(tail, 'Nonce')
      fields.issuedAt = fieldValue(tail, 'Issued At')
      fields.expiration = fieldValue(tail, 'Expiration Time')
    }
    return fields
  }

  fields.uri = fieldValue(normalized, 'URI')
  fields.chain = fieldValue(normalized, 'Chain ID')
  fields.nonce = fieldValue(normalized, 'Nonce')
  fields.issuedAt = fieldValue(normalized, 'Issued At')
  fields.expiration = fieldValue(normalized, 'Expiration Time')
  return fields
}

export function isMalformedSiwe(fields: SiweFields): boolean {
  // Missing nonce or domain is enough. We reject instead of asking the user to paper over it.
  return !fields.nonce || !fields.domain
}

export function extractSiweFromAuth(payload: unknown): SiweFields {
  if (typeof payload === 'string') {
    return parseSiweMessage(payload)
  }
  const root = asRecord(payload)
  if (!root) {
    return emptyFields()
  }

  const params = asRecord(root.params)
  const message =
    readString(root, 'message') ??
    (params ? readString(params, 'message') : undefined)
  if (message) {
    return parseSiweMessage(message)
  }

  const authPayload = asRecord(root.authPayload) ?? (params ? asRecord(params.authPayload) : undefined)
  if (authPayload) {
    const nestedMessage = readString(authPayload, 'message')
    if (nestedMessage) {
      return parseSiweMessage(nestedMessage)
    }
    return fieldsFromAuthPayload(authPayload)
  }

  if (readString(root, 'domain') || readString(root, 'nonce')) {
    return fieldsFromAuthPayload(root)
  }

  return emptyFields()
}
