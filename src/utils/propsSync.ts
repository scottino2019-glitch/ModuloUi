import { PropValues } from '../types/componentTypes';

/**
 * Finds `export const DEFAULT_PROPS... = { ... };` using a brace-balanced scan
 * (ignoring string literals) and replaces the object literal with updated JSON props.
 */
export function syncDefaultPropsInSource(
  sourceCode: string,
  nextProps: PropValues
): string {
  const marker = 'export const DEFAULT_PROPS';
  const markerIndex = sourceCode.indexOf(marker);
  if (markerIndex === -1) return sourceCode;

  const equalsIndex = sourceCode.indexOf('=', markerIndex);
  if (equalsIndex === -1) return sourceCode;

  const openBraceIndex = sourceCode.indexOf('{', equalsIndex);
  if (openBraceIndex === -1) return sourceCode;

  let depth = 0;
  let inString: '"' | "'" | '`' | null = null;
  let escaped = false;
  let closeBraceIndex = -1;

  for (let i = openBraceIndex; i < sourceCode.length; i++) {
    const ch = sourceCode[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      continue;
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        closeBraceIndex = i;
        break;
      }
    }
  }

  if (closeBraceIndex === -1) return sourceCode;

  const serialized = JSON.stringify(nextProps, null, 2);
  return (
    sourceCode.slice(0, openBraceIndex) +
    serialized +
    sourceCode.slice(closeBraceIndex + 1)
  );
}

/**
 * Generates a clean, copyable JSX usage example for the active component.
 */
export function buildUsageSnippet(
  componentName: string,
  fileName: string,
  props: PropValues
): string {
  const importPath = `./components/${fileName.replace(/\.tsx$/, '')}`;
  const entries = Object.entries(props);

  const formattedProps = entries
    .map(([key, value]) => {
      if (typeof value === 'string') {
        const safe = value.replace(/"/g, '\\"').replace(/\n/g, '\\n');
        return `      ${key}="${safe}"`;
      }
      if (typeof value === 'boolean') {
        return value ? `      ${key}` : `      ${key}={false}`;
      }
      if (typeof value === 'number') {
        return `      ${key}={${value}}`;
      }
      const jsonIndented = JSON.stringify(value, null, 2)
        .split('\n')
        .map((line, idx) => (idx === 0 ? line : `      ${line}`))
        .join('\n');
      return `      ${key}={${jsonIndented}}`;
    })
    .join('\n');

  return `import ${componentName} from '${importPath}';\n\nexport function EsempioPagina() {\n  return (\n    <${componentName}\n${formattedProps}\n    />\n  );\n}`;
}
