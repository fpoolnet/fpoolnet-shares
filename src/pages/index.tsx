import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAddress } from '@store/app/AppSelectors';
import { useSelector } from '@store/store';

const Home = () => {
  const router = useRouter();
  const address = useSelector(getAddress);

  useEffect(() => {
    if (address) {
      router.replace(`/address/${address}`);
    } else {
      router.push('/404');
    }
  }, [address]);

  return null;
};

export default Home;
