import React from 'react';
import Navbar from '../components/Navbar';
import DonationCard from '../components/DonationCard';
import { Search, ChevronDown, MessageSquare } from 'lucide-react';

const donations = [
  { id: 1, title: '50 pacotes de arroz', donor: 'Nordestão', location: 'Natal, Tirol', time: 'Hoje, 17:00', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: '10kg de Feijão Preto', donor: 'Super Show', location: 'Natal, Lagoa Nova', time: 'Hoje, 18:30', image: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: 'Cesta Básica Completa', donor: 'Maria das Graças', location: 'Natal, Alecrim', time: 'Ontem, 15:00', image: '/CaixaAlimentos.png' },
  { id: 4, title: '20L de Leite Integral', donor: 'Laticínios Potiguar', location: 'Natal, Ponta Negra', time: 'Hoje, 10:00', image: 'https://images.unsplash.com/photo-1563636619-e9107da5a766?auto=format&fit=crop&q=80&w=400' },
  { id: 5, title: 'Frutas Variadas', donor: 'Hortifruti Bom Dia', location: 'Natal, Petrópolis', time: 'Hoje, 09:00', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400' },
  { id: 6, title: 'Pães Artesanais', donor: 'Padaria do Zé', location: 'Natal, Capim Macio', time: 'Hoje, 17:00', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400' },
  { id: 7, title: 'Legumes Frescos', donor: 'Feira do Alecrim', location: 'Natal, Alecrim', time: 'Hoje, 07:00', image: 'https://images.unsplash.com/photo-1566385101042-1a000c1267c4?auto=format&fit=crop&q=80&w=400' },
  { id: 8, title: 'Macarrão Espaguete', donor: 'Mercado Central', location: 'Natal, Centro', time: 'Hoje, 12:00', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400' },
];

const Feed = () => {
  return (
    <div className="min-h-screen bg-doeja-bg pt-28 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Controls */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Buscar" 
              className="w-full h-16 pl-16 pr-8 rounded-full bg-white shadow-sm border-none focus:ring-2 focus:ring-doeja-primary outline-none text-lg transition-all"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 font-medium italic">Ordenar por</span>
            <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm w-fit text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Mais recentes
              <ChevronDown size={20} className="text-doeja-primary" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {donations.map(donation => (
            <DonationCard key={donation.id} {...donation} />
          ))}
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-doeja-secondary text-doeja-text-dark rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-40">
        <MessageSquare size={32} />
      </button>
    </div>
  );
};

export default Feed;
