import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("GV2UpJXQZPoQSg4pZWfxtobeoV2ExzyTbEBogtFwn1jF");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
      payer: signer,
    };

    let data: DataV2Args = {
      name: "WATERMELON",
      symbol: "MLN",
      sellerFeeBasisPoints: 1,
      uri: "https://en.wikipedia.org/wiki/Watermelon",
      uses: null,
      collection: null,
      creators: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      collectionDetails: null,
      data,
      isMutable: false,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });
    let result = await tx.sendAndConfirm(umi);

    // 3qbUmKCS7AiEZFqtbWD6dUGfAKpFhz7HVAZt8Aqi4Nvw7AELXV7NoCPRNiYeiDh2p3XGTUD1VNty8DLEmQSoJMiB
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
