import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-doeja-primary h-20 flex items-center justify-between px-8 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img src="/DoeJA+Prato.png" alt="DoeJÁ Logo" className="h-12 w-12 object-contain" />
          <span className="text-doeja-text-dark font-serif text-2xl font-bold">DoeJÁ</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-12 text-doeja-text-dark font-semibold">
        <Link to="/feed" className="hover:text-white transition-colors">Doações</Link>
        <Link to="#" className="hover:text-white transition-colors">ONG's</Link>
        <Link to="#" className="hover:text-white transition-colors">Seja um parceiro!</Link>
      </div>

      <div>
        <Link to="/login" className="bg-doeja-secondary text-doeja-text-dark font-bold px-8 py-2 rounded-full hover:brightness-110 transition-all">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
