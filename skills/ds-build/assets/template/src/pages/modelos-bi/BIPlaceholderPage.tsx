import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

interface Props {
  title: string;
  description?: string;
}

export default function BIPlaceholderPage({ title, description }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <Link
          to="/modelos-bi"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Modelos de BI
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Construction size={26} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {description ?? "Este painel está em construção. Em breve disponibilizaremos a primeira versão."}
          </p>
          <Link
            to="/modelos-bi"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Voltar para Modelos de BI
          </Link>
        </div>
      </main>
    </div>
  );
}