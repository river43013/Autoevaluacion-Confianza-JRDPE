# Autoevaluación de confianza del líder

Formulario web anónimo conectado a Supabase. Conserva las siete situaciones y la puntuación validada del formulario original (mínimo 7, máximo 28).

## Enlace por sesión

Usa el parámetro `sesion` para identificar cada aplicación sin pedir datos personales:

```text
https://river43013.github.io/Autoevaluacion-Confianza-JRDPE/?sesion=Administrativos-Septiembre
```

## Reportes

En Supabase abre **Table Editor → leadership_confidence_report**. Allí cada alternativa aparece con su texto completo. Puedes filtrar por `submitted_at` o `session_label` y usar **Export data → CSV**. Las columnas `total_score` y `result_level` son calculadas por PostgreSQL, no por el navegador.

## Seguridad

- El frontend utiliza únicamente la clave pública de Supabase.
- RLS está activa.
- El rol público solo puede insertar las columnas de respuesta.
- El enlace público no puede leer, modificar ni eliminar respuestas.
- Nunca se usa una clave secreta o `service_role` en GitHub Pages.

## Escala

- 24–28: Construye confianza de forma consistente.
- 17–23: En camino de fortalecer la confianza.
- 7–16: Necesita fortalecer la confianza.
