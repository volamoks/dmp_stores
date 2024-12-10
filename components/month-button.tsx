import { Button } from './ui/button';

interface MonthButtonProps {
    month: string;
    isAvailable: boolean;
    isPending?: boolean;
    isSelected?: boolean;
    onClick: () => void;
}

export function MonthButton({ month, isAvailable, isPending = false, isSelected = false, onClick }: MonthButtonProps) {
    const date = new Date(month);
    const monthName = date.toLocaleString('ru', { month: 'short' });
    const year = date.getFullYear();

    const getButtonStyle = () => {
        if (isPending) {
            return 'bg-gray-200 text-gray-600 hover:bg-gray-300';
        }
        if (!isAvailable) {
            return 'bg-red-500 text-white hover:bg-red-600';
        }
        if (isSelected) {
            return 'border-2 border-gray-400';
        }
        return 'hover:bg-gray-100';
    };

    return (
        <Button
            onClick={isAvailable ? onClick : undefined}
            variant="outline"
            className={`
                min-w-[4.5rem] p-1
                ${getButtonStyle()}
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
