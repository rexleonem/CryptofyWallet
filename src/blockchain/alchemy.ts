import { ALCHEMY_URL } from '../constants/chains';

async function callRpc<T>(method: string, params: unknown[]): Promise<T> {
  if (!ALCHEMY_URL) {
    throw new Error('Live blockchain provider unavailable');
  }

  const response = await fetch(ALCHEMY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message || 'Alchemy RPC request failed');
  }

  return payload.result;
}

function formatUnits(hexValue: string, decimals: number): string {
  const value = BigInt(hexValue);
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const paddedFraction = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${whole}.${paddedFraction}`;
}

export async function getETHBalance(address: string): Promise<string> {
  const balance = await callRpc<string>('eth_getBalance', [address, 'latest']);
  return formatUnits(balance, 18);
}

export async function getTokenBalance(
  address: string, tokenAddress: string, decimals: number
): Promise<string> {
  const paddedAddress = address.toLowerCase().replace('0x', '').padStart(64, '0');
  const data = `0x70a08231${paddedAddress}`;
  const balance = await callRpc<string>('eth_call', [{ to: tokenAddress, data }, 'latest']);
  return formatUnits(balance, decimals);
}
