import React, { useRef, useState } from 'react';
import {
  alpha,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  InputBase,
  AppBar as MuiAppBar,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { signOut, useSession } from 'next-auth/client';
import { Controller, Control } from 'react-hook-form';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '0ch',
    '&:focus': {
      width: '17ch',
    },
    '&:not(:placeholder-shown)': {
      width: '17ch',
    },
  },
}));

type AppBarProps = {
  control: Control;
};
export function AppBar(props: AppBarProps) {
  const { control } = props;
  const [session, loading] = useSession();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const handleClose = () => setMenuOpen(false);
  const handleOpen = () => setMenuOpen(true);

  return (
    <MuiAppBar position="fixed" sx={{ backgroundColor: '#4a148c' }}>
      <Toolbar>
        <Menu
          anchorEl={buttonRef.current}
          open={menuOpen}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>Secret Pastes</MenuItem>
          <MenuItem onClick={() => signOut({ redirect: true, callbackUrl: '/' }) && handleClose()}>Logout</MenuItem>
        </Menu>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          ref={buttonRef}
          onClick={handleOpen}
        >
          <Avatar src={session?.user?.image} />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ ml: 2, flexGrow: 1 }}>
          {session?.user?.name}
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <Controller
            control={control}
            name={'searchText'}
            render={({ onChange, onBlur, value }) => (
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={onChange}
                onBlur={onBlur}
                value={value || ''}
              />
            )}
          />
        </Search>
      </Toolbar>
    </MuiAppBar>
  );
}
