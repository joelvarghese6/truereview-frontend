// src/components/Signup.tsx
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import returnkey from "@/components/env";
import { createTokenAccount, transferTokens } from "@/components/metaplex";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

const Signup: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    nationality: "",
  });

  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2);
    const uniqueId = `${timestamp}${randomString}`;
    return uniqueId;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      toast("connect your wallet")
      return
    }
    initialAmount()
    const data = {
      uuid: generateUniqueId(),
      pubKey: publicKey?.toString(),
      name: formData.name,
      designation: formData.designation,
      nationality: formData.nationality,
      account: "Achievers",
      reviewCount: 0,
    };
    const url =
      "https://m0xr4lz01f.execute-api.ap-south-1.amazonaws.com/helius-signup-user";
    // Send the formData to the server
    try {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("An error occurred:", error);
      toast("Failed");
      return;
    }
    toast("Successfully updated");
    router.push("/");
  };

  const initialAmount = async () => {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), {
      commitment: "confirmed",
    });

    const mintaddr = "8UB2WSuBdRRRN4QzPPVTNFDph3cVLMPSA1Noe6SbnorC";
    const mint = new web3.PublicKey(mintaddr);
    const secret = returnkey();
    const secretKey = Uint8Array.from(secret);
    const user = web3.Keypair.fromSecretKey(secretKey);

    const sourceTokenAccount = await createTokenAccount(
      connection,
      user,
      mint,
      user.publicKey // Associating our address with the token account
    );

    const pubKey = new web3.PublicKey(publicKey!.toString());

    const tokenAccount = await createTokenAccount(
      connection,
      user,
      mint,
      pubKey // Associating our address with the token account
    );

    await transferTokens(
      connection,
      user,
      sourceTokenAccount.address,
      tokenAccount.address,
      user.publicKey,
      100,
      mint
    )
  };

  return (
    <div className="bg-zinc-200 min-h-screen flex items-center justify-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="designation"
          >
            Designation
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="designation"
            type="text"
            placeholder="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nationality"
          >
            Nationality
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nationality"
            type="text"
            placeholder="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
