const ETH_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export function isEthereumAddress(value: string): boolean {
  return ETH_ADDRESS_PATTERN.test(value.trim());
}
