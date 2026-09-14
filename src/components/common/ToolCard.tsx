import React from 'react';
import { 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ToolDefinition } from '../../types';
import { ToolIllustration } from './ToolIllustration';

export interface ToolCardProps {
  tool: ToolDefinition;
  onClick?: () => void;
  compact?: boolean;
}

const categoryColorMap: Record<string, { bg: string; text: string; iconBg: string; border: string }> = {
  organize: { bg: 'bg-blue-50/70', text: 'text-blue-700', iconBg: 'bg-blue-600 text-white', border: 'border-blue-100 hover:border-blue-300' },
  convert: { bg: 'bg-indigo-50/70', text: 'text-indigo-700', iconBg: 'bg-indigo-600 text-white', border: 'border-indigo-100 hover:border-indigo-300' },
  optimize: { bg: 'bg-emerald-50/70', text: 'text-emerald-700', iconBg: 'bg-emerald-600 text-white', border: 'border-emerald-100 hover:border-emerald-300' },
  security: { bg: 'bg-amber-50/70', text: 'text-amber-700', iconBg: 'bg-amber-600 text-white', border: 'border-amber-100 hover:border-amber-300' },
  edit: { bg: 'bg-purple-50/70', text: 'text-purple-700', iconBg: 'bg-purple-600 text-white', border: 'border-purple-100 hover:border-purple-300' },
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, compact = false }) => {
  const style = categoryColorMap[tool.category] || categoryColorMap.organize;

  return (
    <a
      id={`tool-card-${tool.slug}`}
      href={`/tools/${tool.slug}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex flex-col justify-between bg-white rounded-2xl border ${style.border} p-5 sm:p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform p-1">
            <ToolIllustration toolId={tool.slug} size="sm" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-800">
                {tool.badge}
              </span>
            )}
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${style.bg} ${style.text} capitalize`}>
              {tool.category}
            </span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 flex items-center justify-between">
          {tool.name}
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          In-Browser
        </span>
        <span className="font-mono text-slate-500">
          {tool.outputFormat}
        </span>
      </div>
    </a>
  );
};
