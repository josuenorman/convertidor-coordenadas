# Convertidor de Coordenadas

Aplicación web para convertir coordenadas geográficas ↔ UTM, trabajar por proyecto, visualizar puntos en mapa y exportar CSV.

## Funciones principales

- Proyectos independientes.
- Conversión WGS84 geográficas ↔ UTM.
- Ingreso manual de coordenadas.
- Carga de imágenes o capturas para transcribir coordenadas.
- Extracción de coordenadas desde texto pegado.
- Mapa con capas base:
  - OSM calles
  - OpenTopoMap
  - Satelital Esri
- Captura de coordenadas haciendo clic sobre el mapa.
- Tabla editable.
- Exportación CSV compatible con Excel, QGIS y Google Earth.

## Privacidad

La aplicación no usa servidor ni base de datos. Cada usuario guarda sus proyectos localmente en su propio navegador usando `localStorage`.

Eso significa que:

- Los datos de una persona no los ve otra persona.
- No hay cuentas ni contraseñas.
- Cada usuario descarga su propio CSV.

## Uso local

```bash
npm install
npm run dev
```

## Publicación

Este repositorio está preparado para publicarse con GitHub Pages mediante GitHub Actions.

La URL pública esperada será:

```text
https://josuenorman.github.io/convertidor-coordenadas/
```

## Nota sobre Google Maps

Google Maps requiere API Key y condiciones específicas de uso. Por eso esta versión usa mapas base públicos: OpenStreetMap, OpenTopoMap y Esri World Imagery.
