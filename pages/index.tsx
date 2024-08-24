import fs from 'fs';
import path from 'path';
import { FC } from 'react';

import CustomMarkdown from '@/components/app/CustomMarkdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  return (
    <main className="flex flex-col justify-between min-h-screen items-center p-6 sm:p-12 sm:gap-12 gap-6 bg-gray-100">
      <p className="text-3xl font-bold">83(b) Election Generator</p>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Election 83(b)</CardTitle>
          <CardDescription>Please fill in the blanks to create an 83(b) election.</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <CustomMarkdown text={election} textClassNames={['text-md']} />
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Letter to IRS</CardTitle>
          <CardDescription>Please fill in the blanks to create a letter to IRS.</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <CustomMarkdown text={letter} textClassNames={['text-md']} />
        </CardContent>
      </Card>
    </main>
  );
};

export default App;
