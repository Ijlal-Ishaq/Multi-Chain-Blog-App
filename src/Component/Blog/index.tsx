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

type Props = {
  selectedChain: string | undefined;
};

const Blog: React.FC<Props> = ({ selectedChain }) => {
  const [contract, setContract] = useState(undefined);
  const [program, setProgram] = useState(undefined);
  const [programAccountPubkey, setProgramAccountPubkey] =
    useState<anchor.web3.PublicKey | null>(null);

  const [userData, setUserData] = useState(undefined);
  const [name, setName] = useState("");

  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  useEffect(() => {
    if (selectedChain === "solana") {
      solServices.initProgram(setProgram, connection, anchorWallet);
    } else if (selectedChain === "ethereum") {
      ethServices.initContract(setContract);
    }
  }, [anchorWallet]);

  useEffect(() => {
    if (program) {
      solServices.extractBlogAccountPublicKey(
        program,
        anchorWallet,
        setProgramAccountPubkey
      );
    }
  }, [program]);

  useEffect(() => {
    if (selectedChain === "solana" && program) {
      if (programAccountPubkey) {
        solServices.getUserData(program, programAccountPubkey, setUserData);
      }
    } else if (selectedChain === "ethereum" && contract) {
      ethServices.getUserData(setUserData);
    }
  }, [program, contract, programAccountPubkey]);

  const createAccount = () => {
    if (selectedChain === "solana") {
      solServices.initializeAccount(setProgramAccountPubkey, program, name);
    } else if (selectedChain === "ethereum") {
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
    }
  };

  return (
    <div>
      {programAccountPubkey ? (
        <>
          <div style={{ color: "#fff", fontSize: "18px", fontWeight: "bold" }}>
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
              }}
            >
              {
                //@ts-ignore
                userData?.address
              }
            </span>
          </div>
          <br />
          <div style={{ color: "#fff", fontSize: "18px", fontWeight: "bold" }}>
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
              }}
            >
              {
                //@ts-ignore
                userData?.bio
              }
            </span>
          </div>
          <br />
          <div style={{ color: "#fff", fontSize: "18px", fontWeight: "bold" }}>
            Latest Post:
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
              }}
            >
              {
                //@ts-ignore
                userData?.latestPost
              }
            </span>
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
