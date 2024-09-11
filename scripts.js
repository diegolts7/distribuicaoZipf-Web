function generateGraphs() {
  // Obter os valores do formulário
  const text = document.getElementById("text").value;
  const s = parseFloat(document.getElementById("s").value);

  // Processar o texto
  const words = text.split(/\s+/);
  const wordFreq = {};
  words.forEach((word) => {
    if (word[word.length - 1] === "." || word[word.length - 1] === ",") {
      word = word.slice(0, -1);
    }
    word = word.toLowerCase();
    if (word) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  // Ordenar por frequência
  const sortedWordFreq = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);

  const labels = []; // Para armazenar as palavras com rankings
  const frequencies = [];
  sortedWordFreq.forEach(([word, freq], index) => {
    labels.push(`${word} (#${index + 1})`); // Exemplo: "palavra (#1)"
    frequencies.push(freq);
  });

  // Calcular PMF e CDF teóricos
  const C = frequencies[0]; // Constante de normalização
  const pmf = labels.map((_, r) => C / Math.pow(r + 1, s));
  const cdf = pmf.reduce((acc, val, index) => {
    acc.push((acc[index - 1] || 0) + val);
    return acc;
  }, []);

  // Gerar gráficos
  const tracePMF = {
    x: labels, // Usando as palavras com rankings no eixo x
    y: pmf,
    mode: "lines",
    type: "scatter",
    name: "PMF Teórica",
  };

  const traceCDF = {
    x: labels, // Usando as palavras com rankings no eixo x
    y: cdf,
    mode: "lines",
    type: "scatter",
    name: "CDF Teórica",
    line: { color: "red" },
  };

  const traceDataReal = {
    x: labels, // Usando as palavras com rankings no eixo x
    y: frequencies,
    mode: "markers", // Alterado para mostrar bolinhas ao invés de linha
    type: "scatter",
    name: "Dados Reais",
  };

  const layout = {
    xaxis: { title: "Palavra (Ranking)", type: "category" }, // Exibe as palavras no eixo x
    yaxis: { type: "log", title: "Frequência" },
    title: "Distribuição de Zipf: PMF e CDF",
  };

  Plotly.newPlot("plot", [traceDataReal, tracePMF, traceCDF], layout);
}
