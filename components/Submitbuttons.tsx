'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button className='disabled w-fit'>
          <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Please Wait
        </Button>
      ) : (
        <Button className='w-fit' type='submit'>
          Save Now
        </Button>
      )}
    </>
  );
}
