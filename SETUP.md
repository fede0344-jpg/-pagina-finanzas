# Setup

Pasos que tenés que hacer vos una sola vez (no puedo crear cuentas de terceros en tu nombre).

## 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com), creá una cuenta gratis y un proyecto nuevo.
2. En **Project Settings → API**, copiá:
   - **Project URL**
   - **Publishable key** (o **anon public key** en proyectos más viejos)
3. Copiá `.env.local.example` a `.env.local` y completá esos dos valores:

```bash
cp .env.local.example .env.local
```

## 2. Correr la migración de la base de datos

1. En el dashboard de Supabase, andá a **SQL Editor**.
2. Pegá y ejecutá el contenido de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
3. Verificá en **Table Editor** que aparecen las tablas `categories` y `transactions` con RLS habilitado (candado verde).

## 3. Configurar URLs de autenticación

En **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (en producción, tu dominio real).
- **Redirect URLs**: agregá `http://localhost:3000/**` (wildcard) para que cubra `/auth/confirm` y cualquier página a la que redirijamos después de confirmar el email. En producción agregá también `https://tu-dominio.com/**`.

## 4. Editar el email de confirmación

Por defecto, el link de confirmación de Supabase no pasa por nuestra propia ruta `/auth/confirm`, así que hay que editarlo:

1. Andá a **Authentication → Email Templates → Confirm signup**.
2. Reemplazá el link del template para que use:

```
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">Confirmar email</a>
```

## 5. (Opcional, para probar más rápido) Desactivar confirmación de email

En **Authentication → Sign In / Providers → Email**, podés desactivar "Confirm email" mientras desarrollás, así no tenés que revisar tu correo cada vez que probás el signup. Volvé a activarlo antes de considerar esto "listo para producción".

## 6. Correr la app

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.
