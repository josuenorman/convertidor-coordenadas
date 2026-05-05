# Utilidades SIG web

Aplicación web libre para apoyar tareas básicas de SIG, levantamiento de información territorial y organización de coordenadas.

## Utilidad principal

La herramienta permite convertir, capturar, importar, plotear, editar y exportar datos de coordenadas geográficas y UTM, especialmente útil para trabajo de campo, UMGIR, diagnósticos comunitarios, gestión del riesgo e integración con QGIS.

## Funciones principales

- Trabajo por proyectos.
- Conversión WGS84 Geográficas ↔ UTM.
- Captura de puntos directamente desde el mapa con nombre.
- Mapa con capas base y búsqueda de lugares.
- Uso de ubicación del dispositivo.
- Importación de CSV y Excel con selección de campos X/Y.
- Selección de sistema de coordenadas: Geográficas o UTM WGS84 Nicaragua, zonas 16N y 17N.
- Carga de Shapefile ZIP para plotear datos en el mapa.
- Tabla editable con numeración automática, etiquetas y zoom a puntos.
- Exportación en CSV y GeoJSON para uso en Excel y QGIS.

## Versión actual

**v1.15**

Cambios principales:

- Nombre actualizado a **Utilidades SIG web**.
- Se eliminó la sección OCR/imagen para reducir redundancia.
- Se incorporó módulo SIG para importar CSV, Excel y Shapefile.
- Se optimizó la distribución visual para priorizar módulo SIG, mapa y tabla.
- Se simplificó la exportación a CSV y GeoJSON.

## Privacidad

La aplicación no usa base de datos ni servidor propio. Los proyectos y puntos se guardan localmente en el navegador de cada usuario.

## Enlace público

```text
https://josuenorman.github.io/convertidor-coordenadas/
```

## Nota

El nombre del repositorio se mantiene como `convertidor-coordenadas` para no romper el enlace público existente. La aplicación visible y la documentación ya usan el nuevo nombre: **Utilidades SIG web**.
