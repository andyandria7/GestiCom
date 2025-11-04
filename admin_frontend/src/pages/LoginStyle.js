const loginStyles = {
  wrapper: {
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%,rgb(5, 10, 51) 100%)'
  },
  card: {
    backdropFilter: 'blur(20px)',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px'
  },
  shieldWrapper: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #158EFA, #00bfff)'
  },
  title: {
    background: 'linear-gradient(135deg, #000000, #333333)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  underline: {
    width: '60px',
    height: '4px',
    background: 'linear-gradient(90deg, #158EFA, #00bfff)'
  },
  inputLeftIcon: {
    borderColor: '#e9ecef',
    borderRadius: '12px 0 0 12px'
  },
  input: {
    borderRadius: '0 12px 12px 0',
    borderColor: '#e9ecef',
    padding: '12px 16px',
    fontSize: '16px'
  },
  inputFocus: {
    borderColor: '#158EFA',
    boxShadow: '0 0 0 0.25rem rgba(21, 142, 250, 0.15)'
  },
  inputBlur: {
    borderColor: '#e9ecef',
    boxShadow: 'none'
  },
  passwordInput: {
    borderColor: '#e9ecef',
    padding: '12px 16px',
    fontSize: '16px'
  },
  toggleButton: {
    borderRadius: '0 12px 12px 0',
    borderColor: '#e9ecef',
    borderLeft: 'none'
  },
  forgotPassword: {
    color: '#158EFA',
    fontSize: '14px'
  },
  loginButton: {
    background: 'linear-gradient(135deg, #158EFA, #00bfff)',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '16px',
    color: 'white',
    boxShadow: '0 4px 15px rgba(21, 142, 250, 0.3)'
  },
  spinner: {
    width: '1rem',
    height: '1rem'
  },
  errorAlert: {
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(220, 53, 69, 0.1)',
    borderLeft: '4px solid #dc3545'
  }
};
export default loginStyles;
