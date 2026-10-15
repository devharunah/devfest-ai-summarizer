export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-3xl bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-700">
          Aaron Douglas
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Your project is ready.</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
          Replace this screen with the approved project experience and connect the Supabase clients
          when authentication and data requirements are defined.
        </p>
      </section>
    </main>
  );
}
