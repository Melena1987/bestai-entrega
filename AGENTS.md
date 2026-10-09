# AGENTS.md — BestAi

Este repositorio no está vinculado a ningún proyecto de Firebase.

- No hay proyecto por defecto en `.firebaserc`.
- No hay workflow que publique Hosting.
- La configuración del cliente va en variables `VITE_FIREBASE_*` (ver `.env.example`).

**No ejecutes** `firebase deploy` ni `npm run deploy`.
**No escribas** claves, project ids ni cuentas de servicio en el código.

Si el usuario pide publicar, que indique el project id de su propia cuenta y despliega solo con `--project <ese-id>`.
