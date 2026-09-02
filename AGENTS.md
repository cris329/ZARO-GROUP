# Guías para Agentes de Desarrollo - ZARO GROUP

Este archivo contiene los requisitos adicionales obligatorios que todo agente de desarrollo debe seguir al trabajar en el proyecto ZARO GROUP.

---

## EXTENSIÓN FINAL DEL PROMPT - REQUISITOS ADICIONALES OBLIGATORIOS

### RESPONSIVIDAD Y ADAPTABILIDAD

La aplicación debe ser completamente responsiva y adaptarse perfectamente a todos los dispositivos, desde teléfonos móviles con pantallas pequeñas hasta tablets y computadores de escritorio, utilizando un enfoque mobile-first con media queries progresivas, grid layouts flexibles y unidades relativas (rem, vw, vh, %) que permitan que la interfaz se reorganice automáticamente según el tamaño de pantalla.

**Puntos de quiebre definidos:**
- 320px: móviles pequeños
- 480px: móviles grandes
- 768px: tablets
- 1024px: laptops
- 1280px: pantallas grandes

**Comportamiento por dispositivo:**
- **Móviles**: elementos se apilan verticalmente con texto legible de tamaño mínimo 16px
- **Tablets**: distribución en grids de 2 columnas
- **Computadores**: grids de 3 o 4 columnas

**Optimización de imágenes:** usar `srcset` y `sizes` para cargar versiones optimizadas según el dispositivo.

**Fuentes fluidas:** usar `clamp()` para tamaños entre 14px y 18px.

---

### ESTILOS DE BOTONES Y COMPONENTES

Todos los botones deben ser de tipo **Outline** con borde visible de 2px y fondo transparente.

**Variantes de color:**
- `outline-primary`: borde azul, texto azul → hover: fondo azul, texto blanco
- `outline-success`: borde verde
- `outline-danger`: borde rojo
- `outline-warning`: borde amarillo
- `outline-secondary`: borde gris

**Estándares de accesibilidad táctil:**
- Tamaño mínimo de 44px de alto
- Padding horizontal de 16px
- Bordes redondeados de 8px
- Transiciones suaves de 0.3 segundos

**Estados visuales claros:** hover, focus, active y disabled.

**Variantes de tamaño:**
- `small`: 32px
- `large`: 48px

Todos con iconos opcionales y texto descriptivo que indique claramente la acción a realizar.

---

### HTML SEMÁNTICO Y ACCESIBILIDAD

Todo el código HTML debe ser semántico utilizando etiquetas apropiadas:
- `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`
- `figure`, `figcaption`, `time`, `address`, `details`

**Estructura jerárquica:** headings desde h1 hasta h6 sin saltos.

**Atributos ARIA:** `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-required`, `aria-invalid`, `aria-expanded`, y `role` cuando sea necesario.

**Labels:** asociados a inputs con `for`.

**Agrupación:** fieldsets y legends para agrupar campos relacionados.

**Navegación:** landmarks para navegación por teclado, skip links para saltar contenido repetitivo, orden de tabulación lógico.

**Contraste de color:**
- Mínimo 4.5:1 para texto normal
- 3:1 para texto grande

**Tamaño de fuente:** mínimo 16px para evitar zoom en móviles.

**Imágenes:** texto alternativo en todas las imágenes.

**Control total por teclado** sin necesidad de mouse.

**Soporte para lectores de pantalla** con nombres descriptivos.

**Feedback visual claro** para todas las interacciones.

**Cumplimiento:** WCAG 2.1 nivel AA como mínimo.

---

### USABILIDAD UNIVERSAL

La interfaz debe ser tan intuitiva que hasta un niño pequeño pueda usarla.

**Características:**
- Iconos grandes y reconocibles acompañados de texto corto y claro
- Colores de alto contraste y consistentes
- Botones con etiquetas de acción concretas: "Guardar", "Eliminar", "Editar", "Sincronizar" (no términos técnicos)
- Mensajes de error y éxito en lenguaje simple y amigable
- Campos de formulario con placeholders y ejemplos claros
- Retroalimentación visual inmediata en cada acción
- Confirmaciones antes de acciones destructivas
- Modo de alto contraste para personas con discapacidad visual
- Opción de aumentar tamaño de fuente
- Navegación simplificada con máximo 3 pasos para cualquier tarea principal
- Flujo de usuario guiado paso a paso para procesos complejos
- Indicadores de progreso para tareas largas
- Diseño minimalista sin distracciones enfocado en las tareas que los usuarios necesitan realizar

---

### BASE DE DATOS EN 3FN CON AUDITORÍA

La base de datos MySQL debe estar normalizada en **Tercera Forma Normal (3FN)** eliminando dependencias transitivas y asegurando que cada tabla represente una sola entidad con atributos atómicos.

**Claves:**
- Claves primarias auto-incrementales
- Claves foráneas con `ON DELETE RESTRICT` y `ON UPDATE CASCADE` para mantener integridad referencial

**Campos de auditoría obligatorios en TODAS las tablas:**
```sql
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_by VARCHAR(100) NOT NULL,  -- email o ID del usuario que creó
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
updated_by VARCHAR(100) NOT NULL,  -- usuario que realizó la última modificación
deleted_at TIMESTAMP NULL,         -- soft delete
deleted_by VARCHAR(100)            -- usuario que eliminó
```

**Triggers:** automáticos que actualicen estos campos.

**Validaciones:** nunca permitir valores nulos en `created_by` y `updated_by`.

**Campos específicos de negocio:** estado, versión para control de concurrencia optimista, sincronizado para marcado de datos pendientes.

---

### DOCUMENTACIÓN Y ESTÁNDARES DE CÓDIGO

**Límite de archivos:** máximo 150 líneas de código. Si se excede, dividir en archivos adicionales con responsabilidades específicas.

**Cabecera de archivos:** cada archivo debe comenzar con un bloque de comentarios que indique:
- Qué es el archivo
- Por qué se creó
- Dónde se utiliza
- `@author = Cristian Deysdayr Jiménez`

**Comentarios:** cada función, método, estructura y variable debe tener comentarios en lenguaje claro y concreto que expliquen su propósito sin asumir conocimiento previo.

**Nombres de variables:** identificadores claros sin espacios, en español o inglés pero consistentes en todo el proyecto.

**Programación Orientada a Objetos (POO):** aplicar en el frontend con clases, herencia y polimorfismo cuando sea apropiado.

**Reutilización de código:** composición e herencia para evitar duplicación.

**Principios SOLID:** especialmente Single Responsibility Principle (SRP) para que cada clase, módulo y archivo tenga una sola razón para cambiar.

**Patrones de diseño:** Repository, Factory, Singleton y Observer donde sea necesario.

---

### CALIDAD Y SEGURIDAD SEGÚN SONARQUBE

| Métrica | Umbral |
|---------|--------|
| Cobertura de pruebas unitarias | ≥ 80% (Jest para frontend, testing para Go) |
| Duplicación de código | ≤ 3% |
| Hotspots de seguridad | 100% revisados |
| Vulnerabilidades críticas | 0 |
| Vulnerabilidades altas | 0 |
| Bugs | 0 |
| Deuda técnica | ≤ 5% |

**CI/CD:** pipelines que ejecuten SonarQube automáticamente en cada push y pull request, bloqueando el despliegue si no se cumplen estos umbrales.

**Revisiones de seguridad:** herramientas como Snyk y Trivy para escaneo de vulnerabilidades en dependencias y contenedores.

---

### MANEJO DE CLAVES Y SEGURIDAD ESTRICTOS

- **Nunca** claves, contraseñas, tokens o secretos hardcodeados en el código
- Todo debe ser inyectado mediante variables de entorno en tiempo de ejecución
- Todas las entradas de usuarios deben ser validadas con whitelist y sanitizadas
- Comunicaciones frontend-backend mediante **HTTPS** con certificados válidos de Let's Encrypt
- API deben usar **JWT** firmados con algoritmo HS256 o RS256 con expiración máxima de 24 horas
- **Refresh tokens** de 7 días almacenados en cookies HttpOnly o SecureStore
- **CORS** debe restringir solo a dominios específicos autorizados (nunca asterisco en producción)
- Todos los hotspots de seguridad cerrados antes de cualquier despliegue a producción
- Incluir: validación de parámetros, rate limiting, y logging sin información sensible

---

### ESTRUCTURA DE ARCHIVOS Y COMENTARIOS

**Carpetas:** reflejar la separación de responsabilidades con nombres intuitivos:
- `components`, `pages`, `services`, `hooks`, `store`, `types`, `utils`, `tests`, `assets`

**Índices de exportación** para facilitar importaciones.

**Máximo 150 líneas** por archivo; si necesita más, crear nuevo archivo con nombre descriptivo.

**Archivos completamente comentados** en español o inglés en lenguaje claro y concreto.

**Ejemplos de comentarios:**
- "Este archivo contiene el componente ProductCard que muestra un producto en tarjeta con su nombre, precio y cantidad. Se usa en la página ProductsPage y en el Dashboard"
- "Esta función valida que el email tenga formato correcto usando expresión regular"
- "Este hook maneja la sincronización de datos cuando el usuario recupera conexión a internet"

Incluir ejemplos de uso cuando sea apropiado y referencias a otros archivos relacionados.

---

### PRUEBAS Y CALIDAD EN PRODUCCIÓN

**Tipos de pruebas:**
- Pruebas unitarias que cubran casos exitosos y casos límite
- Integración con base de datos real en entorno de test
- Pruebas end-to-end con Cypress o Detox para flujos completos
- Pruebas de carga y estrés para verificar rendimiento en condiciones de conexión limitada

**Monitoreo:**
- Sentry para errores en producción
- Google Analytics para medir uso

**Logs:** estructurados en formato JSON con niveles de severidad (debug, info, warn, error, fatal) y campos de contexto: `request_id`, `user_id`, `ip`, `timestamp`.

**Dashboards:** métricas de rendimiento, errores, sincronización y uso de la aplicación.

---

### ACTUALIZACIONES Y MANTENIMIENTO

**Documentación actualizada en carpeta `docs/`:**
- Guías de instalación
- Guías de desarrollo
- Guías de despliegue
- Solución de problemas

**Archivos de documentación:**
- `README.md` completo con badges de estado, instrucciones claras en español, ejemplos de uso, y enlaces a documentación técnica
- `CHANGELOG.md` con historial de versiones y cambios
- `SECURITY.md` con política de reporte de vulnerabilidades
- `CONTRIBUTING.md` con guías para contribuir al proyecto

**Versionado semántico** y tags en Git para releases estables.

---

### RESUMEN DE REQUISITOS ADICIONALES

| Categoría | Requisito |
|-----------|-----------|
| Responsividad | Total mobile-first con breakpoints en 320, 480, 768, 1024 y 1280px |
| Botones | Tipo Outline con variantes de color y tamaño mínimo 44px |
| HTML | Semántico con atributos ARIA y soporte para lectores de pantalla |
| Usabilidad | Iconos grandes, texto claro y mensajes simples en español |
| Base de datos | 3FN con campos de auditoría created_at, created_by, updated_at, updated_by, deleted_at, deleted_by |
| Archivos | Máximo 150 líneas con cabecera descriptiva y @author = Cristian Deysdayr Jiménez |
| Código | Comentado en lenguaje claro y concreto |
| POO | Aplicada con principios SOLID especialmente SRP |
| Pruebas | Cobertura ≥ 80% |
| Calidad | Duplicación ≤ 3%, hotspots 100%, 0 críticos, 0 altos, 0 bugs, deuda ≤ 5% |
| Seguridad | Sin claves en código, validación de entradas, HTTPS obligatorio, JWT con expiración, CORS restrictivo |
| Mantenimiento | Identificación clara de archivos y funciones, reutilización de código existente |
