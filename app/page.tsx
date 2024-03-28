import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';

async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    redirect('/dashboard');
  }

  return (
    <section className='flex items-center jus bg-background h-[90vh]'>
      <div className='relative items-center w-full mx-auto px-5 py-12'>
        <div className='max-w-3xl mx-auto text-center'>
          <div>
            <span className='w-auto px-6 py-3 rounded-full bg-secondary'>
              <span className='text-sm text-primary font-medium'>
                Sort your notes easily
              </span>
            </span>

            <h1 className='text-3xl mt-8 font-extrabold tracking-light lg:text-6xl'>
              Create Notes with ease
            </h1>
            <p className='max-w-xl mt-3 mx-auto text-base lg:text-xl text-secondary-foreground'>
              A place for great ideas. Notes is designed for whatever’s on your
              mind. Write down your thoughts.
            </p>

            <div className='flex justify-center max-w-sm mx-auto mt-10'>
              <RegisterLink>
                <Button size='lg' className='w-full'>
                  Sign Up for free
                </Button>
              </RegisterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
