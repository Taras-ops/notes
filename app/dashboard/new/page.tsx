import Link from 'next/link';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/Submitbuttons';
import Tiptap from '@/components/tiptap/Tiptap';
import prisma from '@/lib/db';

async function NewNotePage() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  let description = '';

  if (!user) {
    throw new Error('Not authorized');
  }

  async function postData(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    await prisma.note.create({
      data: {
        title: title,
        description: description,
        userId: user?.id,
      },
    });

    return redirect('/dashboard');
  }

  const onChangeDescription = () => {
    'use client';
  };

  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>
            Right here you can create your new notes
          </CardDescription>
        </CardHeader>

        <CardContent className='flex flex-col gap-y-5'>
          <div className='gap-y-2 flex flex-col'>
            <Label>Title</Label>
            <Input
              type='text'
              name='title'
              placeholder='Title of note'
              required
            />
          </div>
          <div className='gap-y-2 flex flex-col'>
            <Label>Description</Label>
            {/* <Textarea
              name='description'
              placeholder='Describe note as you want'
            /> */}
            <Tiptap description={description} onChange={''} />
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

export default NewNotePage;
