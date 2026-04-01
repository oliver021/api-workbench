import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { HttpMethod } from '@api-workbench/core';
import { METHOD_COLORS } from '@api-workbench/core';
import { cn } from '@/lib/utils';

interface MethodBadgeProps {
  method: HttpMethod | string;
  size?: 'sm' | 'md' | 'lg';
}

export function MethodBadge({ method, size = 'md' }: MethodBadgeProps) {
  const color = METHOD_COLORS[method as HttpMethod] || '#888';

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-1',
    lg: 'text-xs px-3 py-1.5',
  };

  return (
    <span
      className={cn('font-bold rounded flex-shrink-0', sizeClasses[size])}
      style={{
        color,
        backgroundColor: `${color}20`,
      }}
    >
      {method}
    </span>
  );
}

interface BackButtonProps {
  onClick?: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={onClick || (() => navigate('/'))}
      className={cn(
        'flex items-center gap-1.5 text-sm text-muted-foreground',
        'hover:text-foreground transition-colors'
      )}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}
