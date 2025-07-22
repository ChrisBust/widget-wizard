
'use client';

import { useTransition } from 'react';
import { logout } from '@/lib/actions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <DropdownMenuItem onClick={handleClick} disabled={isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isPending ? 'Logging out...' : 'Logout'}</span>
    </DropdownMenuItem>
  );
}
