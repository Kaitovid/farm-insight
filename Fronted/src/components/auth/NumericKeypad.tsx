import { Delete } from 'lucide-react';

interface NumericKeypadProps {
    onNumberClick: (num: number) => void;
    onDelete: () => void;
    disabled?: boolean;
}

export function NumericKeypad({ onNumberClick, onDelete, disabled = false }: NumericKeypadProps) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Grid de números 1-9 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {numbers.map((num, index) => (
                    <button
                        key={num}
                        onClick={() => onNumberClick(num)}
                        disabled={disabled}
                        className="
              h-16 rounded-xl font-semibold text-xl
              bg-card border-2 border-border
              hover:bg-farm-green/10 hover:border-farm-green
              active:scale-95
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              animate-fade-up opacity-0
            "
                        style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Fila inferior: vacío, 0, borrar */}
            <div className="grid grid-cols-3 gap-4">
                <div className="h-16" /> {/* Espacio vacío */}

                <button
                    onClick={() => onNumberClick(0)}
                    disabled={disabled}
                    className="
            h-16 rounded-xl font-semibold text-xl
            bg-card border-2 border-border
            hover:bg-farm-green/10 hover:border-farm-green
            active:scale-95
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            animate-fade-up opacity-0
          "
                    style={{ animationDelay: '270ms', animationFillMode: 'forwards' }}
                >
                    0
                </button>

                <button
                    onClick={onDelete}
                    disabled={disabled}
                    className="
            h-16 rounded-xl font-semibold text-xl
            bg-card border-2 border-border
            hover:bg-destructive/10 hover:border-destructive
            active:scale-95
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center
            animate-fade-up opacity-0
          "
                    style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
                >
                    <Delete className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
