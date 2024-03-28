import React from 'react';

const BillingPage = () => {
  return (
    <div className='grid items-start gap-8'>
      <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
          <h1 className='text-3xl md:text-4xl'>Subscription</h1>
          <p className='text-lg text-muted-foreground'>
            Settings reagding your subscription
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
