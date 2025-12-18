import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ChartCard({ title, subtitle, children, className, delay = 0 }: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 sm:p-5 md:p-6 shadow-sm animate-fade-up opacity-0",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="mb-3 sm:mb-4">
        <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="min-h-[200px] sm:min-h-[250px]">
        {children}
      </div>
    </div>
  );
}
