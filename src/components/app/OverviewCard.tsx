import { FC } from 'react';

import BaseCard from '@/components/app/BaseCard';
import { CardDescription } from '@/components/ui/card';

interface OverviewCardProps {}

const OverviewCard: FC<OverviewCardProps> = ({}) => {
  return (
    <BaseCard title="What is an 83(b) election?">
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
    </BaseCard>
  );
};

export default OverviewCard;