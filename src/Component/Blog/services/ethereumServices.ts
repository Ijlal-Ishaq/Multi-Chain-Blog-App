/* eslint-disable eqeqeq */
import abi from "../../../utils/ABIs/abi.json";
import { ETHEREUM_CONTRACT_ADDRESS } from "../../../utils/constants";

export function initContract(setContract: any, web3: any) {
  const contract = new web3.eth.Contract(abi, ETHEREUM_CONTRACT_ADDRESS);
  setContract(contract);
}
export async function getUserId(
  contract: any,
  setContractAccountId: any,
  account: any
) {
  let id = await contract.methods.accountId(account).call();
  setContractAccountId(id);
  console.log("aaa", id);
}

export async function getUserData(
  contract: any,
  contractAccountId: any,
  setUserData: any
) {
  let data = await contract.methods.getAccountDetails(contractAccountId).call();
  setUserData({
    address: data["_address"],
    bio: data["_bio"],
    latestPost: data["_latestPost"],
  });
}

export async function initializeAccount(
  contract: any,
  bio: any,
  setContractAccountId: any,
  from: any
) {
  console.log("aaa", from);
  await contract.methods
    .createAccount(bio)
    .send({ from: from })
    .on("transactionHash", (hash: any) => {
      console.log("transaction hash: " + hash);
    })
    .on("confirmation", async function (confirmationNumber: any) {
      if (confirmationNumber == 3) {
        getUserId(contract, setContractAccountId, from);
      }
    });
}

export async function makePost(
  contract: any,
  data: any,
  account: any,
  userData: any,
  setUserData: any
) {
  await contract.methods
    .makeAPost(data)
    .send({ from: account })
    .on("transactionHash", (hash: any) => {
      console.log("transaction hash: " + hash);
    })
    .on("confirmation", async function (confirmationNumber: any) {
      if (confirmationNumber == 3) {
        setUserData({ ...userData, latestPost: data });
      }
    });
}
