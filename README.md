# 📚 Sistema de gestión de bibliotecas / librerias.

Proyecto de fronted creado en base al trabajo realizado por el **Sr. Harsh Rathod** donde creo un sistema de gestión moderno de biblioteca online bajo React, Firebase y Tailwind CSS.  Para mas información ver su repositorio: https://github.com/panduthegang

En nuestra modificación del proyecto original se ha sustituido por completo el uso del firebase por un backend bajo NodeJS que la mantiene la persistencia de datos con una BD MySQL (esta en un contenedor Docker la BD). 
Para más detalle consulte el repositorio: https://github.com/DEVSAM1966/Biblioteca-code-cafe.git

Se esta realizando una versión de backend con Spring Boot y BD MySQL en contenedor Docker (pendiente de integrarlo )

React y Tailwind CSS sigue siendo usado pero modificando parte del proyecto original para abergar las necesidades de proyecto.

Aqui quiero mostrar mi apoyo y respecto al Sr. Harsh Rathod.

## ✨ Caracterias.

🔐 **Autenticacion & Autorizacion**
- Autenticación segura por Correo electrónico / Contraseña.
- Control de acceso bajo Roles (ADMIN / SUPPORT / USER).
- Protección de rutas y API endpoints.

📖 **Administración de Libros**
- Catalogo de libros completo.
- Seguimiento de disponibilidad en tiempo real.
- Información del libro basada en ISBN
- Gestión de la cantidad de libros.

👥 **Funciones del usuario**
- Préstamo y devolución de libros.
- Seguimiento de la fecha de vencimiento.
- Panel personal.

⚡ **Funciones de administrador**
- Gestión de autores, editores y categorias.
- Gestión del inventario de libros con subida de libros y portadas al backend.
- Administración de los prestamos y usuarios.

🎨 **Moderno UI/UX**
- Diseño responsivo.
- Bellas animaciones.
- Interfaces intuitivas.
- Soporte al modo Oscuro.

## 🛠️ Tecnológia aplicada.

- ⚛️ React 18 con TypeScript.
- 🔥 Conexión a un Backend implementado a medida para bibliotecas online en NodeJs y BD MySQL en un contenedor Docker.
- 🎨 Tailwind CSS para estilos.
- 🎭 Framer Motion para animaciones.
- 📦 Vite para compilaciones extremadamente rápidas.
- 🔍 Funcionalidad de búsqueda en tiempo real.

## 🚀 Arranque del proyecto.

1. **Clonar el repositorio en local**
```bash
git clone https://github.com/DEVSAM1966/Biblioteca-codigojava-front.git
cd Biblioteca-codigojava-front
```
2. **Instalar dependencias**
```bash
npm install
```
3. **Instalar del backend en NodeJS en local**
```bash
git clone https://github.com/DEVSAM1966/Biblioteca-code-cafe.git
```

ATENCIÓN.  Se debe seguir las recomendaciones del README.md del proyecto para que la parte backend funcione sin problemas.

De base no hay ningun fichero PDF (libro) ni JPG (portada) para que el tamaño no de problemas en el repositorio de GitHub.  Se debera dar de alta libros y subir los ficheros siguiendo las normas del backend via Postman o bien desde el frontend en el panel de administrador.

4. **Inicia el servidor Backend de desarrollo**
Para usuarios de Linux.
```bash
sudo systemctl start docker
```

Para usuarios de Windows.
- Arrancar el programa Docker Desktop.
- Seleccionar el contenedor que contenga la BD del proyecto y pulsar el botón Start (si no arranco automaticamente).  El nombre del contenedor es:  **biblio_mysql**

A continuación.
```bash
npm run dev
```

5. **Inicia el servidor Frontend de desarrollo**
```bash
npm run dev
```

## 📱 Capturas de pantalla.

### Login.
![Pantalla de login](./public/Login.png)

### Registro de un usuario por si mismo.
![Pantalla de registro](./public/Register-user.png)

### Interfaz de usuario.
![Interface de usuario](./public/User-code-cafe.png)

### Panel de administración - autores.
![Pantalla administración - autores](./public/Admin-authors.png)

### Panel de administración - editores.
![Pantalla admnistración - editores](./public/Admin-publishers.png)

### Panel de administración - categorias.
![Pantalla admnistración - categorias](./public/Admin-categories.png)

### Panel de administración - libros.
![Pantalla admnistración - libros](./public/Admin-books.png)

### Panel de administración - prestamos.
![Pantalla admnistración - prestamos](./public/Admin-loans.png)

## 🔒 Seguridad

- Verificación del rol asignado al usuario y de su existencia en BD.
- Acceso por Token JWT (limitado su vida util en 1 hora).
- Limitaciones del uso segun el rol que tenga.
- USER.  Acceso al panel de usuario.
- SUPPORT. Acceso a los paneles de usuario, administración.  No podrá borrar registros de la BD ni autopromocionarse como ADMIN.
- ADMIN. Acceso a los paneñes de usuario, administracion.  Puede borrar registros.



# Autor.

**Sebastián Asunción**

---


<div align="center">Thanks for ❤️ Harsh Rathod</div>

