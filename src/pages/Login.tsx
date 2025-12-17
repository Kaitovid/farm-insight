import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PinInput } from '@/components/auth/PinInput';
import { NumericKeypad } from '@/components/auth/NumericKeypad';
import { useAuth } from '@/hooks/useAuth';
import { Sprout, AlertCircle } from 'lucide-react';

export default function Login() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleNumberClick = (num: number) => {
        if (pin.length < 4) {
            const newPin = pin + num.toString();
            setPin(newPin);
            setError(false);

            // Auto-submit cuando se completan 4 dígitos
            if (newPin.length === 4) {
                handleSubmit(newPin);
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError(false);
    };

    const handleSubmit = async (pinToSubmit: string) => {
        setIsLoading(true);

        // Simular delay de autenticación
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(pinToSubmit);

        if (success) {
            navigate('/');
        } else {
            setError(true);
            setPin('');
            setIsLoading(false);

            // Limpiar error después de 2 segundos
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-farm-sage/20 via-background to-farm-earth/20 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo y título */}
                <div className="text-center mb-12 animate-fade-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-farm-green/10 border-2 border-farm-green mb-6">
                        <Sprout className="w-10 h-10 text-farm-green" />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                        Farm Insight Hub
                    </h1>
                    <p className="text-muted-foreground">
                        Ingresa tu código PIN para continuar
                    </p>
                </div>

                {/* Card de login */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                    {/* PIN Input */}
                    <PinInput value={pin} error={error} />

                    {/* Mensaje de error */}
                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            <p className="text-sm text-destructive font-medium">
                                PIN incorrecto. Intenta nuevamente.
                            </p>
                        </div>
                    )}

                    {/* Teclado numérico */}
                    <NumericKeypad
                        onNumberClick={handleNumberClick}
                        onDelete={handleDelete}
                        disabled={isLoading}
                    />

                    {/* Hint */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground">
                            PIN por defecto: 1234
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                    <p>Sistema de Gestión Agropecuaria</p>
                </div>
            </div>
        </div>
    );
}
