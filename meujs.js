// /**
//  * captura de letras do teclado
//  * gerar uma palavra por dia
//  * selecionar a letra no quadrado
//  * colocar logica para descobrir a letra clicando no quadrado
//  * implementar logica com as cores
//  * implementar logica de cores no teclado
//  */

const palavras = {
  20250521: "MANGA",
  20250522: "LENTE",
  20250523: "NUVEM",
  20250524: "TIGRE",
  20250525: "PIANO",
  20250526: "FESTA",
  20250527: "BOLHA",
};

// Gera a palavra do dia
const hoje = new Date();
const yyyy = hoje.getFullYear();
const mm = String(hoje.getMonth() + 1).padStart(2, "0");
const dd = String(hoje.getDate()).padStart(2, "0");
const dataHoje = `${yyyy}${mm}${dd}`;
const palavraSecreta = palavras[dataHoje];

// Seleciona elementos
const botoesTeclado = document.querySelectorAll(".letras, .ctrl");
const linhas = document.querySelectorAll(".linha");

let tentativaAtual = 0;
let posicaoAtual = 0;
const maxTentativas = 6;
const tamanhoPalavra = 5;

// Atualiza a linha ativa visualmente
function atualizarLinhaAtual() {
  linhas.forEach((linha, index) => {
    linha.classList.toggle("linha-atual", index === tentativaAtual);
  });
}
atualizarLinhaAtual();

// Exibe aviso flutuante na tela
function mostrarAviso(mensagem) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = mensagem;
  aviso.classList.add("mostrar");

  setTimeout(() => {
    aviso.classList.remove("mostrar");
  }, 2000);
}

// Lógica principal de captura e resposta da letra
function capturaLetra(tecla) {
  const linha = linhas[tentativaAtual];
  const quadrados = linha.querySelectorAll(".Quadrado");

  if (tecla === "ENTER") {
    // Se ainda não completou a palavra
    if (posicaoAtual < tamanhoPalavra) {
      const linhaAtual = document.querySelector(".linha-atual");
      if (linhaAtual) {
        linhaAtual.classList.add("shake");
        linhaAtual.addEventListener("animationend", () => {
          linhaAtual.classList.remove("shake");
        }, { once: true });
      }
      return;
    }

    // Montar a palavra digitada
    let palavraDigitada = "";
    for (let i = 0; i < tamanhoPalavra; i++) {
      palavraDigitada += quadrados[i].textContent;
    }

    // --- Aqui você pode reativar a validação por dicionário ou lista ---
    // if (!Object.values(palavras).includes(palavraDigitada)) {
    //   mostrarAviso("⚠️ Palavra não existe no jogo!");
    //   const linhaAtual = document.querySelector(".linha-atual");
    //   if (linhaAtual) {
    //     linhaAtual.classList.add("shake");
    //     linhaAtual.addEventListener("animationend", () => {
    //       linhaAtual.classList.remove("shake");
    //     }, { once: true });
    //   }
    //   return;
    // }

    // Verificação de letras e aplicação de cores
    const usada = Array(tamanhoPalavra).fill(false);
    const cores = Array(tamanhoPalavra).fill("cinza");
    const statusLetras = {};

    // Primeira passada: letras certas no lugar certo (verde)
    for (let i = 0; i < palavraSecreta.length; i++) {
      const letra = palavraDigitada[i];
      if (letra === palavraSecreta[i]) {
        cores[i] = "verde";
        usada[i] = true;
        statusLetras[letra] = "verde";
      }
    }

    // Segunda passada: letras certas no lugar errado (amarelo)
    for (let i = 0; i < palavraSecreta.length; i++) {
      const letra = palavraDigitada[i];
      if (letra !== palavraSecreta[i]) {
        const posicaoNaSecreta = palavraSecreta.indexOf(letra);
        if (posicaoNaSecreta !== -1 && !usada[posicaoNaSecreta]) {
          cores[i] = "amarelo";
          usada[posicaoNaSecreta] = true;
          if (statusLetras[letra] !== "verde") {
            statusLetras[letra] = "amarelo";
          }
        } else {
          if (!statusLetras[letra]) {
            statusLetras[letra] = "cinza";
          }
        }
      }
    }

    // Aplicar as cores nos quadrados
    for (let i = 0; i < tamanhoPalavra; i++) {
      quadrados[i].classList.add(cores[i]);
      pintarTeclado(statusLetras);
    }

    // Verifica se acertou
    if (palavraDigitada === palavraSecreta) {
      setTimeout(() => {
        alert(`✅ Você acertou! A palavra era ${palavraSecreta}.`);
      }, 300);
      return;
    }

    // Avança para próxima linha
    tentativaAtual++;
    atualizarLinhaAtual();
    posicaoAtual = 0;

    if (tentativaAtual >= maxTentativas) {
      setTimeout(() => {
        alert(`💀 Fim de jogo. A palavra era ${palavraSecreta}.`);
      }, 300);
    }

    return;
  }

  // BACKSPACE
  if (tecla === "BACKSPACE") {
    if (posicaoAtual > 0) {
      posicaoAtual--;
      quadrados[posicaoAtual].textContent = "";
    }
    return;
  }

  // Digitação de letra normal
  if (
    tecla.length === 1 &&
    tecla.match(/[A-Z]/) &&
    posicaoAtual < tamanhoPalavra
  ) {
    quadrados[posicaoAtual].textContent = tecla;
    posicaoAtual++;
  }

  // Atualiza as cores do teclado
  function pintarTeclado(statusLetras) {
    const botoes = document.querySelectorAll(".letras");

    botoes.forEach((botao) => {
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

  console.log(`Tecla clicada: ${tecla}`);
}

// Teclado físico
document.addEventListener("keydown", function (e) {
  const teclado = e.key.toUpperCase().trim();
  capturaLetra(teclado);
  console.log("tecla precionada", teclado);
});

// Teclado virtual
botoesTeclado.forEach(function (botao) {
  botao.addEventListener("click", function () {
    let tecla = botao.textContent.trim();
    if (botao.classList.contains("backspace")) {
      tecla = "backspace";
    }

    capturaLetra(tecla.toUpperCase());
  });
});
