import { FC } from 'react';
import Link from 'next/link';

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
  return (
    <footer>
      <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm text-muted-foreground">
          Created by{' '}
          <Link
            href="https://www.linkedin.com/in/tuliren/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Liren Tu
          </Link>
          . The source code is available on{' '}
          <Link
            href="https://github.com/tuliren/83b"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            GitHub
          </Link>{' '}
          under the{' '}
          <Link
            href="https://github.com/tuliren/83b/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            MIT License
          </Link>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
