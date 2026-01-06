import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import StructureChart from "@/components/StructureChart";
import TimeSeriesChart from "@/components/TimeSeriesChart";
import TopResourcesChart from "@/components/TopResourcesChart";
import { DollarSign, TrendingUp, Calendar, Layers } from "lucide-react";

interface DashboardData {
  raw_data: any[];
  metrics: {
    total_por_estrutura: Array<{ Estrutura: string; Valor: number }>;
    total_por_mes: Array<{ Mes: string; Valor: number }>;
    top_recursos: Array<{ Recurso: string; Valor: number }>;
    total_geral: number;
  };
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar dados:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full"></div>
          </div>
          <p className="mt-4 text-muted-foreground font-medium">
            Carregando dados...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium">
            Erro ao carregar os dados
          </p>
        </div>
      </div>
    );
  }

  const totalGeral = data.metrics.total_geral;
  const estruturas = data.metrics.total_por_estrutura;
  const maiorEstrutura = estruturas[0];
  const percentualMaior = ((maiorEstrutura.Valor / totalGeral) * 100).toFixed(
    1
  );

  const meses = data.metrics.total_por_mes;
  const mesComMaiorRecurso = meses.reduce((prev, current) =>
    prev.Valor > current.Valor ? prev : current
  );

  const topRecursos = data.metrics.top_recursos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border/50 bg-gradient-to-r from-card to-card/95 shadow-sm">
        {/* Background image */}
        <div className="absolute inset-0 opacity-30">
          <img
            src="/images/header-bg.png"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-card/60" />

        {/* Content */}
        <div className="relative container py-10">
          <div className="flex items-center gap-4 mb-3 animate-slide-in-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <DollarSign className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-poppins text-foreground">
                Recursos Públicos Liberados
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Análise de recursos liberados em 2025
              </p>
              <a
                className="font-bold text-foreground mb-4 text-white mt-5"
                href="https://dados.teresopolis.rj.gov.br/dataset/recursos-financeiros/resource/341476d6-9c19-4f68-8be8-edb9bff6547f"
              >
                Dados Abertos Compilados - Clique Aqui 🗎
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* KPIs Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-poppins text-foreground mb-2">
              Indicadores Principais
            </h2>
            <p className="text-muted-foreground">
              Métricas-chave de recursos liberados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Liberado"
              value={`R$ ${(totalGeral / 1_000_000).toFixed(1)}M`}
              subtitle="Ano de 2025"
              icon={<DollarSign className="w-6 h-6" />}
              delay={0}
            />

            <MetricCard
              title="Maior Estrutura"
              value={maiorEstrutura.Estrutura}
              subtitle={`${percentualMaior}% do total`}
              icon={<Layers className="w-6 h-6" />}
              delay={1}
            />

            <MetricCard
              title="Mês com Maior Recurso"
              value={`R$ ${(mesComMaiorRecurso.Valor / 1_000_000).toFixed(1)}M`}
              subtitle={`Mês de Outubro`}
              icon={<Calendar className="w-6 h-6" />}
              delay={2}
            />

            <MetricCard
              title="Número de Estruturas"
              value={estruturas.length}
              subtitle="Setores beneficiados"
              icon={<TrendingUp className="w-6 h-6" />}
              delay={3}
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-poppins text-foreground mb-2">
              Visualizações Detalhadas
            </h2>
            <p className="text-muted-foreground">
              Análise visual dos dados
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TimeSeriesChart data={meses} />
            <StructureChart data={estruturas} />
          </div>

          <div className="w-full">
            <TopResourcesChart data={topRecursos} />
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <section className="relative group overflow-hidden bg-gradient-to-br from-card to-card/95 border border-border/50 rounded-xl p-8 text-center shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <p className="text-sm text-muted-foreground mb-2">
            Dados processados de recursos liberados em 2025
          </p>
          <p className="text-xs text-muted-foreground/70">
            Mantido pelo Departamento de Governança de Dados
          </p>
        </div>
      </section>
    </div>
  );
}
