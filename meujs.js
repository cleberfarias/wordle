const palavras = {
  20250521: "MANGA",
  20250522: "LENTE",
  20250523: "NUVEM",
  20250524: "TIGRE",
  20250525: "PIANO",
  20250526: "FESTA",
  20250527: "BOLHA",
};

const hoje = new Date();
const yyyy = hoje.getFullYear();
const mm = String(hoje.getMonth() + 1).padStart(2, "0");
const dd = String(hoje.getDate()).padStart(2, "0");
const dataHoje = `${yyyy}${mm}${dd}`;
const palavraSecreta = palavras[dataHoje];

const botoesTeclado = document.querySelectorAll(".letras, .ctrl");
const linhas = document.querySelectorAll(".linha");

let tentativaAtual = 0;
let posicaoAtual = 0;
const maxTentativas = 6;
const tamanhoPalavra = 5;

// Carrega progresso salvo
carregarEstadoJogo();
atualizarLinhaAtual();

function atualizarLinhaAtual() {
  linhas.forEach((linha, index) => {
    linha.classList.toggle("linha-atual", index === tentativaAtual);
  });
}

function mostrarAviso(mensagem) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = mensagem;
  aviso.classList.add("mostrar");
  setTimeout(() => aviso.classList.remove("mostrar"), 2000);
}

function pintarTeclado(statusLetras) {
  botoesTeclado.forEach((botao) => {
    const letra = botao.textContent.trim().toUpperCase();
    const status = statusLetras[letra];

    if (status) {
      botao.classList.remove("verde", "amarelo", "cinza");
      if (
        status === "verde" ||
        (status === "amarelo" && !botao.classList.contains("verde")) ||
        (status === "cinza" &&
          !botao.classList.contains("verde") &&
          !botao.classList.contains("amarelo"))
      ) {
        botao.classList.add(status);
      }
    }
  });
}

function capturaLetra(tecla) {
  const linha = linhas[tentativaAtual];
  const quadrados = linha.querySelectorAll(".Quadrado");

  if (tecla === "ENTER") {
    if (posicaoAtual < tamanhoPalavra) {
      linha.classList.add("shake");
      linha.addEventListener(
        "animationend",
        () => linha.classList.remove("shake"),
        { once: true }
      );
      return;
    }

    let palavraDigitada = "";
    quadrados.forEach((q) => (palavraDigitada += q.textContent));

    const usada = Array(tamanhoPalavra).fill(false);
    const cores = Array(tamanhoPalavra).fill("cinza");
    const statusLetras = {};

    for (let i = 0; i < tamanhoPalavra; i++) {
      if (palavraDigitada[i] === palavraSecreta[i]) {
        cores[i] = "verde";
        usada[i] = true;
        statusLetras[palavraDigitada[i]] = "verde";
      }
    }

    for (let i = 0; i < tamanhoPalavra; i++) {
      if (cores[i] === "verde") continue;
      for (let j = 0; j < tamanhoPalavra; j++) {
        if (!usada[j] && palavraDigitada[i] === palavraSecreta[j]) {
          cores[i] = "amarelo";
          usada[j] = true;
          if (statusLetras[palavraDigitada[i]] !== "verde") {
            statusLetras[palavraDigitada[i]] = "amarelo";
          }
          break;
        }
      }
    }

    quadrados.forEach((q, i) => q.classList.add(cores[i]));
    pintarTeclado(statusLetras);

    if (palavraDigitada === palavraSecreta) {
      setTimeout(
        () => alert(`✅ Você acertou! A palavra era ${palavraSecreta}.`),
        300
      );
      limparEstadoJogo();
      return;
    }

    tentativaAtual++;
    posicaoAtual = 0;
    atualizarLinhaAtual();
    salvarEstadoJogo();

    if (tentativaAtual >= maxTentativas) {
      setTimeout(
        () => alert(`💀 Fim de jogo. A palavra era ${palavraSecreta}.`),
        300
      );
      limparEstadoJogo();
    }
    return;
  }

  if (tecla === "BACKSPACE") {
    if (posicaoAtual > 0) {
      posicaoAtual--;
      quadrados[posicaoAtual].textContent = "";
    }
    return;
  }

  if (tecla.length === 1 && tecla.match(/[A-Z]/) && posicaoAtual < tamanhoPalavra) {
    quadrados[posicaoAtual].textContent = tecla;
    posicaoAtual++;
  }
}

document.addEventListener("keydown", function (e) {
  const teclado = e.key.toUpperCase().trim();
  capturaLetra(teclado);
});

botoesTeclado.forEach((botao) => {
  botao.addEventListener("click", () => {
    let tecla = botao.textContent.trim().toUpperCase();
    if (botao.classList.contains("backspace")) tecla = "BACKSPACE";
    capturaLetra(tecla);
  });
});

// 🔥 Salvar estado
function salvarEstadoJogo() {
  const linhasData = Array.from(linhas).map((linha) => {
    const quadrados = linha.querySelectorAll(".Quadrado");
    return Array.from(quadrados).map((q) => ({
      letra: q.textContent,
      cor: q.classList.contains("verde")
        ? "verde"
        : q.classList.contains("amarelo")
        ? "amarelo"
        : q.classList.contains("cinza")
        ? "cinza"
        : "",
    }));
  });

  const tecladoData = {};
  botoesTeclado.forEach((botao) => {
    tecladoData[botao.textContent.trim()] =
      botao.classList.contains("verde")
        ? "verde"
        : botao.classList.contains("amarelo")
        ? "amarelo"
        : botao.classList.contains("cinza")
        ? "cinza"
        : "";
  });

  const estado = {
    tentativaAtual,
    posicaoAtual,
    linhas: linhasData,
    teclado: tecladoData,
  };

  localStorage.setItem(`estadoJogo_${dataHoje}`, JSON.stringify(estado));
}

// 🔥 Carregar estado
function carregarEstadoJogo() {
  const salvo = localStorage.getItem(`estadoJogo_${dataHoje}`);
  if (!salvo) return;

  const estado = JSON.parse(salvo);
  tentativaAtual = estado.tentativaAtual;
  posicaoAtual = estado.posicaoAtual;

  estado.linhas.forEach((linha, i) => {
    const linhaElement = linhas[i];
    const quadrados = linhaElement.querySelectorAll(".Quadrado");
    linha.forEach((caixa, j) => {
      quadrados[j].textContent = caixa.letra;
      if (caixa.cor) {
        quadrados[j].classList.add(caixa.cor);
      }
    });
  });

  for (const [letra, classe] of Object.entries(estado.teclado)) {
    const tecla = Array.from(botoesTeclado).find(
      (t) => t.textContent.trim() === letra
    );
    if (tecla) {
      tecla.classList.remove("verde", "amarelo", "cinza");
      if (classe) tecla.classList.add(classe);
    }
  }
}

// 🔥 Limpar estado
function limparEstadoJogo() {
  localStorage.removeItem(`estadoJogo_${dataHoje}`);
}
