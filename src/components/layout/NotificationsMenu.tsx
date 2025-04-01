
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  time: string;
}

const NotificationsMenu = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Sample notifications data
  const notifications: Notification[] = [
    { id: 1, title: "Don't forget to log your water intake", time: "2 hours ago" },
    { id: 2, title: "New workout suggestion available", time: "Yesterday" },
    { id: 3, title: "You've reached your daily goal!", time: "2 days ago" },
  ];
  
  return (
    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
            {notifications.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="py-3 cursor-pointer">
            <div className="flex flex-col">
              <span className="font-medium">{notification.title}</span>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <Button variant="ghost" size="sm" className="w-full">View all notifications</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
