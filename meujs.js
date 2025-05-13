// /**
//  * captura de letras do teclado
//  * gerar uma palavra por dia
//  * selecionar a letra no quadrado
//  * colocar logica para descobri a letra no clicando no quadrado
//  * implementar logica com as cores
//  *
//  */

const palavrasCincoLetras = [
  "FELIZ", "JOGAR", "LIVRO", "CAMPO", "PEDRA",
  "VENTO", "FOCAR", "LUZES", "MUNDO", "NORTE",
];
//gerar uma palavra por dia
function palavraPorDia() {
  const dataHoje = new Date();
  const dataBase = new Date("2023-01-01");
  const diasDesdeBase = Math.floor((dataHoje - dataBase) / (1000 * 60 * 60 * 24));
  const aleatorioBaseadoNaData = (diasDesdeBase * 1234567) % palavrasCincoLetras.length;
  return palavrasCincoLetras[aleatorioBaseadoNaData];
}
//selecionar a letra no quadrado
const palavraSecreta = palavraPorDia();
console.log("Palavra secreta do dia:", palavraSecreta);

const botoesTeclado = document.querySelectorAll(".letras, .ctrl");
const quadrado = document.querySelectorAll(".Quadrado");

let posicaoAtual = 0;
let tentativas = 6

botoesTeclado.forEach(function (botao) {
  botao.addEventListener("click", function () {
    let tecla = botao.textContent.trim();

    if (!tecla || (botao.classList.contains("ctrl") && botao.textContent.trim() === "")) {
      tecla = "⌫";
    }

    if (tecla === "ENTER") {
      if (posicaoAtual < palavraSecreta.length) {
        alert("Digite 5 letras antes de enviar.");
        return;
      }

      // Captura palavra digitada pelo usuário
      let palavraDigitada = "";
      for (let i = 0; i < palavraSecreta.length; i++) {
        palavraDigitada += quadrado[i].textContent;
      }

      if (palavraDigitada === palavraSecreta) {
        alert(`✅ Você acertou! A palavra é: ${palavraSecreta}`);
      } else {
        tentativas --;
        if(tentativas >0){
            alert(`❌ Você errou. Restam ${tentativas} `);
        }
        
      }

      return;
    }

    if (tecla === "⌫") {
      if (posicaoAtual > 0) {
        posicaoAtual--;
        quadrado[posicaoAtual].textContent = "";
      }
    } else {
      if (posicaoAtual < quadrado.length) {
        quadrado[posicaoAtual].textContent = tecla;
        posicaoAtual++;
      }
    }

    console.log(`Tecla clicada: ${tecla}`);
  });
});
