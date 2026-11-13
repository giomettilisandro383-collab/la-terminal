/**
 * ============================================================================
 * INTEGRACIÓN CON APPSHEET REST API v2 — CARRUSEL DE COMBOS (LA TERMINAL)
 * ============================================================================
 *
 * Conecta el carrusel con la API de AppSheet filtrando exclusivamente los
 * registros donde `Categoria` sea igual a "Combo" y extrayendo únicamente
 * las columnas `Imagen` y `Texto` (ignorando columnas administrativas/finanzas).
 *
 * ¿QUÉ FALTA PARA ACTIVARLO EN VIVO?
 * - El `ACCESS_KEY` ya está configurado.
 * - Solo falta colocar tu `APP_ID` (Application ID de AppSheet) y verificar el
 *   `TABLE_NAME` exacto en `APPSHEET_CONFIG` aquí abajo o mediante `.env`:
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

  // 2. COLOCÁ AQUÍ TU APPLICATION ID DE APPSHEET (o usá VITE_APPSHEET_APP_ID en .env):
  APP_ID: import.meta.env.VITE_APPSHEET_APP_ID || '',

  // 3. NOMBRE EXACTO DE LA TABLA EN APPSHEET:
  TABLE_NAME: import.meta.env.VITE_APPSHEET_TABLE_NAME || 'Galeria_Productos',

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
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://www.appsheet.com/template/gettablefileurl?appName=${encodeURIComponent(config.APP_ID.trim())}&tableName=${encodeURIComponent(config.TABLE_NAME.trim())}&fileName=${encodeURIComponent(trimmed)}`;
}

export type AppSheetFetchResult =
  | { status: 'unconfigured'; slides: [] }
  | { status: 'empty'; slides: [] }
  | { status: 'ready'; slides: AppSheetComboSlide[] };

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

    // 1. FILTRAR Y MAPEAR: Nos quedamos solo con Categoria === 'combo'
    // y extraemos exclusivamente `Imagen` y `Texto` (ignorando finanzas, costos, etc.).
    const itemsCombo: AppSheetComboSlide[] = rawRows
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .filter(
        (item) =>
          typeof item.Categoria === 'string' &&
          item.Categoria.trim().toLowerCase() === 'combo',
      )
      .map((item, index) => {
        const rawImagen = typeof item.Imagen === 'string' ? item.Imagen : '';
        const rawTexto = typeof item.Texto === 'string' ? item.Texto.trim() : '';
        const imagenUrl = resolveAppSheetImageUrl(rawImagen, config);

        return {
          id: String(item.ID ?? item.Id ?? item._RowNumber ?? `combo-${index}`),
          imagenUrl,
          texto: rawTexto || 'Combo artesanal La Terminal',
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
