import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png'

const Layout = () => {
  return (
    <>
      <header className="flex justify-center items-center py-3 h-20 shadow-md">
        <img 
            src={logo} 
            alt="logo" 
            width={180} 
            height={60} 
        />
      </header>
      <Outlet /> 
    </>
  );
};

export default Layout

