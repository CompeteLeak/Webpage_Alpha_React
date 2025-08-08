import React from 'react';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className="footer-content">
    <p>© {new Date().getFullYear()} Project Alpha</p>
    <p>Crafted in the void ⚡</p>
  </div>
    </footer>
  );
};

export default Footer;
