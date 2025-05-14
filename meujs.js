// /**
//  * captura de letras do teclado
//  * gerar uma palavra por dia
//  * selecionar a letra no quadrado
//  * colocar logica para descobri a letra no clicando no quadrado
//  * implementar logica com as cores
//  * implementar logica de cores no teclado
//  */

const palavrasCincoLetras = [
  "FELIZ", "JOGAR", "LIVRO", "CAMPO", "PEDRA",
  "VENTO", "FOCAR", "LUZES", "MUNDO", "NORTE",
];

// Gera uma palavra do dia com base na data
function palavraPorDia() {
  const dataHoje = new Date();
  const dataBase = new Date("2023-01-01");
  const diasDesdeBase = Math.floor((dataHoje - dataBase) / (1000 * 60 * 60 * 24));
  const indice = (diasDesdeBase * 1234567) % palavrasCincoLetras.length;
  return palavrasCincoLetras[indice];
}

const palavraSecreta = palavraPorDia();
console.log("Palavra secreta do dia:", palavraSecreta);

// Seleciona elementos
const botoesTeclado = document.querySelectorAll(".letras, .ctrl");
const linhas = document.querySelectorAll(".linha");

let tentativaAtual = 0;
let posicaoAtual = 0;
const maxTentativas = 6;
const tamanhoPalavra = 5;

botoesTeclado.forEach(function (botao) {
  botao.addEventListener("click", function () {
    let tecla = botao.textContent.trim().toUpperCase();

    // Tratar o botão backspace ícone
    if (!tecla || (botao.classList.contains("ctrl") && tecla === "")) {
      tecla = "⌫";
    }

    const linha = linhas[tentativaAtual];
    const quadrados = linha.querySelectorAll(".Quadrado");

    // ENTER
    if (tecla === "ENTER") {
      if (posicaoAtual < tamanhoPalavra) {
        alert("Digite 5 letras antes de enviar.");
        return;
      }

      // Montar a palavra digitada
      let palavraDigitada = "";
      for (let i = 0; i < tamanhoPalavra; i++) {
        palavraDigitada += quadrados[i].textContent;
      }

      // Lógica de verificação de cores
      const usada = Array(tamanhoPalavra).fill(false);
      const cores = Array(tamanhoPalavra).fill("cinza");

      // Primeira passada: verde
      for (let i = 0; i < tamanhoPalavra; i++) {
        if (palavraDigitada[i] === palavraSecreta[i]) {
          cores[i] = "verde";
          usada[i] = true;
        }
      }

      // Segunda passada: amarelo
      for (let i = 0; i < tamanhoPalavra; i++) {
        if (cores[i] === "cinza") {
          for (let j = 0; j < tamanhoPalavra; j++) {
            if (!usada[j] && palavraDigitada[i] === palavraSecreta[j]) {
              cores[i] = "amarelo";
              usada[j] = true;
              break;
            }
          }
        }
      }

      // Aplicar as cores nos quadrados
      for (let i = 0; i < tamanhoPalavra; i++) {
        quadrados[i].classList.add(cores[i]);
      }

      // Verifica se acertou
      if (palavraDigitada === palavraSecreta) {
        setTimeout(() => alert(`✅ Você acertou! A palavra era ${palavraSecreta}.`), 300);
        return;
      }

      // Avança para a próxima tentativa
      tentativaAtual++;
      posicaoAtual = 0;

      if (tentativaAtual >= maxTentativas) {
        setTimeout(() => alert(`💀 Fim de jogo. A palavra era ${palavraSecreta}.`), 300);
      }

      return;
    }

    // BACKSPACE
    if (tecla === "⌫") {
      if (posicaoAtual > 0) {
        posicaoAtual--;
        quadrados[posicaoAtual].textContent = "";
      }
      return;
    }

    // Digita letra (limite de 5 por linha)
    if (tecla.length === 1 && tecla.match(/[A-Z]/) && posicaoAtual < tamanhoPalavra) {
      quadrados[posicaoAtual].textContent = tecla;
      posicaoAtual++;
    }

    console.log(`Tecla clicada: ${tecla}`);
  });
});
