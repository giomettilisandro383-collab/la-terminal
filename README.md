# Panadería y Confitería La Terminal — Sitio Web Oficial

Sitio web oficial de **Panadería y Confitería La Terminal** (*de Rebeca Morón · Neuquén 1450, Villa Constitución, Santa Fe*).

## Opción 1: Abrir directo sin compilar (Local y GitHub Pages)

El proyecto ya incluye una versión lista para usar en **`docs/index.html`** (con estilos y código integrados sin módulos ES ni dependencias externas):

- **En tu computadora**: abrí el archivo **`docs/index.html`** con doble clic en Chrome, Edge o Firefox.
- **En GitHub Pages (sin compilar)**:
  1. Subí el repositorio a GitHub.
  2. Entrá a **Settings → Pages**.
  3. En **Build and deployment → Source**, elegí **Deploy from a branch**, seleccioná tu rama (`main` o `master`) y la carpeta **`/docs`**.
  4. Guardá y tu web quedará publicada automáticamente.

---

## Opción 2: Modo desarrollo o recompilar cambios

Si editás archivos dentro de `src/`, podés probar en vivo o regenerar la carpeta `docs/`:

```bash
npm install
npm run dev          # Vista previa local en http://localhost:3000
npm run build:static # Actualiza dist/ y regenera docs/index.html listo para abrir
```
