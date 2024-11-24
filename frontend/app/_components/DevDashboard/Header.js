'use client';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogOutButton from '../AuthComponents/LogOutButton';
import Link from 'next/link';
import { useState } from 'react';
import { Drawer, List, ListItemText, Box } from '@mui/material';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  const handleMenuItemClick = () => {
    setDrawerOpen(false);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dev-dashboard' },
    { name: 'Projects', path: '/dev-dashboard/projects' },
    { name: 'Chat', path: '/chat' },
    { name: 'Profile', path: '/profile' },
  ];

  const HeaderContent = () => (
    <List>
      {menuItems.map((item, index) => (
        <Link
          href={item.path}
          key={index}
          onClick={handleMenuItemClick}
          className='rounded-md hover:text-gray-400 px-10'
        >
          <ListItemText primary={item.name} />
        </Link>
      ))}
    </List>
  );

  return (
    <header className='flex flex-col justify-between items-center bg-primary-blue p-2 text-white w-full'>
      <h1 className='p-2 hidden md:block md:ml-0 my-1 justify-center items-center'>Welcome to WFlance! 🚀</h1>

      <div className='flex flex-row justify-between items-center w-full mt-2 md:mt-0'>
        <div className='flex flex-row justify-start md:hidden w-full my-1'>
          <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer} className='lg:hidden'>
            <MenuIcon />
          </IconButton>

          <p className='p-2 md:hidden'>WFlance</p>
        </div>

        <div className='hidden md:flex md:flex-row justify-start space-x-6'>
          {menuItems.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              className='m-0 p-2 text-white items-center hover:text-primary-accent-dark '
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className='flex justify-start md:ml-auto'>
          <LogOutButton />
        </div>
      </div>

      <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)} variant='temporary'>
        <Box className='p-4 bg-primary-blue h-full w-[120px] text-white'>
          <HeaderContent />
        </Box>
      </Drawer>
    </header>
  );
}
