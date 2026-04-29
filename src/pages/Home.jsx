import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-doeja-bg pt-20 overflow-hidden relative">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center relative z-10">
        <h1 className="text-4xl md:text-6xl text-doeja-text-dark max-w-4xl leading-tight font-serif mb-12">
          Seu gesto pode mudar histórias <br />
          <span className="text-doeja-secondary font-bold">DoeJÁ</span> e leve mais do que alimento, leve cuidado e esperança.
        </h1>

        <div className="relative w-full max-w-4xl h-[400px]">
          {/* Main Illustration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 z-20">
            <img src="/DoeJA+MaosDadas.png" alt="Mãos Dadas" className="w-full h-full object-contain animate-bounce-slow" />
          </div>

          {/* Surrounding Icons/Placeholders */}
          <div className="absolute top-0 left-0 w-40 h-40">
            <img src="/MascoteSorriso.png" alt="Mascote" className="w-full h-full object-contain rotate-[-10deg]" />
          </div>
          
          <div className="absolute top-10 right-0 w-56 h-56">
            <img src="/MulherCamisaLaranja.png" alt="Doadora Feliz" className="w-full h-full object-contain" />
          </div>

          {/* Small Veggies in corners */}
          <div className="absolute bottom-[-50px] left-[-100px] w-24 h-24">
            <img src="/Berinjela.png" alt="Berinjela" className="w-full h-full object-contain" />
          </div>
          
          <div className="absolute bottom-[-50px] right-[-100px] w-24 h-24">
            <img src="/Tomate.png" alt="Tomate" className="w-full h-full object-contain" />
          </div>
        </div>
      </main>

      {/* Decorative background circle */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-doeja-primary opacity-20 rounded-full blur-3xl -z-0"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-doeja-secondary opacity-10 rounded-full blur-3xl -z-0"></div>
    </div>
  );
};

export default Home;
