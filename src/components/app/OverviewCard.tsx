import { FC } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface OverviewCardProps {}

const OverviewCard: FC<OverviewCardProps> = ({}) => {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="pb-4">
        <CardTitle>What is an 83(b) election?</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <CardDescription className="flex flex-col justify-between gap-3">
          <span>
            An 83(b) election is a form that you send to the IRS to let them know that you want to be taxed on the fair
            market value of your stock <span className="font-bold">at the time of granting</span>, rather than{' '}
            <span className="font-bold">at the time of vesting</span>.
          </span>
          <span>
            Please consult with a tax professional before making an 83(b) election. This tool is provided for your
            convenience, but it is not a substitute for professional advice.
          </span>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
