# 💬 ChatOnline - Aplicación de Chat en Tiempo Real

Una aplicación moderna de chat en tiempo real construida con Vue 3, TypeScript, Firebase y TailwindCSS. Permite comunicación instantánea entre usuarios con soporte para salas públicas y mensajes privados.

## ✨ Características

### 🔐 Autenticación
- Registro de usuarios con email y contraseña
- Inicio de sesión seguro
- Autenticación persistente con Firebase Auth
- Perfiles de usuario con avatares generados automáticamente

### 💬 Chat en Tiempo Real
- **Salas públicas**: Crea y únete a salas de chat temáticas
- **Mensajes privados**: Conversaciones directas entre usuarios
- **Mensajería instantánea**: Sincronización en tiempo real
- **Indicadores de estado**: Ve quién está en línea
- **Historial de mensajes**: Persistencia de conversaciones

### 🎨 Interfaz de Usuario
- Diseño responsivo para móviles y escritorio
- Interfaz moderna con TailwindCSS
- Animaciones y transiciones fluidas
- Selector de emojis integrado
- Avatares únicos generados por nombre de usuario

### 🚀 Funcionalidades Avanzadas
- Lista de usuarios en línea
- Notificaciones en tiempo real
- Cifrado básico de mensajes
- Estados de carga y manejo de errores
- Navegación intuitiva entre pestañas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Estilos**: TailwindCSS + PostCSS
- **Estado**: Pinia (Vue Store)
- **Routing**: Vue Router 4
- **Seguridad**: crypto-js para cifrado de mensajes

## 📦 Instalación

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- Cuenta de Firebase

### Pasos de instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ChatOnline
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilita Authentication y Firestore Database
   - Actualiza la configuración en `src/firebase/config.js` con tus credenciales

4. **Configura las reglas de Firestore**
   - Copia el contenido de `firestore.rules` a tu proyecto de Firebase

5. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de la construcción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticación
│   ├── chat/          # Componentes del chat
│   └── ui/            # Componentes de interfaz
├── firebase/          # Configuración de Firebase
├── router/            # Configuración de rutas
├── stores/            # Estado global (Pinia)
├── views/             # Vistas principales
└── assets/            # Recursos estáticos
```

## 🔥 Configuración de Firebase

### Firestore Database
Asegúrate de tener las siguientes colecciones:
- `users` - Información de usuarios
- `rooms` - Salas de chat públicas
- `messages` - Mensajes de salas
- `private_messages` - Mensajes privados

### Authentication
Habilita el proveedor de **Email/Password** en Firebase Auth.

## 📱 Características Responsivas

La aplicación está optimizada para:
- **Móviles**: Interfaz táctil con menús deslizables
- **Tabletas**: Diseño adaptativo
- **Escritorio**: Experiencia completa con múltiples paneles

## 🎯 Uso de la Aplicación

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Explorar**: Ve las salas disponibles y usuarios en línea
3. **Chatear**: Únete a salas o inicia conversaciones privadas
4. **Crear salas**: Organiza conversaciones temáticas
5. **Personalizar**: Tu avatar se genera automáticamente

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:
- Abre un issue en GitHub
- Revisa la documentación de [Vue 3](https://vuejs.org/) y [Firebase](https://firebase.google.com/docs)

---

**Desarrollado con ❤️ usando Vue 3 + Firebase**
