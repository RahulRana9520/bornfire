import React from 'react';
import { Users, UserPlus, Search } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { FriendCard } from '@/components/friends/FriendCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Friends = () => {
  const { friends } = useTaskContext();
  
  const onlineFriends = friends.filter(f => f.isOnline);
  const offlineFriends = friends.filter(f => !f.isOnline);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Watch Friends
          </h1>
          <p className="text-muted-foreground mt-1">
            See what your study buddies are up to
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search friends..." 
          className="pl-10"
        />
      </div>

      {/* Online Friends */}
      {onlineFriends.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Online ({onlineFriends.length})
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {onlineFriends.map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </div>
      )}

      {/* Offline Friends */}
      {offlineFriends.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Offline ({offlineFriends.length})
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offlineFriends.map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {friends.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border/50">
          <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <h3 className="font-medium text-lg">No friends yet</h3>
          <p className="text-muted-foreground mt-1">
            Add friends to see their progress and study together
          </p>
          <Button className="mt-4">
            <UserPlus className="w-4 h-4 mr-2" />
            Find Friends
          </Button>
        </div>
      )}
    </div>
  );
};

export default Friends;
