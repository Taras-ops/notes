import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import prisma from '@/lib/db';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notes.',
  description: 'Create your own notes with ease',
};

async function getData(userId: string) {
  noStore();

  if (userId) {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        colorSchema: true,
      },
    });

    return data;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  const userData = await getData(user?.id as string);

  return (
    <html lang='en'>
      <body
        className={`${inter.className} ${
          userData?.colorSchema ?? 'theme-orange'
        }`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
