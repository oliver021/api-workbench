import { useState } from 'react';
import type { RequestBody } from '@api-workbench/core';

interface RequestBodyFormProps {
  requestBody: RequestBody;
}

export function RequestBodyForm({ requestBody }: RequestBodyFormProps) {
  const [body, setBody] = useState<string>(() => {
    const contentType = requestBody.content['application/json'];
    if (contentType?.example) {
      return JSON.stringify(contentType.example, null, 2);
    }
    if (contentType?.schema?.properties) {
      const example: Record<string, unknown> = {};
      for (const [key, prop] of Object.entries(contentType.schema.properties)) {
        if (prop.default !== undefined) {
          example[key] = prop.default;
        } else if (prop.type === 'string') {
          example[key] = '';
        } else if (prop.type === 'number' || prop.type === 'integer') {
          example[key] = 0;
        } else if (prop.type === 'boolean') {
          example[key] = false;
        }
      }
      return JSON.stringify(example, null, 2);
    }
    return '';
  });

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Request Body
        {requestBody.required && (
          <span className="text-destructive ml-1">*</span>
        )}
      </h3>
      {requestBody.description && (
        <p className="text-xs text-muted-foreground mb-3">{requestBody.description}</p>
      )}
      <div className="relative">
        <div className="absolute top-2 left-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          application/json
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full pl-[130px] pr-3 pt-8 py-2 rounded-md border bg-card text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
