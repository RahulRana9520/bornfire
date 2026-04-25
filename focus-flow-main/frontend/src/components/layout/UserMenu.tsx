import React from 'react';
import { 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Shield 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { userProfile } = useTaskContext();

  if (!user) return null;

  // Prioritize actual username, then email, then default
  const displayName = userProfile.username !== 'StudyMaster' ? userProfile.username : (user.email?.split('@')[0] || 'User');
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-11 w-11 rounded-full border-2 border-primary/20 p-0 hover:border-primary transition-all shadow-sm">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile.avatar} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500 shadow-sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal py-3 border-b">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {userProfile.league === 'diamond' && (
          <DropdownMenuItem className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive" 
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
