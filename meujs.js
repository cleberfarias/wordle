/**
 * captura de letras do teclado
 * selecionar a letra no quadrado
 * 
 * 
 * 
 */

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


