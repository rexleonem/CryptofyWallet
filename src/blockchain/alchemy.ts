import { ethers } from 'ethers';
import { ALCHEMY_URL } from '../constants/chains';

const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);

export async function getETHBalance(address: string): Promise<string> {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

export async function getTokenBalance(
  address: string, tokenAddress: string, decimals: number
): Promise<string> {
  const abi = ['function balanceOf(address) view returns (uint256)'];
  const contract = new ethers.Contract(tokenAddress, abi, provider);
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, decimals);
}
