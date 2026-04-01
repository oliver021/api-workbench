import { useState } from 'react';
import type { Parameter } from '@api-workbench/core';

interface ParameterFormProps {
  parameters: Parameter[];
}

export function ParameterForm({ parameters }: ParameterFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const pathParams = parameters.filter((p) => p.in === 'path');
  const queryParams = parameters.filter((p) => p.in === 'query');
  const headerParams = parameters.filter((p) => p.in === 'header');

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const renderParam = (param: Parameter) => (
    <div key={param.name} className="space-y-1">
      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium">
          {param.name}
          {param.required && <span className="text-destructive ml-0.5">*</span>}
        </span>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {param.in}
        </span>
        {param.schema?.type && (
          <span className="text-xs text-muted-foreground font-mono">
            {param.schema.type}
          </span>
        )}
      </label>
      <input
        type={param.schema?.type === 'integer' || param.schema?.type === 'number' ? 'number' : 'text'}
        value={values[param.name] || ''}
        onChange={(e) => handleChange(param.name, e.target.value)}
        placeholder={param.description || `Enter ${param.name}...`}
        className="w-full px-3 py-2 rounded-md border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      {param.description && (
        <p className="text-xs text-muted-foreground">{param.description}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {pathParams.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Path Parameters
          </h3>
          <div className="grid gap-4">
            {pathParams.map(renderParam)}
          </div>
        </div>
      )}

      {queryParams.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Query Parameters
          </h3>
          <div className="grid gap-4">
            {queryParams.map(renderParam)}
          </div>
        </div>
      )}

      {headerParams.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Headers
          </h3>
          <div className="grid gap-4">
            {headerParams.map(renderParam)}
          </div>
        </div>
      )}
    </div>
  );
}
