import { GetServerSideProps } from 'next';

export default function Noop() {
  return;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/movies', permanent: true } };
};
