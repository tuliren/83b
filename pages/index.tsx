import fs from 'fs';
import path from 'path';
import { FC, useState } from 'react';

import ContentCard from '@/components/app/ContentCard';
import Footer from '@/components/app/Footer';
import OverviewCard from '@/components/app/OverviewCard';
import ParamsCard from '@/components/app/ParamsCard';
import { ELECTION_PARAMS } from '@/files/constants';
import { getInitialParams } from '@/params/paramHelpers';
import Toolbar from '@/components/app/Toolbar';
import { cn } from '@/lib/utils';

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
  const initialFormData = getInitialParams(ELECTION_PARAMS);
  const [formData, setFormData] = useState(initialFormData);
  const [view, setView] = useState<'text' | 'pdf'>('text');

  return (
    <main
      className={cn(
        'flex flex-col justify-center min-h-screen items-center bg-gray-100',
        'gap-2',
        'p-4 sm:p-6',
        'sm:px-8 lg:px-12 xl:px-36'
      )}
    >
      <p className="text-3xl font-bold">83(b) Election Generator</p>
      <p className="text-muted-foreground text-lg">(under construction)</p>
      <Toolbar view={view} onViewChange={setView} />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <OverviewCard />
          <ParamsCard formData={formData} setFormData={setFormData} />
        </div>

        <div className="col-span-1 md:col-span-4 space-y-4">
          <ContentCard title="Election Preview" content={election} formData={formData} view={view} />
          <ContentCard title="Letter to IRS" content={letter} formData={formData} view={view} />
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default App;
