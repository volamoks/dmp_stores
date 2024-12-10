import { Button } from './ui/button';

interface MonthButtonProps {
    month: string;
    isAvailable: boolean;
    onClick: () => void;
}

export function MonthButton({ month, isAvailable, onClick }: MonthButtonProps) {
    const date = new Date(month);
    const monthName = date.toLocaleString('ru', { month: 'short' });
    const year = date.getFullYear();

    return (
        <Button
            onClick={isAvailable ? onClick : undefined}
            variant={isAvailable ? "outline" : "default"}
            className={`
                min-w-[4.5rem] p-1
                ${isAvailable 
                    ? 'border-red-200 text-red-600 hover:bg-red-50' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'}
            `}
        >
            <div className="text-xs font-medium">
                {monthName}
                <div className="text-[10px] opacity-75">
                    {year}
                </div>
            </div>
        </Button>
    );
}
