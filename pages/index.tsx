import fs from 'fs';
import path from 'path';
import { FC, useState } from 'react';

import ContentCard from '@/components/app/ContentCard';
import OverviewCard from '@/components/app/OverviewCard';
import ParamsCard from '@/components/app/ParamsCard';
import { ElectionParams } from '@/files/params';

interface AppProps {
  election: string;
  letter: string;
}

export async function getStaticProps() {
  const election = fs.readFileSync(path.join(process.cwd(), 'src/files/election.md'), 'utf8').toString();
  const letter = fs.readFileSync(path.join(process.cwd(), 'src/files/letter.md'), 'utf8').toString();

  return {
    props: {
      election,
      letter,
    } as AppProps,
  };
}

const App: FC<AppProps> = ({ election, letter }) => {
  const initialFormData = ElectionParams.reduce((acc, param) => {
    acc[param.id] = '';
    return acc;
  }, {} as Record<string, string>);
  const [formData, setFormData] = useState(initialFormData);

  return (
    <main className="flex flex-col min-h-screen items-center p-4 sm:p-6 sm:gap-6 gap-4 bg-gray-100">
      <p className="text-3xl font-bold">83(b) Election Generator</p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-6xl">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <OverviewCard />
          <ParamsCard formData={formData} setFormData={setFormData} />
        </div>

        <div className="col-span-1 md:col-span-3 space-y-6">
          <ContentCard title="83(b) Election Preview" content={election} formData={formData} />
          <ContentCard title="Letter to IRS" content={letter} formData={formData} />
        </div>
      </div>
    </main>
  );
};

export default App;
