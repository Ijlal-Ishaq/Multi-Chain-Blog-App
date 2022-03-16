/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./utils/connector";

function Router() {
  const wallet = useWallet();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [selectedChain, setSelectedChain] = useState<string | undefined>(
    undefined
  );
  const web3ReactEht = useWeb3React();

  useEffect(() => {
    if (wallet.connected) {
      setAddress(wallet.publicKey?.toString());
      setSelectedChain("solana");
    }
  }, [wallet.connected]);

  useEffect(() => {
    if (web3ReactEht.active) {
      setAddress(web3ReactEht.account?.toString());
      setSelectedChain("ethereum");
    }
  }, [web3ReactEht.active]);

  const disconnect = async () => {
    if (selectedChain === "solana") {
      await wallet.disconnect();
      setSelectedChain(undefined);
    } else if (selectedChain === "ethereum") {
      web3ReactEht.deactivate();
      setSelectedChain(undefined);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#016283",
        width: "400px",
        margin: "100px auto",
        padding: "25px",
        borderRadius: "15px",
      }}
    >
      {wallet.connected || web3ReactEht.active ? (
        <div>
          <div>Address: {address}</div>
          <br />
          <div>Selected Chain: {selectedChain}</div>
          <br />
          <button
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            BLOG-CHAIN
          </div>
          <br />
          <br />
          <div
            style={{
              width: "100%",
              textAlign: "left",
              fontSize: "19px",
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "10px",
            }}
          >
            Select a Chain :
          </div>
          <select
            name="chains"
            id="selectchain"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "19px",
              border: "none",
              outline: "none",
              borderRadius: "7px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: "#fec70b",
            }}
            onChange={(e) => {
              setSelectedChain(e.target.value);
            }}
          >
            <option value="ethereum">ETHEREUM</option>
            <option value="solana">SOLANA</option>
          </select>
          <br />
          <br />
          {selectedChain === "solana" ? (
            <>
              <button
                onClick={() => {
                  if (wallet?.wallets[0]?.adapter.name) {
                    wallet.select(wallet.wallets[0].adapter.name);
                    wallet.connect();
                    setSelectedChain("solona");
                  }
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "19px",
                  border: "none",
                  borderRadius: "7px",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: "#fec70b",
                }}
              >
                Connect Phantom
              </button>
              <br />
              <br />
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  web3ReactEht.activate(injected);
                  setSelectedChain("ethereum");
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "19px",
                  border: "none",
                  borderRadius: "7px",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: "#fec70b",
                }}
              >
                Connect Metamask
              </button>
              <br />
              <br />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Router;
