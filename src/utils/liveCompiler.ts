import * as React from 'react';
import { transform } from 'sucrase';

export interface CompileResult {
  Component: React.ComponentType<Record<string, unknown>> | null;
  error: string | null;
}

/**
 * Compiles standalone TSX/JSX/JS component code in-browser via Sucrase
 * and resolves its default (or primary) exported React component.
 */
export function compileTsxComponent(sourceCode: string): CompileResult {
  try {
    const transformed = transform(sourceCode, {
      transforms: ['typescript', 'jsx', 'imports'],
      jsxRuntime: 'classic',
      production: true,
    });

    const exportsObj: Record<string, unknown> = {};
    const moduleObj = { exports: exportsObj };

    const customRequire = (moduleId: string) => {
      if (moduleId === 'react' || moduleId === 'react/jsx-runtime') {
        return React;
      }
      if (moduleId.endsWith('.css')) {
        return {};
      }
      throw new Error(
        `Importazione esterna "${moduleId}" non disponibile nell'anteprima sandbox. Usa React puro o CSS nella scheda CSS.`
      );
    };

    const evaluator = new Function(
      'React',
      'require',
      'exports',
      'module',
      transformed.code
    );

    evaluator(React, customRequire, exportsObj, moduleObj);

    const resolvedExports =
      moduleObj.exports && typeof moduleObj.exports === 'object'
        ? (moduleObj.exports as Record<string, unknown>)
        : exportsObj;

    const candidate =
      (typeof moduleObj.exports === 'function' ? moduleObj.exports : null) ||
      resolvedExports.default ||
      Object.values(resolvedExports).find((val) => typeof val === 'function');

    if (typeof candidate !== 'function') {
      return {
        Component: null,
        error:
          'Nessun componente React esportato trovato. Assicurati di avere un "export default function ...".',
      };
    }

    return {
      Component: candidate as React.ComponentType<Record<string, unknown>>,
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Errore di sintassi sconosciuto.';
    return {
      Component: null,
      error: message,
    };
  }
}
