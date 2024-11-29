import React, { useContext } from 'react';
import { AuthContext } from '@/layouts/AuthContext';
import '@/style/footer.css';

function Footer() {
  const { user } = useContext(AuthContext);
  if (!user) {
    return (
      <footer>
        <div>
          <hr />
          <span>Kiruna Explorer</span>
        </div>
        <div>Done by GROUP 11</div>
      </footer>
    );
  }

  return null;
}

export default Footer;
