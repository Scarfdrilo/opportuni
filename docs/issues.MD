Aquí tienes el listado de **Issues de GitHub / Linear** estructurados en formato Markdown, listos para que los copies, pegues y asignes a tu equipo de desarrollo en la app de Next.js.

---

## #1 [Epic/Task] Configuración inicial e integración del SDK de Accesly

**Descripción:**
Configurar el entorno de desarrollo y envolver la aplicación de Next.js con el proveedor oficial de Accesly para habilitar las funciones de la wallet inteligente.

**Tareas de desarrollo:**

* [ ] Instalar las dependencias necesarias: `@accesly/react` y `@accesly/core`.
* [ ] Crear las variables de entorno en el archivo `.env.local` y configurarlas en Vercel:
* `NEXT_PUBLIC_ACCESLY_APP_ID` (Obtenida desde el Dashboard de Accesly).


* [ ] Configurar el `AcceslyProvider` en el archivo raíz de la app (ej. `_app.tsx` o `layout.tsx` si usan App Router) para que todo el sitio tenga acceso al contexto de la wallet.

**Criterios de Aceptación (DoD):**

* La aplicación compila sin errores tras instalar el SDK.
* Las variables de entorno se leen correctamente en el frontend.

---

## #2 [Feature/UI] Implementar botón "Connect Wallet" y copiado de Hash de la Wallet

**Descripción:**
Actualizar el botón actual de **"Connect Wallet"** en la barra de navegación de `https://opportuni.vercel.app/` para detonar el flujo de autenticación sin contraseña de Accesly y permitir al usuario ver y copiar su dirección pública.

**Tareas de desarrollo:**

* [ ] Conectar el botón "Connect Wallet" actual con el método de login por correo electrónico del SDK de Accesly.
* [ ] Asegurar que el modal de WebAuthn (FaceID/Biometría) se despliegue de forma nativa tras ingresar el correo electrónico.
* [ ] **Estado Autenticado:** Al iniciar sesión, cambiar el texto del botón por el Hash truncado de la wallet del usuario (ej: `0xA1b2...3c4d`).
* [ ] Crear un menú desplegable pequeño o modal al hacer clic en el botón con estado autenticado que muestre:
* Correo del usuario.
* Balance actual en XLM.
* Dirección completa de la wallet (Hash) junto a un botón con la funcionalidad **"Copiar al portapapeles"** (para el paso de enviárselo a Vianey).
* Botón de "Cerrar sesión".



**Criterios de Aceptación (DoD):**

* Un usuario puede registrarse con su correo en menos de 10 segundos usando biométricos.
* El Hash de la wallet se copia fielmente en el portapapeles mediante la API `navigator.clipboard`.

---

## #3 [Feature/Backend-Frontend] Lógica de Transacción Web3 en Botones de Servicio

**Descripción:**
Vincular los botones **"Pedir mi CV"** y **"Agendar sesión"** de la sección de servicios para que ejecuten la transferencia cripto (XLM) hacia la wallet destino de Vianey Álvarez, activando el cobro automático de la comisión del 3% de Accesly.

**Tareas de desarrollo:**

* [ ] Configurar de forma fija (hardcoded/env) la wallet pública destino de Vianey Álvarez que recibirá los fondos de los servicios.
* [ ] Al hacer clic en **"Pedir mi CV"** o **"Agendar sesión"**, validar el estado del usuario:
* Si no está autenticado, abrir el modal de login (Issue #2).
* Si está autenticado, validar que cuente con fondos suficientes de XLM en su balance para cubrir el servicio.


* [ ] Si tiene fondos suficientes, desplegar un modal interno de confirmación de pago de Oportunni.
* [ ] Al dar clic en "Confirmar Pago", invocar la función de transferencia del SDK de Accesly firmada por la Smart Account del usuario hacia la wallet de Vianey.

**Criterios de Aceptación (DoD):**

* Si el usuario no tiene fondos suficientes, los botones muestran un aviso claro que indique que se está procesando su fondeo SPEI.
* Al confirmar el pago, la transacción se envía a la red de Stellar de manera exitosa.

---

## #4 [Feature/UI] Flujos de Éxito y Redirecciones Post-Pago

**Descripción:**
Definir las vistas y acciones subsecuentes inmediatas en el frontend una vez que el contrato de Accesly confirma que la transacción de XLM fue exitosa.

**Tareas de desarrollo:**

* [ ] **Flujo de "Pedir mi CV":** Al recibir el callback de éxito de la transacción, redirigir al usuario o abrir el componente/modal para la carga de su archivo PDF de CV actual.
* [ ] **Flujo de "Agendar sesión":** Al recibir el callback de éxito, embeber o redirigir al componente de Calendly / agenda para seleccionar la fecha de la asesoría 1:1.
* [ ] Implementar estados de carga (*spinners*) limpios mientras la blockchain de Stellar procesa el bloque de la transacción para evitar clics dobles del usuario.

**Criterios de Aceptación (DoD):**

* El usuario nunca experimenta una pantalla en blanco tras pagar.
* La redirección al PDF o calendario ocurre de forma automática en un lapso no mayor a 2 segundos después de confirmada la transacción on-chain.

---

## #5 [QA/Testing] Pruebas E2E en Producción (Pre-Pilot) y Logging de KPIs

**Descripción:**
Realizar pruebas controladas de punta a punta (End-to-End) por parte del equipo de desarrollo con dinero real antes de liberar la plataforma a los 10 usuarios del piloto. Configurar telemetría básica para medir KPIs técnicos de Accesly.

**Tareas de desarrollo:**

* [ ] **Prueba de Humo (Smoke Test):** Hacer un flujo completo simulando ser un cliente: Registrarse con un correo de prueba, fondear manualmente la wallet con XLM real (monto bajo) y realizar la compra de un servicio.
* [ ] Verificar en un explorador de bloques de Stellar (como StellarExpert) que:
* El dinero llegó a la wallet de Vianey.
* El 3% se descontó y transfirió de forma correcta a la wallet de la plataforma Accesly.


* [ ] Configurar logs en consola o herramientas de analítica básicas (Vercel Analytics/Logtail) para medir las métricas clave:
* Tiempo de creación de la wallet.
* Errores arrojados por el SDK de Accesly en navegadores móviles (Safari/Chrome).



**Criterios de Aceptación (DoD):**

* Se ejecuta al menos una transacción real de forma exitosa de inicio a fin sin intervención del desarrollador en la base de datos.
* Se comprueba visualmente en el explorador de bloques que la comisión del 3% de Accesly se dividió con exactitud matemática.