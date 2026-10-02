# Web de Drub Tech

Publicada con GitHub Pages en **https://drubtech.github.io** desde el repositorio público
`drubtech/drubtech.github.io`. Esta carpeta es el original: se edita aquí, se guarda en un commit y se publica con:

```powershell
.\scripts\publicar-web.ps1
```

Para verla en local: `python -m http.server 8090 --directory web` → http://localhost:8090
(en local, la política se abre como `vatio/privacidad.html`; en GitHub Pages también sin `.html`).

| Página | Dirección |
|---|---|
| `index.html` | https://drubtech.github.io — portada del estudio (estilo claro) |
| `vatio/index.html` | https://drubtech.github.io/vatio/ — página de Vatio (azul petróleo) |
| `vatio/privacidad.html` | https://drubtech.github.io/vatio/privacidad — **la que va en Play Console** |

- Estilos comunes en `assets/estilo.css`: `body.studio` para la portada, `body.vatio` para las páginas de la app.
- La herramienta «¿Cuántos vatios admite tu móvil?» (`assets/web.js`) lee el catálogo publicado en
  `Deividru/vatio-catalog`, el mismo que usa la app.
- Para añadir una app nueva: una tarjeta `.app-card` en `index.html` y una carpeta propia como `vatio/`.

**Pendiente:** el contacto es Instagram de forma provisional; cuando exista el correo de la marca, ponerlo en
la política, en el pie y en la sección de beta.
