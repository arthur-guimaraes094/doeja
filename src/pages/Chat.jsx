import React from 'react';
import Navbar from '../components/Navbar';
import { ChevronLeft, Paperclip, Smile, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-doeja-bg pt-28 pb-8 px-4">
      <Navbar />
      
      <div className="max-w-4xl mx-auto bg-white rounded-4xl shadow-xl overflow-hidden border-2 border-doeja-primary/20 flex flex-col h-[700px]">
        {/* Chat Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-white">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-serif text-doeja-primary font-bold">Chat</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-doeja-primary"
              >
                <ChevronLeft size={28} />
              </button>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-doeja-primary/30">
                <User size={24} className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="text-gray-500 font-medium">
            Doação: <span className="text-doeja-text-dark">50 pacotes de arroz</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 flex flex-col gap-6">
          {/* Received Message */}
          <div className="flex flex-col items-start max-w-[80%]">
            <div className="bg-[#FFE5C9] text-doeja-text-dark p-4 rounded-3xl rounded-bl-none shadow-sm relative">
              <p className="font-medium">Olá! Tenho interesse nos pacotes de arroz para nossa ONG. Ainda estão disponíveis?</p>
              <span className="text-[10px] text-gray-500 mt-2 block text-right">17:30</span>
            </div>
          </div>

          {/* Sent Message */}
          <div className="flex flex-col items-end max-w-[80%] ml-auto">
            <div className="bg-[#D9F2B4] text-doeja-text-dark p-4 rounded-3xl rounded-br-none shadow-sm relative">
              <p className="font-medium">Olá! Sim, ainda temos 50 pacotes. Quando vocês poderiam vir buscar?</p>
              <span className="text-[10px] text-gray-500 mt-2 block text-right">17:32</span>
            </div>
          </div>

          {/* Received Message */}
          <div className="flex flex-col items-start max-w-[80%]">
            <div className="bg-[#FFE5C9] text-doeja-text-dark p-4 rounded-3xl rounded-bl-none shadow-sm relative">
              <p className="font-medium">Poderíamos ir amanhã pela manhã, por volta das 09h. Fica bom para vocês?</p>
              <span className="text-[10px] text-gray-500 mt-2 block text-right">17:35</span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex items-center gap-4 bg-gray-50 rounded-full px-6 py-2 border border-gray-100">
            <input 
              type="text" 
              placeholder="Escreva sua mensagem" 
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-doeja-text-dark py-2"
            />
            <div className="flex items-center gap-3 text-gray-400">
              <button className="hover:text-doeja-primary transition-colors"><Paperclip size={20} /></button>
              <button className="hover:text-doeja-primary transition-colors"><Smile size={20} /></button>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-doeja-secondary shadow-sm hover:scale-110 transition-transform">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
