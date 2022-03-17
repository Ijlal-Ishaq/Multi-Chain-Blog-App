import * as anchor from "@project-serum/anchor";
import idl from "../../../utils/IDLs/idl.json";
import { SOLANA_PROGRAM_ID } from "../../../utils/constants";
import { SystemProgram, Transaction } from "@solana/web3.js";

export function initProgram(
  setProgram: any,
  connection: any,
  anchorWallet: any
) {
  const provider = new anchor.Provider(connection, anchorWallet!, {
    preflightCommitment: "recent",
  });

  // Address of the deployed program.
  const programId = new anchor.web3.PublicKey(SOLANA_PROGRAM_ID);

  // Generate the program client from IDL.
  const program = new anchor.Program(idl as anchor.Idl, programId, provider);

  setProgram(program);
}

export async function extractBlogAccountPublicKey(
  program: any,
  anchorWallet: any,
  setProgramAccountPubkey: any
) {
  const allAssociatedAccounts = await program?.account.blogAccount.all();

  const pubkey = allAssociatedAccounts?.find(
    //@ts-ignore
    ({ account }) =>
      account.authority.toString() === anchorWallet?.publicKey.toString()
  )?.publicKey;

  setProgramAccountPubkey(pubkey || null);
}

export async function getUserData(
  program: any,
  programAccountPubkey: any,
  setUserData: any
) {
  console.log("aaa5");

  const encodedBio = await program?.account.blogAccount.fetch(
    programAccountPubkey!
  );

  console.log("aaa5", new TextDecoder().decode(encodedBio?.bio));

  setUserData({
    address: programAccountPubkey?.toString()!,
    bio: new TextDecoder().decode(encodedBio?.bio),
    latestPost: new TextDecoder().decode(encodedBio?.latestPost),
  });
}

export async function initializeAccount(
  setProgramAccountPubkey: any,
  program: any,
  bioValue: any
) {
  try {
    const blogAccount = anchor.web3.Keypair.generate();
    const utf8EncodedBio = Buffer.from(bioValue || "Hey there!");

    await program?.rpc.initialize(utf8EncodedBio, {
      // Pass in all the accounts needed
      accounts: {
        blogAccount: blogAccount.publicKey, // publickey for our new account
        authority: program.provider.wallet.publicKey, // publickey of our anchor wallet provider
        systemProgram: SystemProgram.programId, // just for Anchor reference
      },
      signers: [blogAccount], // blogAccount must sign this Tx, to prove we have the private key too
    });

    setProgramAccountPubkey(blogAccount.publicKey);
  } catch (error) {
    console.error(error);
  }
}

export async function makePost(
  program: any,
  data: any,
  anchorWallet: any,
  programAccountPubkey: any,
  connection: any,
  wallet: any,
  userData: any,
  setUserData: any
) {
  if (program && anchorWallet) {
    const utf8EncodedPost = Buffer.from(data);

    let tx = program.transaction.makePost(utf8EncodedPost, {
      accounts: {
        blogAccount: programAccountPubkey!,
        authority: program.provider.wallet.publicKey,
      },
    });

    tx = new Transaction({
      recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
      feePayer: anchorWallet?.publicKey!,
    }).add(...tx.instructions!);

    const signedTx = await anchorWallet.signTransaction(tx);
    console.log("signedTx --", signedTx);

    const sentTx = await wallet.sendTransaction(signedTx!, connection);
    console.log("sentTx --", sentTx);

    setUserData({
      ...userData,
      latestPost: data,
    });
  }
}
