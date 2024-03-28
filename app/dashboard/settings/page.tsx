import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubmitButton } from '@/components/Submitbuttons';
import prisma from '@/lib/db';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

async function getData(userId: string) {
  noStore();

  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorSchema: true,
    },
  });

  return data;
}

async function SettingsPage() {
  const { getUser } = getKindeServerSession();

  const currentUser = await getUser();
  const data = await getData(currentUser?.id as string);

  async function postData(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const colorSchema = formData.get('color') as string;

    await prisma.user.update({
      where: {
        id: currentUser?.id,
      },
      data: {
        name: name ?? undefined,
        colorSchema: colorSchema ?? undefined,
      },
    });

    revalidatePath('/', 'layout');
  }

  return (
    <div className='grid items-start gap-8'>
      <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
          <h1 className='text-3xl md:text-4xl'>Settings</h1>
          <p className='text-lg text-muted-foreground'>Your Profile settings</p>
        </div>
      </div>

      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Please provide general information about yourself. Please
              don&apos;t forget to save
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='space-y-1'>
                <Label>Your Name</Label>
                <Input
                  name='name'
                  type='text'
                  id='name'
                  placeholder='Your Name'
                  defaultValue={data?.name ?? ''}
                />
              </div>
              <div className='space-y-1'>
                <Label>Your Email</Label>
                <Input
                  name='email'
                  type='email'
                  id='email'
                  placeholder='Your Email'
                  disabled
                  defaultValue={data?.email ?? ''}
                />
              </div>

              <div className='space-y-1'>
                <Label>Color Schema</Label>
                <Select name='color' defaultValue={data?.colorSchema ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a color' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value='theme-green'>Green</SelectItem>
                      <SelectItem value='theme-blue'>Blue</SelectItem>
                      <SelectItem value='theme-orange'>Orange</SelectItem>
                      <SelectItem value='theme-rose'>Rose</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default SettingsPage;
