import { ReactNode } from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import DashboardNav from '@/components/DashboardNav';
import prisma from '@/lib/db';

async function getData({
  email,
  id,
  firstName,
  lastName,
  profileImage,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  profileImage: string | undefined | null;
}) {
  noStore();

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: { id: true, stripeCustomerId: true },
  });

  if (!user) {
    const name = `${firstName ?? ''} ${lastName ?? ''}`;
    await prisma.user.create({
      data: {
        id: id,
        name: name,
        email: email,
      },
    });
  }
}

async function DashboardLayout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/');
  }

  await getData({
    email: user.email as string,
    id: user.id as string,
    firstName: user.given_name as string,
    lastName: user.family_name as string,
    profileImage: user.picture,
  });

  return (
    <div className='flex flex-col space-y-6 mt-10'>
      <div className='container grid flex-1 gap-12 md:grid-cols-[200px_1fr]'>
        <aside className='hidden w-[200px] flex-col md:flex'>
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
