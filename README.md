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
- Cada usuario descarga su propio CSV.

## Uso local

```bash
npm install
npm run dev
```
##La URL es:

```text
https://josuenorman.github.io/convertidor-coordenadas/
```

## Nota sobre Google Maps

Google Maps requiere API Key y condiciones específicas de uso. Por eso esta versión usa mapas base públicos: OpenStreetMap, OpenTopoMap y Esri World Imagery.
