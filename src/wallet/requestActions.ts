import { getWalletKit } from './walletKit';
import { setState } from '../state/appState';
import { extractSiweFromAuth } from './siwe';
import { signDemoRequest } from './demoSigner';

export type SessionRequestRef = {
  topic: string;
  id: number;
};

export type JsonRpcErrorResponse = {
  id: number;
  jsonrpc: '2.0';
  error: {
    code: 5000;
    message: string;
  };
};

export function userRejectedError(id: number): JsonRpcErrorResponse {
  return {
    id,
    jsonrpc: '2.0',
    error: {
      code: 5000,
      message: 'User rejected.',
    },
  };
}

export function dryRunError(id: number): JsonRpcErrorResponse {
  // Error object, no result. A fake hash or signature here would be worse than refusing.
  return {
    id,
    jsonrpc: '2.0',
    error: {
      code: 5000,
      message: 'Dry-run only. No transaction was sent.',
    },
  };
}

export function listenSessionRequests(): void {
  getWalletKit().on('session_request', (event) => {
    const { topic, params, id } = event;
    const dappUrl =
      getWalletKit().getActiveSessions()[topic]?.peer.metadata.url ?? '';
    setState({
      pendingRequest: {
        topic,
        id,
        method: params.request.method,
        params: params.request.params,
        dappUrl,
        chainId: params.chainId,
      },
    });
  });
}

export async function rejectSessionRequest(
  ref: SessionRequestRef,
): Promise<void> {
  await getWalletKit().respondSessionRequest({
    topic: ref.topic,
    response: userRejectedError(ref.id),
  });
}

export async function completeDryRun(ref: SessionRequestRef): Promise<void> {
  await getWalletKit().respondSessionRequest({
    topic: ref.topic,
    response: dryRunError(ref.id),
  });
}

export async function completeDemoSign(
  ref: SessionRequestRef,
  method: string,
  params: unknown,
): Promise<void> {
  const result = await signDemoRequest(method, params);
  await getWalletKit().respondSessionRequest({
    topic: ref.topic,
    response: {
      id: ref.id,
      jsonrpc: '2.0',
      result,
    },
  });
}

export function listenSessionAuthenticate(): void {
  getWalletKit().on('session_authenticate', (event) => {
    const id = event.id;
    const fields = extractSiweFromAuth(event);
    const dappUrl =
      typeof event.params?.requester?.metadata?.url === 'string'
        ? event.params.requester.metadata.url
        : '';
    setState({
      pendingAuth: {
        id,
        fields,
        dappUrl,
      },
    });
  });
}

export async function rejectMalformedSiwe(id: number): Promise<void> {
  await getWalletKit().rejectSessionAuthenticate({
    id,
    reason: {
      code: 5000,
      message: 'Malformed SIWE.',
    },
  });
}
