import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { Helius } from "helius-sdk";
import { createTokenAccount, transferTokens } from "@/components/metaplex";
import * as web3 from "@solana/web3.js";
import returnkey from "./env";

const helius = new Helius("0f31c860-68c3-4d89-bc63-a2f8957a0603");

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const { connected, publicKey } = useWallet();
  console.log(connected);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [amount, setAmount] = React.useState(0);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    if (!connected) {
      return;
    }

    const url =
      "https://devnet.helius-rpc.com/?api-key=0f31c860-68c3-4d89-bc63-a2f8957a0603";

    async function getAmount() {
      const connection = new web3.Connection(web3.clusterApiUrl("devnet"), {
        commitment: "confirmed",
      });

      const mintaddr = "8UB2WSuBdRRRN4QzPPVTNFDph3cVLMPSA1Noe6SbnorC";
      const mint = new web3.PublicKey(mintaddr);
      const secret = returnkey();
      const secretKey = Uint8Array.from(secret);
      const user = web3.Keypair.fromSecretKey(secretKey);

      const pubKey = new web3.PublicKey(publicKey!.toString());

      const tokenAccount = await createTokenAccount(
        connection,
        user,
        mint,
        pubKey // Associating our address with the token account
      );

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          id: "test-drive",
          jsonrpc: "2.0",
          method: "getTokenAccountBalance",
          params: [tokenAccount.address],
        }),
      });
      const data = await response.json();
      const amounts = data.result.value.uiAmount;
      console.log(amounts)
      setAmount(amounts)
    }

    getAmount();
  });

  return (
    <AppBar position="static" style={{ backgroundColor: "#464D77" }}>
      <Container maxWidth="xl">
        <Toolbar className="flex justify-between" disableGutters>
          <div>
            <Link href="/">
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                True Review
              </Typography>
            </Link>
          </div>
          <div className="flex">
          <Box sx={{ flexGrow: 0, paddingRight: 8 }}>
              {amount} Points
            </Box>
            <Box sx={{ flexGrow: 0, paddingRight: 8 }}>
              <WalletMultiButton className="btn p-16" />
            </Box>
            {connected && (
              <Box sx={{ flexGrow: 0 }}>
                <Link href="/profile">
                  <Tooltip title="Profile">
                    <IconButton sx={{ p: 0 }}>
                      <Avatar
                        alt="Remy Sharp"
                        src="https://www.computerhope.com/jargon/g/guest-user.png"
                      />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Box>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
