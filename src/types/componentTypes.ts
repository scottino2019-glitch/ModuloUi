export type ComponentCategory =
  | 'all'
  | 'structure'
  | 'media'
  | 'interactive'
  | 'forms-data';

export interface ComponentCatalogItem {
  id: string;
  name: string;
  componentName: string;
  fileName: string;
  cssFileName: string;
  category: Exclude<ComponentCategory, 'all'>;
  categoryLabel: string;
  summary: string;
  layoutHint: 'full-width' | 'centered-card';
  sourceCode: string;
  cssCode: string;
}
