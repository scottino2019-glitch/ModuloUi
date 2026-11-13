export type ComponentCategory = 'all' | 'structure' | 'media' | 'interactive' | 'forms-data';

export type PropFieldType =
  | 'string'
  | 'textarea'
  | 'boolean'
  | 'select'
  | 'color'
  | 'number'
  | 'json';

export interface PropSelectOption {
  label: string;
  value: string;
}

export interface PropFieldSchema {
  key: string;
  label: string;
  type: PropFieldType;
  description?: string;
  options?: PropSelectOption[];
  min?: number;
  max?: number;
  step?: number;
}

export type PropValues = Record<string, unknown>;

export interface ComponentCatalogItem {
  id: string;
  name: string;
  componentName: string;
  fileName: string;
  category: Exclude<ComponentCategory, 'all'>;
  categoryLabel: string;
  summary: string;
  layoutHint: 'full-width' | 'centered-card';
  propSchema: PropFieldSchema[];
  defaultProps: PropValues;
  sourceCode: string;
}
