// /**
//  * captura de letras do teclado
//  * gerar uma palavra por dia
//  * selecionar a letra no quadrado
//  * 
//  * 
//  * 
//  */


const botoesTeclado = document.querySelectorAll('.letras, .ctrl')
const quadrado = document.querySelectorAll('.Quadrado')

const palavra = "FLOR";

let posicaoAtual = 0

botoesTeclado.forEach(function (botao){
    botao.addEventListener('click', function(){
        let tecla = botao.textContent.trim();

        if(!tecla || botao.classList.contains('ctrl') && botao.textContent.trim() === ""){
            tecla="⌫";
        }
        if (tecla === "ENTER") {
            
            console.log("Palavra enviada!");
            return;
        }

        if (tecla === "⌫"){
            if(posicaoAtual > 0){
                posicaoAtual --;
                quadrado[posicaoAtual].textContent ="";
            }
        }else{
            if(posicaoAtual<quadrado.length){
                quadrado[posicaoAtual].textContent =tecla;
                posicaoAtual++;
            }
        }
        console.log(`tecla clicada: ${tecla}`)
    })
})

//palavra secreta
const palavrasCincoLetras = [
  "FELIZ", "JOGAR", "LIVRO", "CAMPO", "PEDRA", "VENTO", "FOCAR", "LUZES", "MUNDO", "NORTE"
];

function palavraPorDia() {
  
  const dataHoje = new Date();
  const dataBase = new Date('2023-01-01'); 
  const diasDesdeBase = Math.floor((dataHoje - dataBase) / (1000 * 60 * 60 * 24));
  const aleatorioBaseadoNaData = (diasDesdeBase * 1234567) % palavrasCincoLetras.length;

  return palavrasCincoLetras[aleatorioBaseadoNaData];
}

console.log("Palavra do dia:", palavraPorDia());