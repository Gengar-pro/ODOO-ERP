# 💊 Pharma-Sync ERP — Modern Pharmaceutical Odoo Suite

<div align="center">
  <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80" alt="Pharma-Sync Header" width="100%" style="border-radius: 12px; margin-bottom: 20px; object-fit: cover; height: 320px;" />
  
  [![React](https://img.shields.io/badge/Frontend-React%20v18.3-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Bundler-Vite%20v5-646CFF?logo=vite&style=for-the-badge)](https://vite.dev/)
  [![BaaS](https://img.shields.io/badge/BaaS-Supabase%20%28PostgreSQL%29-3ECF8E?logo=supabase&style=for-the-badge)](https://supabase.com)
  [![Render Deployment](https://img.shields.io/badge/Deployment-Render.com-00E5FF?logo=render&style=for-the-badge)](https://render.com)
  [![Styling](https://img.shields.io/badge/Styling-CSS3%20Vanilla%20%26%20Glassmorphism-FF4081?style=for-the-badge)](https://developer.mozilla.org/css)
  [![License](https://img.shields.io/badge/License-MIT-4CAF50?style=for-the-badge)](LICENSE)
</div>

---

### 🌟 Resumen Ejecutivo
**Pharma-Sync ERP** es un ecosistema digital avanzado e interactivo de nivel empresarial (inspirado en la arquitectura modular de **Odoo**) diseñado específicamente para la administración integral de cadenas de farmacias, laboratorios y atención clínica. Su núcleo de alto rendimiento fusiona una interfaz premium responsiva (con esquemas adaptativos de color y simulación táctil móvil) junto con un motor híbrido de doble persistencia en tiempo real (LocalStorage + Supabase Cloud) y resiliencia offline ante fallos de red.

---

## 🚀 Características Principales (Key Features)

| Característica | Detalle Funcional | Impacto Empresarial |
| :--- | :--- | :--- |
| **🗄️ Doble Persistencia Híbrida** | Sincronización bidireccional inmediata de datasets locales (`LocalStorage`) con almacenamiento estructurado en la nube (`Supabase Cloud REST API`). | Cero pérdida de información operativa al cambiar de pestaña, cerrar sesión o recargar. |
| **📶 Resiliencia y Modo Offline** | Cola interna de transacciones sin conexión (`OfflineQueue`). Captura de ventas y reajustes locales que se procesan al detectar conexión. | Continuidad del negocio garantizada aun en caídas de red o zonas rurales. |
| **💳 POS Integrado con Triggers** | Terminal Punto de Venta optimizado con lector simulado de códigos de barras, carrito interactivo y emisión de facturas XML autorizadas. | Venta al público fluida en milisegundos con cálculo automático de impuestos. |
| **📦 MRP y Reabastecimiento Automático** | Generación autónoma de borradores de RFQ a proveedores líderes (BAGO, INTI) cuando el stock cae por debajo del mínimo crítico. | Control estricto de existencias, semáforos de vencimiento por lotes y reabastecimiento rápido. |
| **🔒 Gestión y Control de Roles (RBAC)** | Matriz de permisos integrada con 6 perfiles corporativos preestablecidos (Administrador, Regente, Contador, RRHH, Almacén, Marketing). | Seguridad perimetral del sistema y auditoría de asistencia con check-in/out biométrico. |
| **💬 Canales Interactivos de Cliente** | Portal e-commerce completo con carrito de compras integrado, pasarela de pago virtual y chat de consulta farmacéutica directa. | Canal digital robusto sincronizado al instante con el inventario físico central. |

---

## 🛠️ Arquitectura y Stack Tecnológico

El ecosistema opera bajo un patrón de **Gestión de Estado Centralizado y Módulos Desacoplados**. La lógica relacional se encuentra encapsulada en el contexto global, permitiendo a los módulos individuales actuar de forma autónoma pero altamente sincronizada.

*   **Frontend / Cliente**: React v18.3, JavaScript ES6+, empaquetado ultra-veloz en milisegundos con **Vite v5**.
*   **Diseño y Estilos**: CSS3 Vanilla puro mediante un sistema premium basado en tokens de variables HSL, Glassmorphism, neumorfismo y esquemas adaptativos de color mediante selectores `data-theme` (Día/Noche).
*   **Backend as a Service (BaaS)**: **Supabase** (Base de datos PostgreSQL en la nube, autenticación y almacenamiento REST API para upserts en la tabla centralizada `pharma_sync`).
*   **Hosting y Pipeline de CD**: Desplegado de forma continua en **Render.com** (Static Site optimizado con despliegue de PRs automático).

### 📊 Diagrama de Flujo e Integración de Datos
El siguiente diagrama detalla cómo el cliente interactúa con la base de datos distribuida local e integra las peticiones HTTP a los microservicios de Supabase:

```mermaid
graph TD
    %% Styling
    classDef client fill:#1A2238,stroke:#61DAFB,stroke-width:2px,color:#FFFFFF;
    classDef context fill:#0D1117,stroke:#646CFF,stroke-width:2px,color:#FFFFFF;
    classDef localDB fill:#2E3F5F,stroke:#FF4081,stroke-width:2px,color:#FFFFFF;
    classDef cloudDB fill:#1C2E24,stroke:#3ECF8E,stroke-width:2px,color:#FFFFFF;

    subgraph ClientSide ["CLIENT SIDE (Navegador) - Desplegado en Render.com"]
        A["React 18 UI / Layout.jsx"]:::client
        B["AppContext.jsx (React Context - Engine Central)"]:::context
        C["Offline Transaction Queue (Caché local de transacciones)"]:::context
        D{"Gateway de Conectividad"}:::context
        E[("LocalStorage Database")]:::localDB
    end

    subgraph CloudBackend ["CLOUD BACKEND (BaaS)"]
        F[("Supabase Cloud Instance")]:::cloudDB
        G["Tabla pharma_sync (PostgreSQL)"]:::cloudDB
    end

    %% Flow interactions
    A <-->|Context Hooks & Eventos| B
    B <-->|Carga/Guardado de Seguridad| E
    B -->|Transacción Fallida (Offline)| C
    B <-->|Doble persistencia activa| D
    D -->|ONLINE - Cloud Upsert| F
    D -->|OFFLINE - Conservar local| C
    C -->|Acción manual 'Sincronizar Datos'| D
    F <-->|REST API Fetch / POST / GET| G
```

---

## 📂 Estructura Completa del Proyecto (Folder Structure)

Para garantizar la mantenibilidad y un crecimiento escalable, el proyecto divide de forma estricta el empaquetador del código fuente de producción:

```text
ODOO-ERP/
├── ODOO-ERP/                      # Directorio principal de la aplicación React
│   ├── dist/                      # Carpeta de distribución compilada para producción
│   ├── public/                    # Activos estáticos públicos y metaetiquetas SEO
│   ├── src/                       # Código fuente del proyecto
│   │   ├── assets/                # Imágenes, recursos de marca y multimedia
│   │   ├── components/            # Componentes de UI comunes y reutilizables
│   │   │   ├── Layout.jsx         # Contenedor y UI principal del ERP (Sidebar, Header y Alertas)
│   │   │   ├── Login.jsx          # Interfaz de acceso privado optimizada
│   │   │   └── MobileFrame.jsx    # Envoltorio de simulación responsiva para dispositivos
│   │   ├── context/               # Capa de estado global (React Context API)
│   │   │   └── AppContext.jsx     # Proveedor global del estado, persistencia local y funciones core
│   │   ├── modules/               # Módulos funcionales de la suite ERP (12 áreas)
│   │   │   ├── CRM/               # Fichas de pacientes crónicos, puntos de fidelidad y Kanban de Leads
│   │   │   ├── Compras/           # Control de RFQ de laboratorios y recepción de mercancías
│   │   │   ├── Contabilidad/      # Conciliación bancaria automatizada por IA y facturas XML
│   │   │   ├── Inventario/        # Control de lotes, semáforo de vencimientos y ajustes rápidos
│   │   │   ├── Manufactura/       # MRP, mezclador de fórmulas magistrales y materias primas
│   │   │   ├── Marketing/         # Campañas masivas por SMS y correo con traza de clics
│   │   │   ├── MesaAyuda/         # Helpdesk con soporte médico, control de urgencias y SLAs
│   │   │   ├── POS/               # Punto de Venta táctil rápido, buscador de fármacos y recibos
│   │   │   ├── Proyectos/         # Gantt de tareas de expansión y campañas de vacunación
│   │   │   ├── RRHH/              # Relación de personal, checador biométrico y vacaciones
│   │   │   ├── SitioWeb/          # Portal e-commerce para clientes con chat médico activo
│   │   │   └── Ventas/            # Contratos institucionales y cotizaciones mayoristas
│   │   ├── App.css                # Estilos de navegación y enrutamiento
│   │   ├── App.jsx                # Enrutador lógico y verificación de tokens de sesión
│   │   ├── index.css              # Tokens de diseño HSL, Google Fonts y scrollbars
│   │   └── main.jsx               # Punto de entrada de React en el DOM
│   ├── eslint.config.js           # Reglas de análisis estático de código
│   ├── index.html                 # Esqueleto HTML5
│   ├── package.json               # Manifiesto de dependencias y scripts de ejecución
│   └── vite.config.js             # Configuración del servidor de desarrollo de Vite
├── .gitattributes                 # Atributos de Git para codificación y fin de línea
├── LICENSE                        # Licencia del proyecto (MIT)
└── README.md                      # Este documento (Documentación raíz del repositorio)
```

---

## ⚙️ Configuración del Entorno (Environment Variables)

El ERP cuenta con una integración flexible. La conexión con Supabase se establece a nivel cliente (permitiendo que cada usuario ingrese su propio nodo para fines de pruebas) a través del modal de **Configuración de Usuario ⚙️** en la UI principal. De manera alternativa, se pueden configurar variables de entorno estáticas en el empaquetador de la siguiente forma:

| Variable / Clave | Origen / Ubicación | Nivel de Obligatoriedad | Descripción | Ejemplo de Formato Seguro |
| :--- | :--- | :--- | :--- | :--- |
| `supabase_url` | Ajustes de Perfil / LocalStorage | **Requerido para Cloud Sync** | Dirección de la instancia REST de tu base de datos de Supabase. | `https://abc123xyz.supabase.co` |
| `supabase_key` | Ajustes de Perfil / LocalStorage | **Requerido para Cloud Sync** | Clave pública anónima (Anon Key) de Supabase para firmar peticiones HTTP. | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_API_URL` | Archivo `.env` (Raíz del proyecto) | *Opcional* | Dirección base para microservicios externos de integración. | `https://api.pharma-sync.com/v1` |
| `PORT` | Archivo `.env` (Raíz del proyecto) | *Opcional* | Puerto por defecto en el que se levantará la previsualización local. | `10000` |

### 🗄️ Esquema Requerido en Supabase
Para que la doble persistencia del ERP funcione, crea una tabla en el esquema `public` de tu base de datos Supabase con la siguiente estructura SQL:

```sql
create table public.pharma_sync (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Habilitar acceso de lectura y escritura para el rol Anon (o configurar RLS según se requiera)
alter table public.pharma_sync enable row level security;
create policy "Permitir select para todos" on public.pharma_sync for select using (true);
create policy "Permitir insert/update para todos" on public.pharma_sync for all using (true);
```

---

## 🛠️ Instalación y Despliegue Local (Paso a Paso)

Siga estos pasos exactos para levantar el entorno completo de desarrollo en su máquina local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Gengar-pro/ODOO-ERP.git
cd ODOO-ERP
```

### 2. Instalar Dependencias del Proyecto
El package.json del proyecto React se encuentra en la subcarpeta `ODOO-ERP`:
```bash
cd ODOO-ERP
npm install
```

### 3. Ejecución en Servidor de Desarrollo
Para lanzar el servidor de Vite con recarga rápida (HMR):
```bash
npm run dev
```
*El sistema estará disponible en su navegador en la dirección: `http://localhost:5173`.*

### 4. Conexión con Supabase
1. Inicie sesión en el ERP con cualquier credencial válida (ver tabla abajo).
2. Haga clic en el botón de **Configuración ⚙️** en la parte superior derecha.
3. Ingrese el **Project URL** y el **Anon API Key** en la sección "Base de Datos en la Nube".
4. Haga clic en **Guardar Perfil**. El sistema se recargará automáticamente y se conectará en tiempo real.

---

## 🔑 Credenciales Seguras de los Roles de Acceso

| Usuario | Contraseña | Rol Corporativo | Permisos y Cobertura de Módulos |
| :--- | :--- | :--- | :--- |
| `admin` | **`admin999`** | Administrador | Acceso total e ilimitado a los 12 módulos funcionales. |
| `farmacia` | **`farmacia999`** | Regente Farmacéutico | POS, Inventario, Manufactura (MRP), Mesa de Ayuda. |
| `contas` | **`contas999`** | Contador General | Contabilidad, Ventas, Compras, CRM. |
| `RRHH` | **`RRHH999`** | Recursos Humanos | RRHH, Proyectos, Mesa de Ayuda. |
| `stock` | **`stock999`** | Encargado Almacén | Inventario, Compras. |
| `market` | **`market999`** | Especialista Marketing | Marketing, Sitio Web, CRM. |

---

## 🌐 Despliegue en Producción (Render.com)

El pipeline de integración continua (CI/CD) de Render.com está configurado para compilar y desplegar automáticamente cada commit a producción:

1.  **Tipo de Servicio**: `Static Site`
2.  **Nombre del Proyecto**: `pharma-sync-erp`
3.  **Root Directory**: `ODOO-ERP` (muy importante, ya que el proyecto React se aloja en esta subcarpeta).
4.  **Build Command**: `npm install && npm run build`
5.  **Publish Directory**: `dist`
6.  **Variables de Entorno**: Se pueden pre-inyectar variables en la sección *Environment* de Render de ser necesario.

---

## 🎨 Guía de Diseño Visual y Experiencia UX/UI

> [!NOTE]
> **Diseño de Alta Fidelidad**: La suite no utiliza plantillas genéricas. Se ha estructurado un set exclusivo de variables CSS (`--primary`, `--danger`, `--bg-card`, etc.) que adaptan su opacidad e iluminación en tiempo real de acuerdo al tema seleccionado.

> [!TIP]
> **Micro-animaciones de Entrada**: Cada módulo cuenta con transiciones `ease-out` al cargarse, haciendo que el cambio de interfaz sea sumamente suave y prevenga la fatiga visual del operario en turnos de trabajo prolongados.

> [!IMPORTANT]
> **Seguridad de Operaciones Críticas**: Los formularios y botones de eliminación permanente en Almacén cuentan con confirmaciones visuales explícitas y sistemas de limpieza de caché automática para proteger la integridad contable del ERP.

---

## 👥 Autores y Contribución

¡Las contribuciones mantienen el proyecto con calidad de software empresarial! Siga los estándares de Git Flow y Conventional Commits:

*   **Gengar-pro** — *Lead Architect & Frontend Developer* — [GitHub Perfil](https://github.com/Gengar-pro)
*   **Antigravity AI** — *Pair Programmer & Senior Technical Writer*

---

<div align="center">
  <p>Desarrollado para<b>Pharma-Sync Suite</b> — El estándar del futuro en la gestión farmacéutica moderna.</p>
</div>
