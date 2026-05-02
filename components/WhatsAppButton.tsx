"use client"

import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = "94767332059"; 
  const message = "Hello Manusha! I need help with the Safety Route Planner.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <style>{`\n@keyframes whatsappBounce {\n0% { transform: translateY(0); }\n 30% { transform: translateY(-8px); }\n50% { transform: translateY(-4px); }\n          100% { transform: translateY(0); }\n}\n `}</style>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp chat"
        title="Open WhatsApp chat"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center text-white rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
        style={{
          backgroundColor: '#25D366',
          width: 56,
          height: 56,
          borderRadius: 9999,
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37,211,102,0.24)',
          transform: 'translateY(-4px)',
          animation: 'whatsappBounce 1.8s ease-in-out infinite',
        }}
      >
        {/* Inline WhatsApp SVG for consistent rendering */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.88 11.88 0 0 0 12 .5C6.21.5 1.5 5.21 1.5 11c0 1.95.52 3.85 1.5 5.5L.5 23.5l7.26-2.05A11.88 11.88 0 0 0 12 22.5c5.79 0 10.5-4.71 10.5-10.5 0-3.06-1.12-5.86-3.98-8.52zM12 20.5c-1.34 0-2.66-.28-3.85-.82l-.28-.13-4.31 1.22 1.16-3.98-.18-.32A8.5 8.5 0 1 1 20.5 11 8.47 8.47 0 0 1 12 20.5z" fill="#ffffff" />
          <path d="M17.04 14.25c-.3-.15-1.77-.87-2.05-.97-.28-.1-.49-.15-.7.15-.22.3-.85.97-1.04 1.17-.19.2-.38.22-.69.07-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.38.45-.57.15-.19.2-.32.3-.53.1-.22 0-.42-.05-.57-.05-.15-.7-1.69-.96-2.32-.25-.61-.5-.53-.7-.54-.18-.01-.4-.01-.61-.01-.2 0-.52.07-.79.36-.28.3-1.07 1.04-1.07 2.54 0 1.5 1.1 2.96 1.25 3.17.15.22 2.15 3.4 5.21 4.77 3.06 1.38 3.06.92 3.61.87.56-.05 1.82-.74 2.08-1.45.26-.71.26-1.32.18-1.45-.08-.12-.3-.19-.61-.34z" fill="#ffffff" />
        </svg>
      </a>
    </>
  );
};

export default WhatsAppButton;