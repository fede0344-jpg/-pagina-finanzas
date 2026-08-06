export const metadata = { title: "Términos de Servicio" };

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Términos de Servicio
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: 6 de agosto de 2026
      </p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-foreground [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_p]:text-muted-foreground">
        <p>
          Al crear una cuenta en Financitas, aceptás estos términos.
          Financitas es un proyecto personal e independiente, no una
          entidad financiera, banco, ni broker.
        </p>

        <div>
          <h2>Qué es Financitas</h2>
          <p>
            Una herramienta para organizar tus ingresos, gastos y hacer
            seguimiento de inversiones que vos mismo elegís agregar. No
            gestionamos tu dinero ni tenés que vincular ninguna cuenta
            bancaria.
          </p>
        </div>

        <div>
          <h2>No es asesoramiento financiero</h2>
          <p>
            Los precios, gráficos y porcentajes de rendimiento que se
            muestran en la sección de Inversiones son solo informativos,
            calculados a partir de datos históricos de fuentes externas. No
            constituyen una recomendación de inversión. Cualquier decisión
            financiera que tomes es exclusivamente tu responsabilidad.
          </p>
        </div>

        <div>
          <h2>Datos de terceros</h2>
          <p>
            Los precios provienen de fuentes externas (CoinGecko,
            data912.com, dolarapi.com) que pueden tener demoras, errores o
            discontinuarse en cualquier momento. No garantizamos su
            exactitud ni disponibilidad continua.
          </p>
        </div>

        <div>
          <h2>Tu cuenta</h2>
          <p>
            Sos responsable de mantener tu contraseña segura y de la
            exactitud de los datos que cargues (ingresos, gastos,
            activos).
          </p>
        </div>

        <div>
          <h2>Disponibilidad del servicio</h2>
          <p>
            Al ser un proyecto personal, no garantizamos disponibilidad
            ininterrumpida ni ausencia total de errores. Podemos modificar
            o discontinuar funcionalidades en cualquier momento.
          </p>
        </div>

        <div>
          <h2>Limitación de responsabilidad</h2>
          <p>
            El servicio se ofrece &quot;tal cual&quot;, sin garantías de
            ningún tipo. No somos responsables por pérdidas o decisiones
            financieras que tomes basándote en la información mostrada en
            la app.
          </p>
        </div>

        <div>
          <h2>Ley aplicable</h2>
          <p>Estos términos se rigen por las leyes de Argentina.</p>
        </div>

        <div>
          <h2>Contacto</h2>
          <p>
            ¿Preguntas sobre estos términos?{" "}
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
