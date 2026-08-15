import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import type { IWalletKit, WalletKitTypes } from '@reown/walletkit';
import {
  DEMO_ADDRESS,
  SUPPORTED_EVENTS,
  SUPPORTED_METHODS,
  WALLET_CHAIN_ID,
} from './chain';
import { getWalletKit } from './walletKit';
import { setState } from '../state/appState';

export type SessionProposal = WalletKitTypes.SessionProposal;

export type ProposalExpirySource = {
  params: {
    expiryTimestamp?: number;
    expiry?: number;
  };
};

function toEpochMs(value: number): number {
  return value < 1_000_000_000_000 ? value * 1000 : value;
}

export function listenSessionProposals(): void {
  getWalletKit().on('session_proposal', (proposal: SessionProposal) => {
    setState({ pendingProposal: proposal });
  });
}

export async function approveSessionProposal(
  proposal: SessionProposal,
): Promise<void> {
  // We only approve Sepolia plus the methods in chain.ts. Everything else stays out.
  const namespaces = buildApprovedNamespaces({
    proposal: proposal.params,
    supportedNamespaces: {
      eip155: {
        chains: [WALLET_CHAIN_ID],
        methods: SUPPORTED_METHODS,
        events: SUPPORTED_EVENTS,
        accounts: [`${WALLET_CHAIN_ID}:${DEMO_ADDRESS}`],
      },
    },
  });
  await getWalletKit().approveSession({
    id: proposal.id,
    namespaces,
  });
}

export async function rejectSessionProposal(id: number): Promise<void> {
  await getWalletKit().rejectSession({
    id,
    reason: getSdkError('USER_REJECTED'),
  });
}

export async function disconnectSession(topic: string): Promise<void> {
  await getWalletKit().disconnectSession({
    topic,
    reason: getSdkError('USER_DISCONNECTED'),
  });
}

export function listActiveSessions(): ReturnType<IWalletKit['getActiveSessions']> {
  return getWalletKit().getActiveSessions();
}

export function proposalExpiryMs(proposal: ProposalExpirySource): number {
  const raw = proposal.params.expiryTimestamp ?? proposal.params.expiry;
  if (raw === undefined) {
    return 0;
  }
  return toEpochMs(raw);
}

export function formatCountdown(msLeft: number): string {
  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function isApproveExpired(msLeft: number): boolean {
  // Approve dies at 00:00. Reject and Disconnect still work.
  return msLeft <= 0;
}
