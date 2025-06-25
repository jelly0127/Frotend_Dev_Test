import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer"
type MobileNavbarDrawerProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const MobileNavbarDrawer = ({ children, open, onOpenChange }: MobileNavbarDrawerProps) => {
  return (
    <Drawer direction='right' open={open} onOpenChange={onOpenChange} >
      <DrawerContent className='bg-black p-4'>
        <DrawerTitle ></DrawerTitle>
        <div className='flex flex-col gap-y-4 w-full'>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavbarDrawer;