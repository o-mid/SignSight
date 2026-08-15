import { getWalletKit } from './walletKit'

export class PairError extends Error {
  override readonly name = 'PairError'

  constructor(message: string) {
    super(message)
  }
}

function pairErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.length > 0
  ) {
    return error.message
  }
  return 'Pairing failed.'
}

export async function pairWithUri(uri: string): Promise<void> {
  const trimmed = uri.trim()
  if (trimmed.length === 0) {
    throw new PairError('URI is empty.')
  }
  try {
    await getWalletKit().pair({ uri: trimmed })
  } catch (error: unknown) {
    throw new PairError(pairErrorMessage(error))
  }
}
