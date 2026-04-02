import type { SchemaObject } from '@api-workbench/core';
import { FormField } from './FormField';

interface SchemaFormProps {
  schema: SchemaObject;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
}

export function SchemaForm({ schema, value, onChange }: SchemaFormProps) {
  const props = schema.properties || {};
  const required = schema.required || [];

  return (
    <div className="space-y-4">
      {Object.entries(props).map(([key, propSchema]) => (
        <FormField
          key={key}
          name={key}
          schema={propSchema}
          value={value[key]}
          onChange={(val) => onChange({ ...value, [key]: val })}
          required={required.includes(key)}
        />
      ))}
    </div>
  );
}
