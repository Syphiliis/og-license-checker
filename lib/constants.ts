export const RPC_URL = "https://arbitrum.drpc.org";
export const CONTRACT_ADDRESS = "0xd0f4E1265Edd221b5bb0e8667a59f31B587B2197"; // 0G Alignment Node NFT

export const MAX_ADDRESSES = 10;

export const UI = {
  placeholder: "0x1234...\n0xABCD...\n… (one address per line, up to 10)",
  tooMany: (max: number, got: number) => `You entered ${got} addresses. Maximum allowed is ${max}.`
};

