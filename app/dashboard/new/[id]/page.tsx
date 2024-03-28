import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/Submitbuttons';

import Link from 'next/link';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

async function getData({ userId, noteId }: { userId: string; noteId: string }) {
  noStore();

  const data = await prisma.note.findUnique({
    where: {
      id: noteId,
      userId: userId,
    },
    select: { title: true, description: true, id: true },
  });

  return data;
}

async function EditNotePage({ params }: { params: { id: string } }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const noteData = await getData({
    userId: user?.id as string,
    noteId: params.id,
  });

  async function postData(formData: FormData) {
    'use server';

    if (!user) throw new Error('You are not allowed');

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    await prisma.note.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        title: title,
        description: description,
      },
    });

    revalidatePath('/dashboard');

    return redirect('/dashboard');
  }

  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>

        <CardContent className='flex flex-col gap-y-5'>
          <div className='gap-y-2 flex flex-col'>
            <Label>Title</Label>
            <Input
              type='text'
              name='title'
              placeholder='Title of note'
              defaultValue={noteData?.title}
              required
            />
          </div>
          <div className='gap-y-2 flex flex-col'>
            <Label>Description</Label>
            <Textarea
              name='description'
              defaultValue={noteData?.description}
              placeholder='Describe note as you want'
            />
          </div>
        </CardContent>

        <CardFooter className='flex justify-between'>
          <Button asChild variant='secondary'>
            <Link href='/dashboard'>Cancel</Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}

export default EditNotePage;
