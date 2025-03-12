import dynamic from 'next/dynamic';
import { ProfilePage } from './page';

const DynamicProfilePage = dynamic(() => Promise.resolve(ProfilePage), {
  ssr: false,
});

export default DynamicProfilePage;
