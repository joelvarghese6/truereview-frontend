import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';

const Wallets = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [domLoaded, setDomLoaded] = useState<boolean>(false);

    useEffect(() => {
        setDomLoaded(true);
      }, []);
    
    return (
    	<div className='flex item-center'>
            {domLoaded && (<WalletMultiButton />)}
            
        </div>
    )
}

export default Wallets