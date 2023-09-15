import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import classNames from "classnames";

type Props = {
  twitterHandle?: string;
  className?: string;
};

export function Menu({ twitterHandle, className }: Props) {
  const { connected } = useWallet();
  const menuClasses = classNames("menu", className);

  return (
    <ul className={menuClasses}>
      {connected && (
        <>
          <li>
            <label
              htmlFor="bonk-modal"
              className="btn-ghost lg:btn mb-1 lg:mr-1 lg:mb-0"
            >
              Send $Bonk
            </label>
          </li>
          <li>
            <label
              htmlFor="sol-modal"
              className="btn-ghost lg:btn mb-1 lg:mr-1 lg:mb-0"
            >
              Send SOL
            </label>
          </li>
        </>
      )}
      <WalletMultiButton className="btn" />
    </ul>
  );
}
