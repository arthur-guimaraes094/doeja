import React from 'react';
import { MapPin, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonationCard = ({ title, donor, location, time, image }) => {
  const navigate = useNavigate();

  return (
    <div className="card-doeja shadow-lg hover:scale-[1.02] transition-transform duration-300">
      <div className="h-48 w-full overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-doeja-text-dark">{title}</h3>
        <p className="text-sm text-gray-600 font-medium">Doador: {donor}</p>
        
        <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
          <MapPin size={14} className="text-doeja-secondary" />
          <span>{location} | {time}</span>
        </div>

        <button 
          onClick={() => navigate('/chat')}
          className="mt-4 flex items-center justify-center gap-2 border-2 border-doeja-secondary text-doeja-secondary font-bold py-2 rounded-full hover:bg-doeja-secondary hover:text-white transition-all"
        >
          <MessageCircle size={18} />
          Chat
        </button>
      </div>
    </div>
  );
};

export default DonationCard;
