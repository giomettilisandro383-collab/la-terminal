import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const rootDir = process.cwd();
const distAssetsDir = path.join(rootDir, 'dist', 'assets');
const publicAssetsDir = path.join(rootDir, 'public', 'assets', 'aistudio');
const docsDir = path.join(rootDir, 'docs');
const docsAssetsDir = path.join(docsDir, 'assets', 'aistudio');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyImages() {
  ensureDir(docsAssetsDir);
  if (!fs.existsSync(publicAssetsDir)) return;

  const files = fs.readdirSync(publicAssetsDir);
  for (const file of files) {
    if (/\.(png|jpe?g|webp|svg|gif)$/i.test(file)) {
      fs.copyFileSync(
        path.join(publicAssetsDir, file),
        path.join(docsAssetsDir, file),
      );
    }
  }
}

function readCompiledCss() {
  if (!fs.existsSync(distAssetsDir)) {
    throw new Error('dist/assets not found. Run "vite build" first.');
  }
  const cssFiles = fs
    .readdirSync(distAssetsDir)
    .filter((f) => f.endsWith('.css'));

  return cssFiles
    .map((f) => fs.readFileSync(path.join(distAssetsDir, f), 'utf8'))
    .join('\n');
}

async function bundleIifeJs() {
  const result = await build({
    entryPoints: [path.join(rootDir, 'src', 'main.tsx')],
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    target: ['es2020', 'chrome87', 'firefox78', 'safari14'],
    jsx: 'automatic',
    minify: true,
    alias: {
      '@': rootDir,
    },
    loader: {
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl',
      '.png': 'dataurl',
      '.webp': 'dataurl',
      '.svg': 'dataurl',
      '.css': 'empty',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      'import.meta.env.VITE_APPSHEET_BASE_URL': JSON.stringify(
        process.env.VITE_APPSHEET_BASE_URL || '',
      ),
      'import.meta.env.VITE_APPSHEET_APP_ID': JSON.stringify(
        process.env.VITE_APPSHEET_APP_ID || '',
      ),
      'import.meta.env.VITE_APPSHEET_TABLE_NAME': JSON.stringify(
        process.env.VITE_APPSHEET_TABLE_NAME || '',
      ),
      'import.meta.env.VITE_APPSHEET_ACCESS_KEY': JSON.stringify(
        process.env.VITE_APPSHEET_ACCESS_KEY || '',
      ),
      'import.meta.env': '{}',
    },
  });

  if (!result.outputFiles || result.outputFiles.length === 0) {
    throw new Error('esbuild produced no output');
  }

  return result.outputFiles[0].text;
}

async function main() {
  ensureDir(docsDir);
  copyImages();

  const cssContent = readCompiledCss();
  const jsContent = await bundleIifeJs();

  const templateHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  // Escape closing style/script tags inside inline blocks
  const safeCss = cssContent.replace(/<\/style/gi, '<\\/style');
  const safeJs = jsContent.replace(/<\/script/gi, '<\\/script');

  let standaloneHtml = templateHtml.replace(
    /<script\s+type="module"\s+src="\/src\/main\.tsx"><\/script>/i,
    '',
  );

  standaloneHtml = standaloneHtml.replace(
    '</head>',
    `    <style>\n${safeCss}\n    </style>\n  </head>`,
  );

  standaloneHtml = standaloneHtml.replace(
    '<div id="root"></div>',
    () => `<div id="root"></div>
    <noscript>
      <div style="padding:2rem;font-family:sans-serif;text-align:center;color:#210f07;background:#fcf9f3;">
        Panadería y Confitería La Terminal — Activá JavaScript para ver la página interactiva.
      </div>
    </noscript>
    <script>\n${safeJs}\n    </script>`,
  );

  fs.writeFileSync(path.join(docsDir, 'index.html'), standaloneHtml, 'utf8');
  console.log('Generated standalone zero-build HTML at docs/index.html');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
