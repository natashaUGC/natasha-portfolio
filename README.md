# NE Studio — Portafolio de Natasha Esparza

Hola! Este es mi Sitio Web

## Estructura del proyecto

```text
.
├── index.html              → Todo el contenido y estructura del sitio
├── styles.css               → Design tokens + estilos (mobile-first)
├── script.js                → Menú móvil, scroll reveal, header sticky
├── robots.txt
├── sitemap.xml
├── .gitignore
├── .github/workflows/deploy.yml   → Deploy automático a GitHub Pages
└── assets/
    └── images/
        ├── README.txt        → Qué imagen va en qué archivo
        └── favicon.svg        → Monograma "NE" (ya incluido)
```

No hay `src/`, `node_modules/` ni paso de build: es HTML/CSS/JS que
el navegador ejecuta directamente. Esto reduce la superficie de
ataque (sin dependencias npm que auditar) y simplifica el deploy.

## Seguridad — qué se implementó y por qué

El sitio es 100% frontend, pero se construyó con mentalidad
*secure-by-design*:

- **Sin `innerHTML`, `eval`, `new Function` ni `document.write`.**
  Todo el DOM dinámico en `script.js` usa `textContent`,
  `classList` y `setAttribute` sobre nodos ya existentes.
- **Ningún dato de la URL** (query params, hash) se lee ni se
  inserta en el DOM — no hay superficie de XSS reflejado.
- **Sin `localStorage`/`sessionStorage`/cookies.** No hay nada que
  proteger porque no se guarda nada.
- **Enlaces externos** (`target="_blank"`) siempre llevan
  `rel="noopener noreferrer"` para evitar *reverse tabnabbing*.
- **Cero dependencias npm y cero scripts de terceros.** Ninguna
  librería externa, ninguna fuente de Google Fonts, ningún CDN: se
  usan fuentes del sistema. Menos dependencias = menos superficie de
  supply-chain.
- **Content-Security-Policy vía `<meta>`** en `index.html`,
  restrictiva (`default-src 'self'`, sin `unsafe-inline` ni
  `unsafe-eval`, `object-src 'none'`, `frame-ancestors 'none'`).

  **Limitación importante:** GitHub Pages no permite configurar
  *response headers* HTTP personalizados. Una CSP en `<meta>` es una
  mitigación parcial: no puede aplicar `frame-ancestors` (esa
  directiva solo funciona como header real) ni `report-uri`, y no
  protege recursos cargados antes de que el HTML se parsee. Si en el
  futuro se migra a un hosting que sí permita headers (Netlify,
  Cloudflare Pages, Vercel), se recomienda mover esta política a un
  header real y añadir `X-Frame-Options` / `frame-ancestors` para
  mitigar clickjacking correctamente — algo que GitHub Pages no
  puede hacer.
- **`X-Content-Type-Options: nosniff` y `Referrer-Policy`** también
  vía `<meta>`, con la misma limitación documentada arriba.
- **`.gitignore`** excluye cualquier `.env*` — no debería existir
  ningún secreto en este proyecto (no hay backend ni API keys), pero
  el archivo queda como salvaguarda si en el futuro se agrega algo
  que los use.
- **GitHub Actions con permisos mínimos:** el workflow de deploy
  usa `permissions: contents: read, pages: write, id-token: write`
  — nunca `write-all` — y todas las Actions de terceros están
  fijadas a una versión mayor oficial (`actions/checkout@v4`,
  `actions/configure-pages@v5`, etc.).

### Recomendado activar en GitHub (no requiere código)

- **Dependabot** (Settings → Security → Dependabot): no hay
  `package.json` todavía, pero si se agregan dependencias en el
  futuro, actívalo para alertas automáticas de vulnerabilidades.
- **Secret scanning** (Settings → Security → Secret scanning):
  gratuito en repos públicos, detecta si alguna vez se sube un
  secreto por error.
- **CodeQL**: opcional para este proyecto (es HTML/CSS/JS estático
  sin lógica compleja), pero no cuesta nada dejarlo activado si el
  repo crece.

### Checklist de revisión rápida

- [x] Sin `innerHTML`/`eval` innecesarios
- [x] Sin API keys, tokens ni credenciales en el código
- [x] Sin dependencias npm (nada que auditar)
- [x] Enlaces externos con `noopener noreferrer`
- [x] CSP restrictiva vía `<meta>`, con su limitación documentada
- [x] Workflow de GitHub Actions con permisos mínimos
- [x] El repositorio puede ser público sin exponer información
      sensible (solo contiene contenido pensado para ser público)

## Solución de problemas

- **El menú móvil no cierra al hacer clic en un link:** confirma que
  `script.js` se está cargando (revisa la consola del navegador por
  errores 404 en la ruta `script.js`).
- **Las imágenes no aparecen:** revisa que los nombres de archivo en
  `assets/images/` coincidan exactamente (sensible a mayúsculas) con
  los que espera `index.html` (ver `assets/images/README.txt`).
- **El sitio se ve distinto en GitHub Pages que en local:** si el
  repo no se llama `tu-usuario.github.io`, la URL final incluye
  `/nombre-repo/` — no afecta a este proyecto porque todas las rutas
  de `index.html` son relativas, pero conviene probar la URL real
  después de publicar.
