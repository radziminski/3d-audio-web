import ReferenceEval from '~/components/eval/Reference';

import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';

const ReferenceEvalPage = () => {
  return (
    <Providers>
      <Layout>
        <ReferenceEval />
      </Layout>
    </Providers>
  );
};

export default ReferenceEvalPage;
