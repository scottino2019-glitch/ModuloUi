import * as React from 'react';
import { transform } from 'sucrase';

export interface CompileResult {
  Component: React.ComponentType<Record<string, unknown>> | null;
  defaultProps: Record<string, unknown> | null;
  error: string | null;
}

/**
 * Compiles standalone TSX/JSX component code in-browser via Sucrase
 * and resolves its default (or primary) exported React component and DEFAULT_PROPS.
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
      throw new Error(
        `Importazione esterna "${moduleId}" non disponibile nell'anteprima sandbox. I componenti autonomi usano solo React.`
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
        defaultProps: null,
        error:
          'Nessun componente React esportato trovato. Assicurati di avere un "export default function ...".',
      };
    }

    const exportedDefaults =
      resolvedExports.DEFAULT_PROPS &&
      typeof resolvedExports.DEFAULT_PROPS === 'object' &&
      !Array.isArray(resolvedExports.DEFAULT_PROPS)
        ? (resolvedExports.DEFAULT_PROPS as Record<string, unknown>)
        : null;

    return {
      Component: candidate as React.ComponentType<Record<string, unknown>>,
      defaultProps: exportedDefaults,
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Errore di sintassi sconosciuto.';
    return {
      Component: null,
      defaultProps: null,
      error: message,
    };
  }
}
