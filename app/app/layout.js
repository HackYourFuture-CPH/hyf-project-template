import './globals.css';
import Navbar from '@/components/Navbar';
import PropTypes from 'prop-types';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'HackYourFuture',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
