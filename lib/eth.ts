// lib/eth.ts
import { ethers } from "ethers";
import { RPC_URL, CONTRACT_ADDRESS } from "@lib/constants";

// Provider Arbitrum public
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// ABI minimale ERC-721 (balanceOf)
const nftAbi = ["function balanceOf(address owner) view returns (uint256)"];

// Instance de contrat en lecture seule
const nftContract = new ethers.Contract(CONTRACT_ADDRESS, nftAbi, provider);

// Helper: retourne le solde (nombre de licences détenues)
export async function getBalance(owner: string): Promise<bigint> {
  const bal: bigint = await nftContract.balanceOf(owner);
  return bal;
}

