import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = () => {
  return Promise.resolve({
    redirect: {
      destination: '/preparation/stereo-check',
      permanent: false,
    },
    props: {},
  });
};

export default function Preparation() {
  return <div>redirecting</div>;
}
