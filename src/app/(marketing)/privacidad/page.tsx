export const metadata = { title: "Política de Privacidad" };

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Política de Privacidad
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: 6 de agosto de 2026
      </p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-foreground [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_p]:text-muted-foreground">
        <p>
          Financitas es un proyecto personal e independiente. Esta página
          explica, en lenguaje simple, qué datos recolectamos y qué hacemos
          con ellos.
        </p>

        <div>
          <h2>Qué datos recolectamos</h2>
          <p>
            Tu email y contraseña (la contraseña nunca se guarda en texto
            plano: la maneja Supabase Auth de forma encriptada). Las
            transacciones que cargás vos mismo (monto, fecha, categoría,
            descripción) y los activos que agregás a tu lista de
            inversiones (nombre, símbolo, nivel de riesgo).
          </p>
        </div>

        <div>
          <h2>Cómo usamos esos datos</h2>
          <p>
            Únicamente para mostrarte tu propia información dentro de la
            app. No vendemos ni compartimos tus datos con terceros con
            fines comerciales o publicitarios.
          </p>
        </div>

        <div>
          <h2>Dónde se almacenan</h2>
          <p>
            En Supabase (base de datos Postgres), con Row Level Security
            habilitado: la base de datos está configurada para que cada
            cuenta solo pueda leer y modificar sus propios datos, nunca los
            de otro usuario.
          </p>
        </div>

        <div>
          <h2>Servicios de terceros que usamos</h2>
          <p>
            <strong>Supabase</strong> para autenticación y base de datos.{" "}
            <strong>CoinGecko</strong>, <strong>data912.com</strong> y{" "}
            <strong>dolarapi.com</strong> para traer precios de mercado
            públicos — a estas APIs no les enviamos ningún dato tuyo, solo
            les pedimos cotizaciones que son públicas.
          </p>
        </div>

        <div>
          <h2>Cookies</h2>
          <p>
            Usamos únicamente cookies necesarias para mantener tu sesión
            iniciada. No usamos cookies de rastreo ni de publicidad.
          </p>
        </div>

        <div>
          <h2>Tus derechos</h2>
          <p>
            Podés pedir que eliminemos tu cuenta y todos tus datos en
            cualquier momento escribiendo a{" "}
            <a
              href="mailto:fede0344@gmail.com"
              className="text-primary underline underline-offset-4"
            >
              fede0344@gmail.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2>Cambios a esta política</h2>
          <p>
            Si hacemos cambios importantes, vamos a actualizar la fecha de
            arriba y, si corresponde, avisarte por email.
          </p>
        </div>

        <div>
          <h2>Contacto</h2>
          <p>
            ¿Dudas sobre tu privacidad?{" "}
            <a
              href="mailto:fede0344@gmail.com"
              className="text-primary underline underline-offset-4"
            >
              fede0344@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
