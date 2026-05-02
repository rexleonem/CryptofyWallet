import { ethers } from 'ethers';

const DERIVATION_PATH = "m/44'/60'/0'/0/0"; // Ethereum standard

export function deriveWalletFromMnemonic(mnemonic: string): ethers.HDNodeWallet {
  return ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, DERIVATION_PATH);
}

export function getAddressFromMnemonic(mnemonic: string): string {
  const wallet = deriveWalletFromMnemonic(mnemonic);
  return wallet.address;
}
