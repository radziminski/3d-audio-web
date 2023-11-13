import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () =>
  Promise.resolve({
    redirect: { destination: '/preparation/stereo-check', permanent: false },
  });

export default function Preparation() {
  return <>redirecting</>;
}
