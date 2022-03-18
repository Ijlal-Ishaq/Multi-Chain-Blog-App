/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import * as solServices from "./services/solanaServices";
import * as ethServices from "./services/ethereumServices";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

type Props = {
  selectedChain: string | undefined;
};

const Blog: React.FC<Props> = ({ selectedChain }) => {
  const [contract, setContract] = useState(undefined);
  const [program, setProgram] = useState(undefined);
  const [programAccountPubkey, setProgramAccountPubkey] =
    useState<anchor.web3.PublicKey | null>(null);
  const [contractAccountId, setContractAccountId] = useState<number>(0);

  const [userData, setUserData] = useState(undefined);
  const [name, setName] = useState("");

  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  const web3context = useWeb3React();
  const web3 = new Web3(web3context?.library?.currentProvider);

  useEffect(() => {
    if (selectedChain === "solana") {
      solServices.initProgram(setProgram, connection, anchorWallet);
    } else if (selectedChain === "ethereum") {
      ethServices.initContract(setContract, web3);
    }
  }, [anchorWallet]);

  useEffect(() => {
    if (selectedChain === "solana") {
      if (program) {
        solServices.extractBlogAccountPublicKey(
          program,
          anchorWallet,
          setProgramAccountPubkey
        );
      }
    } else if (selectedChain === "ethereum") {
      if (contract) {
        ethServices.getUserId(
          contract,
          setContractAccountId,
          web3context.account
        );
      }
    }
  }, [program, contract]);

  useEffect(() => {
    if (selectedChain === "solana" && program) {
      if (programAccountPubkey) {
        solServices.getUserData(program, programAccountPubkey, setUserData);
      }
    } else if (selectedChain === "ethereum" && contract) {
      if (contractAccountId && contractAccountId > 0) {
        ethServices.getUserData(contract, contractAccountId, setUserData);
      }
    }
  }, [program, contract, programAccountPubkey, contractAccountId]);

  const createAccount = async () => {
    if (selectedChain === "solana") {
      solServices.initializeAccount(setProgramAccountPubkey, program, name);
    } else if (selectedChain === "ethereum") {
      //@ts-ignore
      ethServices.initializeAccount(
        contract,
        name,
        setContractAccountId,
        web3context.account
      );
    }
  };

  const makeAPost = () => {
    const data = prompt("Enter Something");
    if (selectedChain === "solana") {
      solServices.makePost(
        program,
        data,
        anchorWallet,
        programAccountPubkey,
        connection,
        wallet,
        userData,
        setUserData
      );
    } else if (selectedChain === "ethereum") {
      ethServices.makePost(
        contract,
        data,
        web3context.account,
        userData,
        setUserData
      );
    }
  };

  return (
    <div>
      {programAccountPubkey || contractAccountId > 0 ? (
        <>
          <div
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            Account Address:
            <br />
            <div style={{ height: "8px", width: "100%" }} />
            <span
              style={{
                color: "#fff",
                fontSize: "13px",
                fontWeight: "light",
                backgroundColor: "#fec70b",
                padding: "7px 14px",
                borderRadius: "5px",
                width: "100%",
              }}
            >
              {
                //@ts-ignore
                userData?.address
              }
            </span>
          </div>
          <br />
          <div
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            Account Name:
            <br />
            <div style={{ height: "8px", width: "100%" }} />
            <span
              style={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "light",
                backgroundColor: "#fec70b",
                padding: "7px 14px",
                borderRadius: "5px",
                width: "100%",
              }}
            >
              {
                //@ts-ignore
                userData?.bio
              }
            </span>
          </div>
          <br />
          <div
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            Latest Post:
            <br />
            <div style={{ height: "8px", width: "100%" }} />
            <div
              style={{
                backgroundColor: "#fec70b",
                borderRadius: "5px",
                padding: "7px 14px",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "light",
                  padding: "7px 14px",
                  width: "100%",
                  wordBreak: "break-all",
                }}
              >
                {
                  //@ts-ignore
                  userData?.latestPost
                }
              </span>
            </div>
          </div>
          <button
            style={{
              position: "fixed",
              right: "8px",
              bottom: "8px",
              height: "50px",
              width: "50px",
              borderRadius: "100%",
              border: "none",
              backgroundColor: "rgb(1, 98, 131)",
              color: "#fff",
              fontSize: "25px",
            }}
            onClick={() => {
              makeAPost();
            }}
          >
            +
          </button>
        </>
      ) : (
        <>
          <div style={{ color: "#fff", fontSize: "18px", fontWeight: "bold" }}>
            Enter Name:
            <br />
            <div style={{ height: "8px", width: "100%" }} />
            <input
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: "light",
                backgroundColor: "#fec70b",
                padding: "7px 14px",
                borderRadius: "5px",
                outline: "none",
                border: "none",
              }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <br />
            <br />
            <button
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: "light",
                backgroundColor: "#fec70b",
                padding: "7px 14px",
                borderRadius: "5px",
                outline: "none",
                border: "none",
              }}
              onClick={() => {
                createAccount();
              }}
            >
              Create Account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;
