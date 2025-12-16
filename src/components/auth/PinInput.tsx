import { useState } from 'react';

interface PinInputProps {
    value: string;
    length?: number;
    error?: boolean;
}

export function PinInput({ value, length = 4, error = false }: PinInputProps) {
    return (
        <div className="flex gap-4 justify-center mb-8">
            {Array.from({ length }).map((_, index) => (
                <div
                    key={index}
                    className={`
            w-16 h-16 rounded-xl border-2 flex items-center justify-center
            transition-all duration-300 animate-fade-up
            ${value.length > index
                            ? error
                                ? 'border-destructive bg-destructive/10 animate-shake'
                                : 'border-farm-green bg-farm-green/10'
                            : 'border-border bg-background'
                        }
          `}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                    {value.length > index && (
                        <div
                            className={`
                w-4 h-4 rounded-full transition-colors duration-300
                ${error ? 'bg-destructive' : 'bg-farm-green'}
              `}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
