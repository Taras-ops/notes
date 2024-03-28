'use client';

import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { DoorClosed } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { navItems } from '@/components/DashboardNav';

function UserNav({
  name,
  email,
  picture,
}: {
  name: String;
  email: String;
  picture: String;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative w-10 h-10 rounded-full'>
          <Avatar className='w-10 h-10 rounded-full'>
            <AvatarImage src={picture} alt={name} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {navItems?.map((item, index) => (
            <DropdownMenuItem asChild key={index}>
              <Link
                href={item.href}
                className='w-full flex justify-between imtes-center'>
                {item.name}
                <span>
                  <item.icon className='w-4 h-4' />
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='w-full flex justify-between items-center'>
          <LogoutLink className='flex justify-between items-center w-full'>
            Logout{' '}
            <span>
              <DoorClosed className='w-4 h-4' />
            </span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNav;
