import type { SchemaObject } from '@api-workbench/core';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  schema: SchemaObject;
  value: unknown;
  onChange: (value: unknown) => void;
  required?: boolean;
  depth?: number;
}

function getDefaultValue(schema: SchemaObject): unknown {
  if (schema.default !== undefined) return schema.default;
  if (schema.example !== undefined) return schema.example;
  switch (schema.type) {
    case 'string': return '';
    case 'number':
    case 'integer': return 0;
    case 'boolean': return false;
    case 'array': return [];
    case 'object': return {};
    default: return '';
  }
}

export function FormField({ name, schema, value, onChange, required = false, depth = 0 }: FormFieldProps) {
  const displayValue = value ?? getDefaultValue(schema);
  const isEnum = schema.enum && schema.enum.length > 0;

  if (isEnum) {
    return (
      <div className={cn('space-y-1', depth > 0 && 'ml-4')}>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">
            {name}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">enum</span>
        </label>
        <select
          value={String(displayValue)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">Select...</option>
          {schema.enum!.map((opt) => (
            <option key={String(opt)} value={String(opt)}>
              {String(opt)}
            </option>
          ))}
        </select>
        {schema.description && (
          <p className="text-xs text-muted-foreground">{schema.description}</p>
        )}
      </div>
    );
  }

  switch (schema.type) {
    case 'boolean':
      return (
        <div className={cn('space-y-1', depth > 0 && 'ml-4')}>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {name}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">boolean</span>
          </label>
          <button
            type="button"
            onClick={() => onChange(!displayValue)}
            className={cn(
              'relative w-10 h-5 rounded-full transition-colors',
              displayValue ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                displayValue ? 'left-5' : 'left-0.5'
              )}
            />
          </button>
          {schema.description && (
            <p className="text-xs text-muted-foreground">{schema.description}</p>
          )}
        </div>
      );

    case 'number':
    case 'integer':
      return (
        <div className={cn('space-y-1', depth > 0 && 'ml-4')}>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {name}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{schema.type}</span>
          </label>
          <input
            type="number"
            value={Number(displayValue)}
            onChange={(e) => onChange(schema.type === 'integer' ? parseInt(e.target.value, 10) : parseFloat(e.target.value))}
            className="w-full px-3 py-2 rounded-md border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {schema.description && (
            <p className="text-xs text-muted-foreground">{schema.description}</p>
          )}
        </div>
      );

    case 'string': {
      const format = schema.format || '';
      const inputType = format === 'email' ? 'email' : format === 'uri' ? 'url' : format === 'password' ? 'password' : format === 'date' ? 'date' : format === 'date-time' ? 'datetime-local' : 'text';

      return (
        <div className={cn('space-y-1', depth > 0 && 'ml-4')}>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {name}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {format || 'string'}
            </span>
          </label>
          <input
            type={inputType}
            value={String(displayValue)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.description || `Enter ${name}...`}
            className="w-full px-3 py-2 rounded-md border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {schema.description && (
            <p className="text-xs text-muted-foreground">{schema.description}</p>
          )}
        </div>
      );
    }

    case 'array': {
      const items = schema.items as SchemaObject | undefined;
      const arr = Array.isArray(displayValue) ? displayValue : [];

      return (
        <div className={cn('space-y-2', depth > 0 && 'ml-4')}>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {name}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">array</span>
          </label>
          <div className="space-y-2">
            {arr.map((item: unknown, i: number) => (
              <div key={i} className="flex items-center gap-2">
                {items?.type === 'object' ? (
                  <div className="flex-1 p-3 rounded-md border bg-muted/30">
                    <span className="text-xs text-muted-foreground">Item {i + 1} (object)</span>
                  </div>
                ) : (
                  <input
                    type={items?.type === 'number' || items?.type === 'integer' ? 'number' : 'text'}
                    value={String(item ?? '')}
                    onChange={(e) => {
                      const newArr = [...arr];
                      newArr[i] = items?.type === 'number' || items?.type === 'integer'
                        ? Number(e.target.value)
                        : e.target.value;
                      onChange(newArr);
                    }}
                    className="flex-1 px-3 py-2 rounded-md border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                )}
                <button
                  type="button"
                  onClick={() => onChange(arr.filter((_: unknown, idx: number) => idx !== i))}
                  className="p-1 text-destructive hover:bg-destructive/10 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange([...arr, getDefaultValue(items || { type: 'string' })])}
              className="text-xs px-3 py-1.5 rounded-md border border-dashed hover:bg-accent transition-colors"
            >
              + Add item
            </button>
          </div>
        </div>
      );
    }

    case 'object': {
      const props = schema.properties || {};
      const req = schema.required || [];
      const obj = typeof displayValue === 'object' && displayValue !== null && !Array.isArray(displayValue)
        ? displayValue as Record<string, unknown>
        : {};

      return (
        <div className={cn('space-y-3 p-3 rounded-md border bg-muted/20', depth > 0 && 'ml-4')}>
          <label className="flex items-center gap-2 text-sm font-medium">
            {name}
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">object</span>
          </label>
          {Object.entries(props).map(([key, propSchema]) => (
            <FormField
              key={key}
              name={key}
              schema={propSchema}
              value={obj[key]}
              onChange={(val) => {
                const newObj = { ...obj, [key]: val };
                onChange(newObj);
              }}
              required={req.includes(key)}
              depth={depth + 1}
            />
          ))}
        </div>
      );
    }

    default:
      return (
        <div className={cn('space-y-1', depth > 0 && 'ml-4')}>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {name}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </span>
          </label>
          <input
            type="text"
            value={String(displayValue)}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      );
  }
}
