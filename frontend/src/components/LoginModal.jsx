import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import LoginPage from './LoginPage'; // We'll modify LoginPage to accept an onLoginSuccess prop
import RegisterPage from './RegisterPage';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxWidth: '90vw',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 3,
  outline: 'none',
  overflow: 'auto',
};

function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, openLoginModal, loginAction,isSignUpModalOpen, closeSignUpModal, openSignUpModal } = useAuth();

  const handleLoginSuccess = (accessToken, userData) => {
    loginAction(accessToken, userData); // This will also close the modal via AuthContext
  };

  return (
    <>
    <Modal open={isLoginModalOpen} onClose={closeLoginModal} aria-labelledby="login-modal-title">
      <Box sx={style}>
        <IconButton onClick={closeLoginModal} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
          <CloseIcon />
        </IconButton>
        <LoginPage onLoginSuccess={handleLoginSuccess} isModal={true}/>
      </Box>
    </Modal>
    <Modal open={isSignUpModalOpen} onClose={closeSignUpModal} aria-labelledby="login-modal-title">
      <Box sx={style}>
        <IconButton onClick={closeSignUpModal} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
          <CloseIcon />
        </IconButton>
        <RegisterPage onLoginSuccess={handleLoginSuccess} isModal={true} />
      </Box>
    </Modal>
    </>
  );
}

export default LoginModal;