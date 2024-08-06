import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image =
      "https://xm4pi5cb7so7b7vvrvemzv3r7nbhtcc4kr7wkpqjdlnwrmgqvt6q.arweave.net/uzj0dEH8nfD-tY1IzNdx-0J5iFxUf2U-CRrbaLDQrP0";
    const metadata = {
      name: "WATERMELON",
      symbol: "MLN",
      description: "Just a watermelon",
      image,
      attributes: [
        { trait_type: "Seeds", value: "0" },
        { trait_type: "Freshness", value: "100" },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [keypair.publicKey],
    };

    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
