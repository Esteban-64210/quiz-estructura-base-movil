# Quiz — Construcción de estructura base de una aplicación

**Programación Móvil · CORHUILA**

> ### 🏆 Regla de oro
> Las buenas prácticas vistas hasta el momento en el curso **no son negociables**. Ya deben saberlas.

---

**Duración:** 70 minutos  
**Horario:** 7:00 a. m. – 8:10 a. m.

## Objetivo

Construir la estructura base de una aplicación funcional, partiendo del repositorio y trabajando sobre la rama indicada por el docente.

El propósito principal de la actividad es evidenciar cómo cada estudiante aborda, organiza y plantea una solución de software, priorizando una estructura clara, mantenible y coherente antes que la cantidad de funcionalidades desarrolladas.

## Requerimientos funcionales mínimos

La aplicación deberá utilizar SQLite como base de datos e incluir, como mínimo, las siguientes funcionalidades:

1. **Registro de usuarios**
   - Pantalla para registrar un usuario.
   - Persistencia de la información en SQLite.
2. **Registro de productos**
   - Pantalla para registrar productos.
   - Persistencia de la información en SQLite.
3. **Registro de personas**
   - Pantalla para registrar personas.
   - Persistencia de la información en SQLite.

No se requiere construir un sistema completo ni desarrollar funcionalidades adicionales que no hayan sido solicitadas.

## Criterio principal de evaluación

La mayor parte de la valoración estará concentrada en la estructura inicial de la solución.

Se evaluará especialmente:

- Organización de carpetas y archivos.
- Separación adecuada de responsabilidades.
- Estructura preparada para crecer.
- Configuración y acceso a SQLite.
- Separación entre interfaz, lógica de aplicación y persistencia.
- Claridad de nombres.
- Consistencia del código.
- Capacidad para justificar las decisiones tomadas.
- Aplicación ejecutable o, como mínimo, una base funcional correctamente integrada.

## Estructura esperada

No es obligatorio utilizar exactamente una arquitectura específica. Sin embargo, debe evitarse concentrar toda la aplicación en uno o pocos archivos.

Como referencia conceptual:

```
src/
├── application/
├── domain/
├── infrastructure/
│   └── database/
├── presentation/
│   ├── users/
│   ├── products/
│   └── persons/
└── main
```

La estructura exacta dependerá de la tecnología utilizada. Lo importante será demostrar una separación lógica y justificable de responsabilidades.

## Uso de Inteligencia Artificial

Para esta actividad es **obligatorio** utilizar herramientas de Inteligencia Artificial como apoyo durante el desarrollo.

El estudiante deberá ser capaz de:
- explicar el código generado;
- justificar por qué utilizó determinada estructura;
- identificar qué partes fueron apoyadas por IA;
- realizar modificaciones sobre la solución;
- demostrar que comprende el funcionamiento de lo desarrollado.

## Trabajo con Git

El desarrollo deberá realizarse sobre la rama previamente indicada del repositorio (`main`).
Historial de trabajo comprensible y commits convencionales.

## Entregable

Al finalizar los 70 minutos, el repositorio deberá contener como mínimo:

- [x] Estructura base de la aplicación
- [x] Configuración de SQLite
- [x] Persistencia implementada
- [x] Pantalla de registro de usuarios
- [x] Pantalla de registro de productos
- [x] Pantalla de registro de personas
- [x] Código organizado por responsabilidades
- [x] Aplicación ejecutable o base funcional demostrable
- [x] Cambios registrados en Git

---

## 🏛️ Justificación de la Estructura y Decisiones Técnicas

La solución fue diseñada siguiendo los principios de **Clean Architecture** (Arquitectura Limpia) y separación estricta de responsabilidades (`presentation → application → domain ← infrastructure`):

```text
src/
├── domain/                      # Reglas de negocio puras
│   ├── models/                  # Entidades de dominio (User, Product, Person)
│   └── repositories/            # Contratos/Interfaces (IUserRepository, etc.)
├── application/                 # Lógica de aplicación y orquestación
│   ├── ports/                   # Puertos abstractos (IPasswordHasher)
│   └── use-cases/               # Casos de uso (RegisterUser, RegisterProduct, RegisterPerson)
├── infrastructure/              # Implementación técnica y adaptadores
│   ├── database/                # Conexión SQLite, DDL con PRAGMA user_version y repositorios
│   │   ├── DatabaseConnection.ts
│   │   ├── SqliteUserRepository.ts
│   │   ├── SqliteProductRepository.ts
│   │   └── SqlitePersonRepository.ts
│   ├── security/                # Adaptador criptográfico (Sha256PasswordHasher con sal)
│   │   └── Sha256PasswordHasher.ts
│   └── dependencies.ts          # Re-exportador de compatibilidad
├── presentation/                # Interfaz de usuario (React Native)
│   ├── persons/                 # Pantalla de registro de Personas
│   ├── products/                # Pantalla de registro de Productos
│   └── users/                   # Pantalla de registro de Usuarios
└── main/                        # Raíz de composición (Main / Composition Root)
    └── container.ts             # Enlace de adaptadores con casos de uso (DIP)
```

### 1. Capa de Dominio (`src/domain`)
- **Modelos (`models/`)**: Define las entidades puras del negocio (`User`, `Product`, `Person`) sin depender de React, Expo ni SQLite.
- **Interfaces (`repositories/`)**: Aplica el principio de inversión de dependencias (DIP). Los casos de uso no dependen de SQLite directamente, sino de abstracciones contractuales (`IUserRepository`, `IProductRepository`, `IPersonRepository`).

### 2. Capa de Aplicación (`src/application`)
- **Casos de Uso (`use-cases/`)**: Implementa la lógica de registro de cada entidad. Realiza la validación estricta de entradas (campos requeridos, formato de correo con regex, longitud mínima de clave, precios mayores a 0, stock no negativo, documento numérico) y normalización (`trim()`, minúsculas).
- **Puertos (`ports/`)**: Declara `IPasswordHasher`, permitiendo que el hash de contraseñas sea intercambiable y desacoplado del motor criptográfico concreto.

### 3. Capa de Infraestructura (`src/infrastructure`)
- **`DatabaseConnection.ts`**: Administra el ciclo de vida y la conexión a SQLite (`quiz_movil.db`) de forma singleton, aplicando migraciones transaccionales mediante `PRAGMA user_version`. Maneja inicialización idempotente para evitar condiciones de carrera en el arranque en frío.
- **Seguridad (`security/`)**: `Sha256PasswordHasher` genera un salt criptográfico aleatorio por usuario y almacena `salt:hash`, garantizando que ninguna contraseña se guarde en texto plano.
- **Repositorios Concretos**: Ejecutan consultas parametrizadas (`?`) para neutralizar inyecciones SQL y capturan/sanitizan excepciones de la base de datos (por ejemplo, errores de restricción `UNIQUE`), entregando mensajes profesionales al usuario final sin exponer nombres internos de tablas o columnas.

### 4. Raíz de Composición (`src/main/container.ts`)
- Es el único módulo autorizado que conoce tanto las abstracciones del dominio como las implementaciones concretas de infraestructura, inyectando las dependencias necesarias.

### 5. Capa de Presentación (`src/presentation`)
- Pantallas con tema oscuro consistente (`#0f172a`, `#1e293b`), accesibilidad nativa (`accessibilityRole`, `accessibilityLabel`), manejo de teclado con `KeyboardAvoidingView` y estados de carga (`ActivityIndicator`) con botones deshabilitados durante la persistencia.
- **Listado inferior**: Se mantiene como mecanismo de retroalimentación inmediata para evidenciar la persistencia efectiva en SQLite solicitada por la rúbrica del quiz.

---

## 🚀 Instrucciones de Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar la aplicación:
   ```bash
   npx expo start
   ```

3. Abrir en emulador Android (`a`), dispositivo físico con Expo Go (escaneando QR) o navegador web (`w`).

---

Universidad: Corporación Universitaria del Huila - CORHUILA
