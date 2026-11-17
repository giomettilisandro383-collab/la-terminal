/**
 * ============================================================================
 * INTEGRACIÓN CON APPSHEET REST API v2 — CARRUSEL DE COMBOS (LA TERMINAL)
 * ============================================================================
 *
 * Conecta el carrusel con la API de AppSheet y usa las columnas `Combo`,
 * `Producto` y `Porcentaje` (ignorando columnas administrativas/finanzas).
 *
 * CONFIGURACIÓN:
 * - El `APP_ID` ya está configurado y puede sobrescribirse mediante `.env`.
 * - Verificá el nombre exacto de `TABLE_NAME` en `APPSHEET_CONFIG` o `.env`:
 *     VITE_APPSHEET_APP_ID="tu-app-id"
 *     VITE_APPSHEET_TABLE_NAME="Nombre_Exacto_De_Tu_Tabla"
 */

export interface AppSheetComboSlide {
  id: string;
  imagenUrl: string;
  texto: string;
}

export interface AppSheetConfig {
  /** URL base de la API de AppSheet (global: https://www.appsheet.com/api/v2) */
  BASE_URL: string;
  /** App Application ID provisto por AppSheet */
  APP_ID: string;
  /** Nombre exacto de la tabla de AppSheet */
  TABLE_NAME: string;
  /** Token / ApplicationAccessKey de AppSheet */
  ACCESS_KEY: string;
}

export const APPSHEET_CONFIG: AppSheetConfig = {
  // 1. URL BASE DE LA API DE APPSHEET:
  BASE_URL: import.meta.env.VITE_APPSHEET_BASE_URL || 'https://www.appsheet.com/api/v2',

  // 2. APPLICATION ID DE APPSHEET (se puede sobrescribir con VITE_APPSHEET_APP_ID):
  APP_ID: import.meta.env.VITE_APPSHEET_APP_ID || '6a29b0e8-f9c9-439d-9fb5-2b1f358e7816',

  // 3. NOMBRE EXACTO DE LA TABLA EN APPSHEET:
  TABLE_NAME: import.meta.env.VITE_APPSHEET_TABLE_NAME || 'Propaganda',

  // 4. APPLICATION ACCESS KEY CONFIGURADO:
  ACCESS_KEY:
    import.meta.env.VITE_APPSHEET_ACCESS_KEY ||
    'V2-7GQeh-SnDrj-ZPqMc-9OCMg-oGQYn-FiViI-Het2W-nmFqF',
};

/**
 * Verifica que tanto `APP_ID`, `TABLE_NAME` como `ACCESS_KEY` estén definidos.
 */
export function isAppSheetConfigured(config: AppSheetConfig = APPSHEET_CONFIG): boolean {
  return Boolean(config.APP_ID.trim() && config.ACCESS_KEY.trim() && config.TABLE_NAME.trim());
}

/**
 * Construye el endpoint oficial de AppSheet REST API v2:
 * POST https://{region}/api/v2/apps/{appId}/tables/{tableName}/Action
 */
export function buildAppSheetEndpoint(config: AppSheetConfig = APPSHEET_CONFIG): string {
  const cleanBase = config.BASE_URL.replace(/\/+$/, '');
  const encodedAppId = encodeURIComponent(config.APP_ID.trim());
  const encodedTable = encodeURIComponent(config.TABLE_NAME.trim());
  return `${cleanBase}/apps/${encodedAppId}/tables/${encodedTable}/Action`;
}

/**
 * Resuelve la URL de la imagen devuelta por AppSheet:
 * - Si ya comienza con `http`, se usa directamente.
 * - Si es una ruta relativa de archivo de AppSheet, se arma `gettablefileurl`.
 */
export function resolveAppSheetImageUrl(
  rawImagen: string,
  config: AppSheetConfig = APPSHEET_CONFIG,
): string {
  const trimmed = rawImagen.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const query = new URLSearchParams({
    appName: config.APP_ID.trim(),
    tableName: config.TABLE_NAME.trim(),
    fileName: trimmed,
  });
  return `https://www.appsheet.com/template/gettablefileurl?${query.toString()}`;
}

export type AppSheetFetchResult =
  | { status: 'unconfigured'; slides: [] }
  | { status: 'empty'; slides: [] }
  | { status: 'ready'; slides: AppSheetComboSlide[] };

function formatAppSheetPercentage(value: unknown): string {
  const stringValue = typeof value === 'string' ? value.trim() : '';
  const includesPercentSymbol = stringValue.endsWith('%');
  const numericValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(stringValue.replace(/%$/, '').replace(',', '.'))
        : Number.NaN;

  if (!Number.isFinite(numericValue)) return '';

  const percentage =
    includesPercentSymbol || Math.abs(numericValue) > 1 ? numericValue : numericValue * 100;
  return `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(percentage)}% de descuento`;
}

/**
 * ============================================================================
 * FUNCIÓN PRINCIPAL `fetch` — CARGAR CARRUSEL DE COMBOS DESDE APPSHEET
 * ============================================================================
 */
export async function fetchAppSheetCombos(
  config: AppSheetConfig = APPSHEET_CONFIG,
  timeoutMs = 8000,
): Promise<AppSheetFetchResult> {
  if (!isAppSheetConfigured(config)) {
    return { status: 'unconfigured', slides: [] };
  }

  const endpoint = buildAppSheetEndpoint(config);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ApplicationAccessKey: config.ACCESS_KEY.trim(),
      },
      body: JSON.stringify({
        Action: 'Find',
        Properties: {},
        Rows: [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `Error al conectar con la API de AppSheet (HTTP ${response.status})${errorText ? `: ${errorText.slice(0, 120)}` : ''}`,
      );
    }

    const data: unknown = await response.json();

    const rawRows: unknown[] = Array.isArray(data)
      ? data
      : typeof data === 'object' && data !== null && Array.isArray((data as { Rows?: unknown[] }).Rows)
        ? (data as { Rows: unknown[] }).Rows
        : [];

    const itemsCombo: AppSheetComboSlide[] = rawRows
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item, index) => {
        const rawImagen = typeof item.Combo === 'string' ? item.Combo : '';
        const producto = typeof item.Producto === 'string' ? item.Producto.trim() : '';
        const porcentaje = formatAppSheetPercentage(item.Porcentaje);
        const imagenUrl = resolveAppSheetImageUrl(rawImagen, config);

        return {
          id: String(item.IDOfertas ?? item.ID ?? item.Id ?? item._RowNumber ?? `combo-${index}`),
          imagenUrl,
          texto: [producto, porcentaje].filter(Boolean).join(' · ') || 'Combo artesanal La Terminal',
        };
      })
      .filter((combo) => Boolean(combo.imagenUrl));

    if (itemsCombo.length === 0) {
      return { status: 'empty', slides: [] };
    }

    return { status: 'ready', slides: itemsCombo };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(
        'La conexión con AppSheet demoró más de lo esperado. Verificá tu red e intentá nuevamente.',
      );
    }
    throw error instanceof Error
      ? error
      : new Error('Error al conectar con la API de AppSheet.');
  } finally {
    window.clearTimeout(timeoutId);
  }
}
