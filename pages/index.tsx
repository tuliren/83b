import { Container, Stack, Title } from '@mantine/core';
import fs from 'fs';
import path from 'path';
import { FC } from 'react';

import CustomMarkdown from '@/components/app/CustomMarkdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Container mb="xl">
      <Stack gap="sm">
        <Title order={2} ta="center">
          83(b) Election Generator
        </Title>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Election 83(b)</CardTitle>
            <CardDescription>Please fill in the blanks to create an 83(b) election.</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomMarkdown text={election} textClassNames={['text-md']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Letter to IRS</CardTitle>
            <CardDescription>Please fill in the blanks to create a letter to IRS.</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomMarkdown text={letter} textClassNames={['text-md']} />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default App;
