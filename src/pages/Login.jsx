import React from 'react';
import { User, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-doeja-bg flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        {/* Left Side - Green with Illustration */}
        <div className="md:w-1/2 bg-doeja-primary p-12 flex flex-col items-center justify-center relative">
          <div className="absolute top-8 left-8">
            <Link to="/">
              <img src="/DoeJA.png" alt="Logo" className="h-10 object-contain" />
            </Link>
          </div>
          
          <div className="w-full max-w-sm mb-8">
            <img src="/CaixaAlimentos.png" alt="Caixa de Alimentos" className="w-full h-auto object-contain" />
          </div>
          
          <div className="w-full text-left mt-auto">
            <h2 className="text-4xl font-serif text-doeja-text-dark font-bold">Bem Vindo!</h2>
          </div>
        </div>

        {/* Right Side - White with Form */}
        <div className="md:w-1/2 bg-white p-12 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-serif text-doeja-secondary font-bold mb-10">Login</h1>
          
          <form className="w-full max-w-md flex flex-col gap-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="CPF/CNPJ/Email" 
                className="input-doeja pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Senha" 
                className="input-doeja pl-12"
              />
            </div>

            <div className="flex items-center justify-between text-sm font-medium text-gray-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-doeja-secondary focus:ring-doeja-secondary" />
                Lembrar de mim
              </label>
              <a href="#" className="hover:text-doeja-secondary transition-colors">Esqueceu a senha?</a>
            </div>

            <button type="submit" className="w-full bg-doeja-secondary text-doeja-text-dark font-bold py-4 rounded-full hover:brightness-110 transition-all text-xl mt-4 shadow-lg shadow-doeja-secondary/20">
              Login
            </button>

            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="text-gray-400 text-sm">Ou</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            <button type="button" className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-full hover:bg-gray-200 transition-all text-xl">
              Cadastre-se
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
