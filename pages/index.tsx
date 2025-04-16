import fs from 'fs';
import path from 'path';
import { FC, useMemo, useState } from 'react';

import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import Footer from '@/components/app/Footer';
import IrsPdfDownload from '@/components/app/IrsPdfDownload';
import IrsPdfViewer from '@/components/app/IrsPdfViewer';
import OverviewCard from '@/components/app/OverviewCard';
import ParamsCard from '@/components/app/ParamsCard';
import PdfViewer from '@/components/app/PdfViewer';
import Toolbar from '@/components/app/Toolbar';
import { ContentPage } from '@/components/app/types';
import { ELECTION_PARAMS } from '@/files/constants';
import { cn } from '@/lib/utils';
import { processTemplate } from '@/params/contentHelpers';
import { getInitialParams } from '@/params/paramHelpers';

interface AppProps {
  election: string;
  letter: string;
  header1: string;
  header2: string;
  header3: string;
  attention: string;
}

export async function getStaticProps() {
  const election = fs.readFileSync(path.join(process.cwd(), 'src/files/election.hbs'), 'utf8').toString();
  const letter = fs.readFileSync(path.join(process.cwd(), 'src/files/letter.hbs'), 'utf8').toString();
  const header1 = fs.readFileSync(path.join(process.cwd(), 'src/files/header1.md'), 'utf8').toString();
  const header2 = fs.readFileSync(path.join(process.cwd(), 'src/files/header2.md'), 'utf8').toString();
  const header3 = fs.readFileSync(path.join(process.cwd(), 'src/files/header3.md'), 'utf8').toString();
  const attention = fs.readFileSync(path.join(process.cwd(), 'src/files/attention.md'), 'utf8').toString();

  return {
    props: {
      election,
      letter,
      header1,
      header2,
      header3,
      attention,
    } as AppProps,
  };
}

const App: FC<AppProps> = ({ election, letter, header1, header2, header3, attention }) => {
  const initialFormData = getInitialParams(ELECTION_PARAMS);
  const [formData, setFormData] = useState(initialFormData);
  const [view, setView] = useState<'text' | 'pdf' | 'irs-pdf'>('text');

  const pages: ContentPage[] = useMemo(() => {
    const processedElection = processTemplate(election, formData);
    const processedLetter = processTemplate(letter, formData);

    return [
      {
        title: 'Election - IRS File Copy',
        text: processedElection,
        headers: [{ text: header1, alignment: 'left' }],
      },
      {
        title: 'Election - IRS Acknowledgement Copy',
        text: processedElection,
        headers: [
          { text: attention, alignment: 'center', color: 'red', bold: true },
          { text: header2, alignment: 'left' },
        ],
      },
      {
        title: 'Letter to IRS',
        text: processedLetter,
        headers: [{ text: header3, alignment: 'left' }],
      },
    ];
  }, [attention, election, formData, header1, header2, header3, letter]);

  return (
    <main
      className={cn(
        'flex flex-col justify-center min-h-screen items-center bg-gray-100',
        'gap-2',
        'p-4 sm:p-6',
        'sm:px-8 lg:px-8 xl:px-44'
      )}
    >
      <p className="text-3xl font-bold">83(b) Election Generator</p>
      <p className="text-muted-foreground text-lg">(under construction)</p>
      <Toolbar view={view} onViewChange={setView} showIrsOption={true} />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <OverviewCard />
          <ParamsCard formData={formData} setFormData={setFormData} />
          {view === 'irs-pdf' && (
            <IrsPdfDownload formData={formData} />
          )}
        </div>

        <div className="col-span-1 md:col-span-4 space-y-4">
          {view === 'pdf' && (
            <BaseCard title="PDF File">
              <PdfViewer pages={pages} />
            </BaseCard>
          )}

          {view === 'irs-pdf' && (
            <IrsPdfViewer formData={formData} />
          )}

          {view === 'text' &&
            pages.map(({ title, text, headers }, index) => (
              <BaseCard key={`content-card-${index}-${title}`} title={title}>
                <CustomMarkdown content={text} headers={headers} />
              </BaseCard>
            ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default App;
