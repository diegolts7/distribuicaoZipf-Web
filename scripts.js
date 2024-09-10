function generateGraphs() {
  // Obter os valores do formulário
  const text = document.getElementById("text").value;
  const s = parseFloat(document.getElementById("s").value);

  // Processar o texto
  const words = text.split(/\s+/);
  const wordFreq = {};
  words.forEach((word) => {
    word = word.toLowerCase();
    if (word) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  // Ordenar por frequência
  const sortedWordFreq = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);

  const ranks = [];
  const frequencies = [];
  sortedWordFreq.forEach(([_, freq], index) => {
    ranks.push(index + 1);
    frequencies.push(freq);
  });

  // Calcular PMF e CDF teóricos
  const C = frequencies[0]; // Constante de normalização
  const pmf = ranks.map((r) => C / Math.pow(r, s));
  const cdf = pmf.reduce((acc, val, index) => {
    acc.push((acc[index - 1] || 0) + val);
    return acc;
  }, []);

  // Gerar gráficos
  const tracePMF = {
    x: ranks,
    y: pmf,
    mode: "lines",
    type: "scatter",
    name: "PMF Teórica",
  };

  const traceCDF = {
    x: ranks,
    y: cdf,
    mode: "lines",
    type: "scatter",
    name: "CDF Teórica",
    line: { color: "red" },
  };

  const traceDataReal = {
    x: ranks,
    y: frequencies,
    mode: "markers",
    type: "scatter",
    name: "Dados Reais",
  };

  const layout = {
    xaxis: { type: "log", title: "Ranking" },
    yaxis: { type: "log", title: "Frequência" },
    title: "Distribuição de Zipf: PMF e CDF",
  };

  Plotly.newPlot("plot", [traceDataReal, tracePMF, traceCDF], layout);
}
