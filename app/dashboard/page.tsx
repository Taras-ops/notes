import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import { Edit, File, Trash } from 'lucide-react';
import { Card } from '@/components/ui/card';

async function getNotesData(userId: string) {
  noStore();

  const data = prisma.note.findMany({
    where: { userId: userId },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return data;
}

async function DashboardPage() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  const notesData = await getNotesData(user?.id as string);

  async function deleteNote(formData: FormData) {
    'use server';

    const noteId = formData.get('noteId') as string;

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    revalidatePath('/dashboard');
  }

  return (
    <div className='grid items-start gap-y-8'>
      <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
          <h1 className='text-3xl md:text-4xl'>Your Notes</h1>
          <p className='text-lg text-muted-foreground'>
            Here you can see and create new notes
          </p>
        </div>

        <Button asChild>
          <Link href='/dashboard/new'>Create a new Note</Link>
        </Button>
      </div>

      {notesData?.length > 0 ? (
        <div className='flex flex-col gap-y-4'>
          {notesData?.map((note, index) => (
            <Card key={index} className='flex items-center justify-between p-4'>
              <div>
                <h2 className='font-semibold'>{note.title}</h2>
                <p></p>
              </div>
              <div className='flex gap-x-4'>
                <Link href={`/dashboard/new/${note.id}`}>
                  <Button variant='outline' size='icon'>
                    <Edit className='w-4 h-4' />
                  </Button>
                </Link>
                <form action={deleteNote}>
                  <input type='hidden' name='noteId' value={note.id} />
                  <Button variant='destructive' size='icon' type='submit'>
                    <Trash className='w-4 h-4' />
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50'>
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
            <File />
          </div>

          <h2 className='mt-6 text-xl font-semibold'>
            You don&apos;t have any notes created
          </h2>
          <p className='mb-8 mt-2 text-center text-sm text-muted-foreground leading-6 mx-auto max-w-sm'>
            You currently don&apos;t have any notes. Please create some so that
            you see them right now
          </p>

          <Button asChild>
            <Link href='/dashboard/new'>Create a new Note</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
