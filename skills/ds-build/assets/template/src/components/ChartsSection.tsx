import { useState } from "react";
import { ComponentPreview, SectionHeader } from "@/components/DSComponents";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Legend,
  ComposedChart, RadialBarChart, RadialBar,
} from "recharts";

/* ========== DATA ========== */
const basicAreaData = [
  { name: "10 AM", valor: 85 }, { name: "1 PM", valor: 110 }, { name: "4 PM", valor: 95 },
  { name: "7 PM", valor: 105 }, { name: "10 PM", valor: 78 },
];

const splineData = [
  { name: "10 AM", iphone: 95, android: 78 },
  { name: "1 PM", iphone: 110, android: 85 },
  { name: "4 PM", iphone: 80, android: 100 },
  { name: "7 PM", iphone: 65, android: 90 },
  { name: "10 PM", iphone: 120, android: 72 },
];

const timeSeriesData = [
  { name: "Mar '12", valor: 30.5 }, { name: "Mai '12", valor: 31.2 },
  { name: "Jul '12", valor: 32.8 }, { name: "Set '12", valor: 34.1 },
  { name: "Nov '12", valor: 36.5 }, { name: "Jan '13", valor: 38.8 },
  { name: "Mar '13", valor: 39.2 },
];

const negativeData = [
  { name: "Jan", norte: 50, sul: -30 }, { name: "Fev", norte: 70, sul: -50 },
  { name: "Mar", norte: 90, sul: -80 }, { name: "Abr", norte: 60, sul: -40 },
  { name: "Mai", norte: 110, sul: -100 }, { name: "Jun", norte: 80, sul: -20 },
];

const stackedData = [
  { name: "Jan", sul: 110, norte: 80, centro: 50 },
  { name: "Fev", sul: 90, norte: 120, centro: 70 },
  { name: "Mar", sul: 130, norte: 90, centro: 60 },
  { name: "Abr", sul: 70, norte: 100, centro: 80 },
  { name: "Mai", sul: 140, norte: 110, centro: 90 },
  { name: "Jun", sul: 100, norte: 130, centro: 55 },
];

const barData = [
  { name: "Jan", receita: 4000, despesa: 2400 },
  { name: "Fev", receita: 3000, despesa: 1398 },
  { name: "Mar", receita: 2000, despesa: 9800 },
  { name: "Abr", receita: 2780, despesa: 3908 },
  { name: "Mai", receita: 1890, despesa: 4800 },
  { name: "Jun", receita: 2390, despesa: 3800 },
];

const pieData = [
  { name: "Educação", value: 40 },
  { name: "Infraestrutura", value: 25 },
  { name: "Tecnologia", value: 20 },
  { name: "Outros", value: 15 },
];
const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--success))", "hsl(var(--info))"];

const composedData = [
  { name: "Jan", area: 400, bar: 240, line: 200 },
  { name: "Fev", area: 300, bar: 139, line: 220 },
  { name: "Mar", area: 200, bar: 980, line: 290 },
  { name: "Abr", area: 278, bar: 390, line: 200 },
  { name: "Mai", area: 189, bar: 480, line: 218 },
  { name: "Jun", area: 239, bar: 380, line: 250 },
];

const radialData = [
  { name: "Concluído", value: 78, fill: "hsl(var(--success))" },
  { name: "Em andamento", value: 55, fill: "hsl(var(--primary))" },
  { name: "Pendente", value: 30, fill: "hsl(var(--secondary))" },
];

const lineMultiData = [
  { name: "Seg", receita: 120, custo: 80, lucro: 40 },
  { name: "Ter", receita: 150, custo: 90, lucro: 60 },
  { name: "Qua", receita: 130, custo: 85, lucro: 45 },
  { name: "Qui", receita: 180, custo: 100, lucro: 80 },
  { name: "Sex", receita: 200, custo: 110, lucro: 90 },
  { name: "Sáb", receita: 170, custo: 95, lucro: 75 },
  { name: "Dom", receita: 140, custo: 88, lucro: 52 },
];

/* ========== COLUMN CHART DATA ========== */
const basicColumnData = [
  { name: "Fev", prog_a: 44, prog_b: 76, prog_c: 35 },
  { name: "Mar", prog_a: 55, prog_b: 85, prog_c: 41 },
  { name: "Abr", prog_a: 57, prog_b: 101, prog_c: 36 },
  { name: "Mai", prog_a: 56, prog_b: 98, prog_c: 26 },
  { name: "Jun", prog_a: 61, prog_b: 87, prog_c: 45 },
  { name: "Jul", prog_a: 58, prog_b: 105, prog_c: 48 },
  { name: "Ago", prog_a: 63, prog_b: 91, prog_c: 52 },
  { name: "Set", prog_a: 60, prog_b: 114, prog_c: 53 },
  { name: "Out", prog_a: 66, prog_b: 94, prog_c: 41 },
];

const dataLabelsData = [
  { name: "Jan", valor: 2.3 }, { name: "Fev", valor: 3.1 },
  { name: "Mar", valor: 4.0 }, { name: "Abr", valor: 10.1 },
  { name: "Mai", valor: 4.0 }, { name: "Jun", valor: 3.6 },
];

const stackedColumnData = [
  { name: "2023 Q1", produto_a: 65, produto_b: 28, produto_c: 35 },
  { name: "2023 Q2", produto_a: 59, produto_b: 48, produto_c: 29 },
  { name: "2023 Q3", produto_a: 80, produto_b: 40, produto_c: 50 },
  { name: "2023 Q4", produto_a: 81, produto_b: 19, produto_c: 45 },
  { name: "2024 Q1", produto_a: 56, produto_b: 86, produto_c: 60 },
  { name: "2024 Q2", produto_a: 55, produto_b: 27, produto_c: 33 },
  { name: "2024 Q3", produto_a: 40, produto_b: 90, produto_c: 38 },
  { name: "2024 Q4", produto_a: 72, produto_b: 50, produto_c: 47 },
];

const stacked100Data = [
  { name: "2023 Q1", produto_a: 65, produto_b: 19, produto_c: 16 },
  { name: "2023 Q2", produto_a: 58, produto_b: 24, produto_c: 18 },
  { name: "2023 Q3", produto_a: 54, produto_b: 26, produto_c: 20 },
  { name: "2023 Q4", produto_a: 74, produto_b: 17, produto_c: 9 },
];

const groupedStackedData = [
  { name: "2022", q1: 40, q2: 30, q3: 35, q4: 25 },
  { name: "2023", q1: 50, q2: 40, q3: 45, q4: 35 },
  { name: "2024", q1: 60, q2: 50, q3: 55, q4: 45 },
];

const horizontalData = [
  { name: "Capacitação", valor: 4500 },
  { name: "Infraestrutura", valor: 3200 },
  { name: "Tecnologia", valor: 2800 },
  { name: "Consultoria", valor: 2400 },
  { name: "Transporte", valor: 1800 },
  { name: "Materiais Didáticos", valor: 1200 },
];

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

/* ========== COLUMN CODE BLOCKS ========== */
const codeBasicColumn = `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Fev", prog_a: 44, prog_b: 76, prog_c: 35 },
  { name: "Mar", prog_a: 55, prog_b: 85, prog_c: 41 },
  // ...
];

<ResponsiveContainer width="100%" height={320}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis label={{ value: "R$ (milhões)", angle: -90, position: "insideLeft" }} />
    <Tooltip />
    <Legend />
    <Bar dataKey="prog_a" name="Empreender" fill="hsl(var(--success))" radius={[2,2,0,0]} />
    <Bar dataKey="prog_b" name="AGI" fill="hsl(var(--primary))" radius={[2,2,0,0]} />
    <Bar dataKey="prog_c" name="Programa Inova" fill="hsl(var(--info))" radius={[2,2,0,0]} />
  </BarChart>
</ResponsiveContainer>`;

const codeDataLabels = `// Colunas com rótulo de valor acima de cada barra
<ResponsiveContainer width="100%" height={320}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4,4,0,0]}
      label={{ position: "top", fontSize: 11, fill: "hsl(var(--foreground))" }} />
  </BarChart>
</ResponsiveContainer>`;

const codeStackedColumn = `// Colunas empilhadas com labels internos
<ResponsiveContainer width="100%" height={320}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="produto_a" name="Empreender" stackId="a"
      fill="hsl(var(--success))"
      label={{ position: "inside", fontSize: 10, fill: "#fff" }} />
    <Bar dataKey="produto_b" name="AGI" stackId="a"
      fill="hsl(var(--primary))"
      label={{ position: "inside", fontSize: 10, fill: "#fff" }} />
    <Bar dataKey="produto_c" name="Programa Inova" stackId="a"
      fill="hsl(var(--info))" radius={[4,4,0,0]}
      label={{ position: "inside", fontSize: 10, fill: "#fff" }} />
  </BarChart>
</ResponsiveContainer>`;

const codeStacked100 = `// Colunas 100% empilhadas (valores em %)
<ResponsiveContainer width="100%" height={320}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis tickFormatter={(v) => \`\${v}%\`} />
    <Tooltip formatter={(value) => \`\${value}%\`} />
    <Legend />
    <Bar dataKey="produto_a" name="Empreender" stackId="a"
      fill="hsl(var(--success))"
      label={{ position: "inside", fontSize: 10, fill: "#fff",
        formatter: (v) => \`\${v}%\` }} />
    <Bar dataKey="produto_b" name="AGI" stackId="a"
      fill="hsl(var(--primary))"
      label={{ position: "inside", fontSize: 10, fill: "#fff",
        formatter: (v) => \`\${v}%\` }} />
    <Bar dataKey="produto_c" name="Programa Inova" stackId="a"
      fill="hsl(var(--info))" radius={[4,4,0,0]}
      label={{ position: "inside", fontSize: 10, fill: "#fff",
        formatter: (v) => \`\${v}%\` }} />
  </BarChart>
</ResponsiveContainer>`;

const codeGroupedStacked = `// Colunas agrupadas + empilhadas
<ResponsiveContainer width="100%" height={320}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="q1" name="Q1" stackId="a" fill="hsl(var(--primary))" />
    <Bar dataKey="q2" name="Q2" stackId="a" fill="hsl(var(--primary))"
      fillOpacity={0.5} radius={[4,4,0,0]} />
    <Bar dataKey="q3" name="Q3" stackId="b" fill="hsl(var(--secondary))" />
    <Bar dataKey="q4" name="Q4" stackId="b" fill="hsl(var(--secondary))"
      fillOpacity={0.5} radius={[4,4,0,0]} />
  </BarChart>
</ResponsiveContainer>`;

const codeHorizontal = `// Barras horizontais — ideal para rankings
<ResponsiveContainer width="100%" height={320}>
  <BarChart data={data} layout="vertical">
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" width={120} />
    <Tooltip />
    <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0,4,4,0]}
      label={{ position: "right", fontSize: 11 }} />
  </BarChart>
</ResponsiveContainer>`;

/* ========== COPYABLE CODE BLOCKS ========== */
const codeBasicArea = `import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "10 AM", valor: 85 },
  { name: "1 PM", valor: 110 },
  { name: "4 PM", valor: 95 },
  { name: "7 PM", valor: 105 },
  { name: "10 PM", valor: 78 },
];

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="valor"
      stroke="hsl(var(--primary))"
      fill="hsl(var(--primary) / 0.2)" />
  </AreaChart>
</ResponsiveContainer>`;

const codeSpline = `import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "10 AM", iphone: 95, android: 78 },
  { name: "1 PM", iphone: 110, android: 85 },
  // ...
];

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Area type="monotone" dataKey="iphone"
      stroke="hsl(var(--error))" fill="hsl(var(--error) / 0.15)" />
    <Area type="monotone" dataKey="android"
      stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" />
  </AreaChart>
</ResponsiveContainer>`;

const codeTimeSeries = `// Área com eixo temporal e filtro de período
const [period, setPeriod] = useState("1Y");

<div className="flex gap-2 mb-4">
  {["1M","6M","1Y","YTD","ALL"].map(p => (
    <button key={p} onClick={() => setPeriod(p)}
      className={\`px-3 py-1 rounded text-xs font-medium \${
        period === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      }\`}>{p}</button>
  ))}
</div>

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="valor"
      stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.3)" />
  </AreaChart>
</ResponsiveContainer>`;

const codeNegative = `// Área com valores positivos e negativos
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="norte"
      stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.3)" />
    <Area type="monotone" dataKey="sul"
      stroke="hsl(var(--error))" fill="hsl(var(--error) / 0.3)" />
  </AreaChart>
</ResponsiveContainer>`;

const codeStacked = `// Área empilhada (Stacked Area)
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Area type="monotone" dataKey="sul" stackId="1"
      stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.6)" />
    <Area type="monotone" dataKey="norte" stackId="1"
      stroke="hsl(var(--secondary))" fill="hsl(var(--secondary) / 0.6)" />
    <Area type="monotone" dataKey="centro" stackId="1"
      stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.6)" />
  </AreaChart>
</ResponsiveContainer>`;

const codeBar = `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
    <Bar dataKey="despesa" fill="hsl(var(--secondary))" radius={[4,4,0,0]} />
  </BarChart>
</ResponsiveContainer>`;

const codeLineMulti = `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="receita"
      stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
    <Line type="monotone" dataKey="custo"
      stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} />
    <Line type="monotone" dataKey="lucro"
      stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
  </LineChart>
</ResponsiveContainer>`;

const codePie = `import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--success))", "hsl(var(--info))"];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
      paddingAngle={3} dataKey="value" label={({ name, percent }) =>
        \`\${name} \${(percent * 100).toFixed(0)}%\`
      }>
      {data.map((_, i) => (
        <Cell key={i} fill={COLORS[i % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>`;

const codeComposed = `import { ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <ComposedChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Area type="monotone" dataKey="area"
      fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" />
    <Bar dataKey="bar" fill="hsl(var(--secondary))" radius={[4,4,0,0]} />
    <Line type="monotone" dataKey="line"
      stroke="hsl(var(--success))" strokeWidth={2} />
  </ComposedChart>
</ResponsiveContainer>`;

const codeRadial = `import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%"
    data={data} startAngle={180} endAngle={0}>
    <RadialBar background clockWise dataKey="value" cornerRadius={6} />
    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
  </RadialBarChart>
</ResponsiveContainer>`;

/* ========== CHART WRAPPER ========== */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ========== MAIN SECTION ========== */
export default function ChartsSection() {
  const [period, setPeriod] = useState("1Y");

  return (
    <>
      <SectionHeader
        id="graficos"
        title="Gráficos"
        description="Biblioteca de gráficos para dashboards e relatórios. Utiliza Recharts. Cada exemplo inclui código pronto para copiar."
      />

      {/* 1. Basic Area */}
      <ComponentPreview
        title="Gráfico de Área Básico"
        description="Ideal para exibir tendências ao longo do tempo com preenchimento sob a linha."
        code={codeBasicArea}
        whenToUse={["Exibir evolução temporal de um indicador", "Destacar volume ou magnitude"]}
        whenNotToUse={["Comparar muitas séries simultaneamente", "Dados categóricos sem continuidade"]}
        accessibility={["Forneça descrição textual do gráfico via aria-label", "Use cores com contraste suficiente"]}
      >
        <ChartCard title="Basic Area Chart">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={basicAreaData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 2. Spline Area */}
      <ComponentPreview
        title="Spline Area (Múltiplas séries)"
        description="Gráfico de área suavizado com duas ou mais séries para comparação lado a lado."
        code={codeSpline}
        whenToUse={["Comparar dois datasets ao longo do tempo", "Visualizar tendências paralelas"]}
        whenNotToUse={["Mais de 4 séries (fica poluído)", "Dados com poucos pontos"]}
      >
        <ChartCard title="Spline Area">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={splineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="iphone" stroke="hsl(var(--error))" fill="hsl(var(--error))" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="android" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 3. Time Series with filter */}
      <ComponentPreview
        title="Área com Eixo Temporal e Filtro"
        description="Gráfico de área com botões de período (1M, 6M, 1Y, YTD, ALL), ideal para dashboards financeiros."
        code={codeTimeSeries}
        whenToUse={["Dashboards financeiros com seleção de período", "Séries temporais longas"]}
        whenNotToUse={["Dados sem dimensão temporal", "Poucos pontos de dados"]}
      >
        <ChartCard title="Area Chart — Datetime X-axis">
          <div className="flex gap-2 mb-4">
            {["1M", "6M", "1Y", "YTD", "ALL"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 4. Negative Values */}
      <ComponentPreview
        title="Área com Valores Negativos"
        description="Gráfico de área que exibe valores positivos e negativos, ideal para balanços e variações."
        code={codeNegative}
        whenToUse={["Exibir saldo positivo/negativo", "Comparar ganhos vs perdas"]}
        whenNotToUse={["Dados sem valores negativos", "Quando a distinção positivo/negativo não é relevante"]}
      >
        <ChartCard title="Area with Negative Values">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={negativeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="norte" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} strokeWidth={2} />
              <Area type="monotone" dataKey="sul" stroke="hsl(var(--error))" fill="hsl(var(--error))" fillOpacity={0.3} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 5. Stacked Area */}
      <ComponentPreview
        title="Área Empilhada (Stacked)"
        description="Gráfico de área empilhada para visualizar a composição total ao longo do tempo."
        code={codeStacked}
        whenToUse={["Exibir composição de um total", "Visualizar contribuição de cada categoria"]}
        whenNotToUse={["Muitas categorias (mais de 5)", "Quando valores individuais são mais importantes que o total"]}
      >
        <ChartCard title="Stacked Area">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="sul" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} strokeWidth={2} />
              <Area type="monotone" dataKey="norte" stackId="1" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} strokeWidth={2} />
              <Area type="monotone" dataKey="centro" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.6} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 6. Bar Chart */}
      <ComponentPreview
        title="Gráfico de Barras"
        description="Barras verticais para comparar valores categóricos lado a lado."
        code={codeBar}
        whenToUse={["Comparar valores entre categorias", "Visualizar receita vs despesa"]}
        whenNotToUse={["Dados contínuos temporais (use área/linha)", "Muitas categorias com nomes longos"]}
      >
        <ChartCard title="Bar Chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 7. Multi-Line */}
      <ComponentPreview
        title="Gráfico de Linhas Múltiplas"
        description="Linhas com pontos para acompanhar múltiplas métricas com clareza."
        code={codeLineMulti}
        whenToUse={["Acompanhar tendências de 2-4 indicadores", "Dashboard de performance"]}
        whenNotToUse={["Mais de 5 linhas", "Dados categóricos sem continuidade"]}
      >
        <ChartCard title="Multi-Line Chart">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineMultiData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="custo" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="lucro" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 8. Donut / Pie */}
      <ComponentPreview
        title="Gráfico de Rosca (Donut)"
        description="Gráfico circular com furo central para exibir proporções e distribuições."
        code={codePie}
        whenToUse={["Exibir distribuição percentual", "Máximo 5-6 fatias"]}
        whenNotToUse={["Muitas categorias", "Quando precisão exata é necessária (use tabela)"]}
      >
        <ChartCard title="Donut Chart">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 9. Composed Chart */}
      <ComponentPreview
        title="Gráfico Composto (Área + Barra + Linha)"
        description="Combina diferentes tipos de visualização em um único gráfico para análises complexas."
        code={codeComposed}
        whenToUse={["Combinar métricas com escalas diferentes", "Análises comparativas multidimensionais"]}
        whenNotToUse={["Dados simples (use um tipo único)", "Quando pode causar confusão visual"]}
      >
        <ChartCard title="Composed Chart">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={composedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="area" fill="hsl(var(--primary))" fillOpacity={0.15} stroke="hsl(var(--primary))" strokeWidth={2} />
              <Bar dataKey="bar" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="line" stroke="hsl(var(--success))" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 10. Radial Bar */}
      <ComponentPreview
        title="Gráfico Radial (Gauge)"
        description="Barras radiais para exibir progresso e metas em formato circular."
        code={codeRadial}
        whenToUse={["Exibir progresso de metas", "KPIs em formato compacto"]}
        whenNotToUse={["Comparar muitas categorias", "Quando precisão numérica é prioritária"]}
      >
        <ChartCard title="Radial Bar Chart">
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
              <RadialBar background dataKey="value" cornerRadius={6} />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* ===== COLUMN / BAR CHARTS ===== */}

      {/* 11. Basic Column */}
      <ComponentPreview
        title="Colunas Básicas (Múltiplas séries)"
        description="Barras agrupadas para comparar investimentos por programa __BRAND_NAME__ em cada período."
        code={codeBasicColumn}
        whenToUse={["Comparar 2-3 programas por período", "Análise de repasses por programa"]}
        whenNotToUse={["Mais de 4 séries (fica poluído)", "Dados contínuos (use linha/área)"]}
      >
        <ChartCard title="Colunas Básicas — Programas __BRAND_NAME__">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={basicColumnData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" label={{ value: "R$ (milhões)", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="prog_a" name="Empreender" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="prog_b" name="AGI" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="prog_c" name="Programa Inova" fill="hsl(var(--info))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 12. Column with Data Labels */}
      <ComponentPreview
        title="Colunas com Data Labels"
        description="Gráfico de barras com rótulos de valor exibidos acima de cada coluna para leitura direta."
        code={codeDataLabels}
        whenToUse={["Relatórios impressos ou exportados", "Quando o valor exato é mais importante que a tendência"]}
        whenNotToUse={["Muitas barras (labels se sobrepõem)", "Visualizações interativas com tooltip"]}
      >
        <ChartCard title="Gráfico de Colunas com Rótulos de Dados">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dataLabelsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} label={{ position: "top", fontSize: 11, fill: "hsl(var(--foreground))" }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 13. Stacked Column */}
      <ComponentPreview
        title="Colunas Empilhadas (Stacked)"
        description="Barras empilhadas para exibir composição total por período com detalhamento por categoria."
        code={codeStackedColumn}
        whenToUse={["Exibir composição de um total por período", "Vendas por produto/trimestre"]}
        whenNotToUse={["Comparar valores individuais entre categorias", "Quando a contribuição de cada parte é pequena"]}
      >
        <ChartCard title="Colunas Empilhadas — Programas __BRAND_NAME__">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stackedColumnData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="produto_a" name="Empreender" stackId="a" fill="hsl(var(--success))" label={{ position: "inside", fontSize: 10, fill: "#fff" }} />
              <Bar dataKey="produto_b" name="AGI" stackId="a" fill="hsl(var(--primary))" label={{ position: "inside", fontSize: 10, fill: "#fff" }} />
              <Bar dataKey="produto_c" name="Programa Inova" stackId="a" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} label={{ position: "inside", fontSize: 10, fill: "#fff" }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 14. 100% Stacked */}
      <ComponentPreview
        title="Colunas 100% Empilhadas"
        description="Cada barra representa 100% da composição, ideal para comparar proporções relativas entre períodos."
        code={codeStacked100}
        whenToUse={["Comparar proporções relativas", "Market share por período"]}
        whenNotToUse={["Valores absolutos são mais importantes", "Poucas categorias sem variação significativa"]}
      >
        <ChartCard title="100% Empilhadas — Programas __BRAND_NAME__">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stacked100Data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}%`} />
              <Legend />
              <Bar dataKey="produto_a" name="Empreender" stackId="a" fill="hsl(var(--success))" label={{ position: "inside", fontSize: 10, fill: "#fff", formatter: (v: number) => `${v}%` }} />
              <Bar dataKey="produto_b" name="AGI" stackId="a" fill="hsl(var(--primary))" label={{ position: "inside", fontSize: 10, fill: "#fff", formatter: (v: number) => `${v}%` }} />
              <Bar dataKey="produto_c" name="Programa Inova" stackId="a" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} label={{ position: "inside", fontSize: 10, fill: "#fff", formatter: (v: number) => `${v}%` }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 15. Grouped + Stacked */}
      <ComponentPreview
        title="Colunas Agrupadas + Empilhadas"
        description="Combinação de barras agrupadas com empilhamento para análises multidimensionais complexas."
        code={codeGroupedStacked}
        whenToUse={["Análise de múltiplas dimensões", "Comparar composições entre grupos"]}
        whenNotToUse={["Dados simples", "Quando causa confusão visual"]}
      >
        <ChartCard title="Grouped Stacked Column Chart">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={groupedStackedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="q1" name="Q1" stackId="a" fill="hsl(var(--primary))" />
              <Bar dataKey="q2" name="Q2" stackId="a" fill="hsl(var(--primary))" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
              <Bar dataKey="q3" name="Q3" stackId="b" fill="hsl(var(--secondary))" />
              <Bar dataKey="q4" name="Q4" stackId="b" fill="hsl(var(--secondary))" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>

      {/* 16. Horizontal Bar */}
      <ComponentPreview
        title="Barras Horizontais"
        description="Variação horizontal do gráfico de barras, ideal para nomes longos de categorias e rankings."
        code={codeHorizontal}
        whenToUse={["Rankings e classificações", "Categorias com nomes longos"]}
        whenNotToUse={["Dados temporais (use vertical)", "Muitas categorias (> 10)"]}
      >
        <ChartCard title="Horizontal Bar Chart">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={horizontalData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs fill-muted-foreground" />
              <YAxis dataKey="name" type="category" width={120} className="text-xs fill-muted-foreground" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 11, fill: "hsl(var(--foreground))" }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ComponentPreview>
    </>
  );
}
