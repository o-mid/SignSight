import { isMalformedSiwe, parseSiweMessage } from './siwe'

const HAPPY_PATH = [
  'login.xyz wants you to sign in with your Ethereum account:',
  '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  '',
  'Sign in to the demo app.',
  '',
  'URI: https://login.xyz',
  'Version: 1',
  'Chain ID: 11155111',
  'Nonce: 32891757',
  'Issued At: 2021-09-30T16:25:24.000Z',
  'Expiration Time: 2021-10-02T00:00:00.000Z',
].join('\n')

const MISSING_NONCE = [
  'login.xyz wants you to sign in with your Ethereum account:',
  '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  '',
  'URI: https://login.xyz',
  'Version: 1',
  'Chain ID: 11155111',
  'Issued At: 2021-09-30T16:25:24.000Z',
].join('\n')

const MISSING_DOMAIN = [
  ' wants you to sign in with your Ethereum account:',
  '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  '',
  'URI: https://login.xyz',
  'Version: 1',
  'Chain ID: 11155111',
  'Nonce: 32891757',
  'Issued At: 2021-09-30T16:25:24.000Z',
].join('\n')

describe('parseSiweMessage', () => {
  it('parses an EIP-4361 message with domain and nonce', () => {
    const fields = parseSiweMessage(HAPPY_PATH)
    expect(fields.domain).toBe('login.xyz')
    expect(fields.address).toBe('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B')
    expect(fields.statement).toBe('Sign in to the demo app.')
    expect(fields.uri).toBe('https://login.xyz')
    expect(fields.chain).toBe('11155111')
    expect(fields.nonce).toBe('32891757')
    expect(fields.issuedAt).toBe('2021-09-30T16:25:24.000Z')
    expect(fields.expiration).toBe('2021-10-02T00:00:00.000Z')
    expect(isMalformedSiwe(fields)).toBe(false)
  })

  it('flags a message missing nonce as malformed', () => {
    const fields = parseSiweMessage(MISSING_NONCE)
    expect(fields.domain).toBe('login.xyz')
    expect(fields.nonce).toBeUndefined()
    expect(isMalformedSiwe(fields)).toBe(true)
  })

  it('flags a message missing domain as malformed', () => {
    const fields = parseSiweMessage(MISSING_DOMAIN)
    expect(fields.domain).toBeUndefined()
    expect(fields.nonce).toBe('32891757')
    expect(isMalformedSiwe(fields)).toBe(true)
  })
})
