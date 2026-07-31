import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorState = ({ message = "Something went wrong.", onRetry, accentColor = "text-[#E63946]", bgAccent = "bg-[#E63946]" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl shadow-black/5 border border-black/[0.04]"
      >
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 bg-red-50 text-red-500`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-serif font-bold text-[#1D1D1F] mb-3">Oops!</h3>
        <p className="text-sm text-[#666666] font-sans mb-8 leading-relaxed">
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className={`flex items-center justify-center gap-2 w-full py-3 ${bgAccent} hover:opacity-90 text-white font-semibold rounded-xl transition-opacity shadow-md`}
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorState;
