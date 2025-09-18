import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");

const TOKEN_MINT_ADDRESS = new PublicKey(
  import.meta.env.VITE_CLE_TOKEN_MINT || "11111111111111111111111111111111"
);

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export async function checkTokenBalance(walletPublicKey: PublicKey): Promise<number> {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    let totalBalance = BigInt(0);
    let decimals = 9;

    for (const tokenAccount of tokenAccounts.value) {
      const accountInfo = tokenAccount.account.data.parsed.info;

      if (accountInfo.mint === TOKEN_MINT_ADDRESS.toBase58()) {
        totalBalance += BigInt(accountInfo.tokenAmount.amount);
        decimals = Number(accountInfo.tokenAmount.decimals) || 9;
      }
    }

    return Number(totalBalance) / Math.pow(10, decimals);

  } catch (error) {
    console.error("Error fetching token balance:", error);
    return 0;
  }
}

export function formatWalletAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
