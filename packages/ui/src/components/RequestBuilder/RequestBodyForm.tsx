import { useState, useCallback } from 'react';
import type { RequestBody } from '@api-workbench/core';
import { JsonEditor } from './JsonEditor';
import { SchemaForm } from './SchemaForm';
import { cn } from '@/lib/utils';

interface RequestBodyFormProps {
  requestBody: RequestBody;
}

type Tab = 'json' | 'form';

function generateInitialJson(requestBody: RequestBody): string {
  const jsonContent = requestBody.content['application/json'];
  if (jsonContent?.example) {
    return JSON.stringify(jsonContent.example, null, 2);
  }
  if (jsonContent?.schema?.properties) {
    const defaults: Record<string, unknown> = {};
    for (const [key, prop] of Object.entries(jsonContent.schema.properties)) {
      if (prop.default !== undefined) defaults[key] = prop.default;
      else if (prop.example !== undefined) defaults[key] = prop.example;
      else if (prop.type === 'string') defaults[key] = '';
      else if (prop.type === 'number' || prop.type === 'integer') defaults[key] = 0;
      else if (prop.type === 'boolean') defaults[key] = false;
      else if (prop.type === 'array') defaults[key] = [];
      else if (prop.type === 'object') defaults[key] = {};
    }
    return JSON.stringify(defaults, null, 2);
  }
  return '{}';
}

export function RequestBodyForm({ requestBody }: RequestBodyFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>('json');
  const [jsonValue, setJsonValue] = useState(() => generateInitialJson(requestBody));
  const [formValue, setFormValue] = useState<Record<string, unknown>>(() => {
    try {
      return JSON.parse(generateInitialJson(requestBody));
    } catch {
      return {};
    }
  });

  const contentTypes = Object.keys(requestBody.content);
  const jsonSchema = requestBody.content['application/json']?.schema;

  const handleTabSwitch = useCallback((tab: Tab) => {
    if (tab === 'form' && activeTab === 'json') {
      try {
        const parsed = JSON.parse(jsonValue);
        setFormValue(parsed);
      } catch {
        return;
      }
    } else if (tab === 'json' && activeTab === 'form') {
      setJsonValue(JSON.stringify(formValue, null, 2));
    }
    setActiveTab(tab);
  }, [activeTab, jsonValue, formValue]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Request Body
          {requestBody.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </h3>
        {contentTypes.length > 1 && (
          <div className="flex gap-1">
            {contentTypes.map((ct) => (
              <span
                key={ct}
                className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
              >
                {ct}
              </span>
            ))}
          </div>
        )}
      </div>

      {requestBody.description && (
        <p className="text-xs text-muted-foreground mb-3">{requestBody.description}</p>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div className="flex border-b bg-muted/30">
          <button
            type="button"
            onClick={() => handleTabSwitch('json')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2',
              activeTab === 'json'
                ? 'border-primary text-foreground bg-card'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            JSON
          </button>
          {jsonSchema && (
            <button
              type="button"
              onClick={() => handleTabSwitch('form')}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors border-b-2',
                activeTab === 'form'
                  ? 'border-primary text-foreground bg-card'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              Form
            </button>
          )}
        </div>

        <div className="p-4 bg-card">
          {activeTab === 'json' ? (
            <JsonEditor value={jsonValue} onChange={setJsonValue} />
          ) : (
            <SchemaForm
              schema={jsonSchema!}
              value={formValue}
              onChange={(newValue) => setFormValue(newValue)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
