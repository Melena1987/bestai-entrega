# Firebase

Este repositorio no está vinculado a ningún proyecto de Firebase.

1. Crea un proyecto en Firebase con Authentication, Firestore, Storage y Hosting.
2. Copia `.env.example` a `.env.local` y rellena las variables `VITE_FIREBASE_*` con la configuración de la app web.
3. Asocia la CLI con ese proyecto: `npx firebase-tools use --add`.
4. Publica solo si te lo piden, y siempre con `--project <id>` de ese proyecto nuevo.

No subas `.env.local` ni cuentas de servicio al repositorio.
