import Link from "next/link";

export function ClinicFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-6 text-center text-xs text-slate-500">
      <p>
        Voice reception powered by{" "}
        <Link href="/" className="text-teal-700 hover:underline">
          Reception.ai
        </Link>
      </p>
    </footer>
  );
}
