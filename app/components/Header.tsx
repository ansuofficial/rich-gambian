import { formatMoney } from "@/utils/utils";

interface Header {
  balance: number;
  percentSpent: string;
  totalSpent: number;
}

function Header({ balance, percentSpent, totalSpent }: Header) {
  return (
    <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg">
      <div className="px-4 py-4">
        <div className="mb-4 text-center flex items-center justify-center gap-4">
          <img
            className="w-10 h-10 rounded-[10px] animate-pulse"
            src="/gm.svg"
            alt="The Gambian Flag"
          />
          <span className="text-xl font-bold text-emerald-400">
            Spend The Gambia's Money
          </span>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">{formatMoney(balance)}</div>
          <div className="text-sm text-gray-400">
            {percentSpent}% spent • {formatMoney(totalSpent)} used
          </div>
        </div>
        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
