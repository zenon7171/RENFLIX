// global.d.ts
import type { PrismaClient } from '@prisma/client';
import type { MongoClient } from 'mongodb';

export interface NetflixIntroProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  letter?: string;
}

declare global {
  namespace globalThis {
    var prismadb: PrismaClient;
  }

  namespace JSX {
    interface IntrinsicElements {
      netflixintro: NetflixIntroProps;
    }
  }
}