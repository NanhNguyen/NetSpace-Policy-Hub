import React from "react";

export default function Logo({ className = "w-auto h-8", hideText = false }: { className?: string, hideText?: boolean }) {
    return (
        <div className={`${className} flex items-center overflow-hidden ${hideText ? 'bg-white rounded-lg p-1.5' : ''}`}>
            <img 
                src="/logo.svg" 
                alt="NetSpace Logo" 
                className={`h-full w-auto object-contain ${hideText ? 'scale-125' : ''}`} 
            />
        </div>
    );
}
