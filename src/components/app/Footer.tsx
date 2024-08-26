import { FC } from 'react';

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
  return (
    <footer>
      <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm text-muted-foreground">
          Created by{' '}
          <a
            href="https://www.linkedin.com/in/tuliren/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Liren Tu
          </a>
          . The source code is available on{' '}
          <a
            href="https://github.com/tuliren/83b"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
