//La etiqueta que vamos a utiliazar para referirnos al canvas
const $canvas = document.querySelector("canvas");
//indicamos que dibujaremos en 2D
const ctx= $canvas.getContext("2d");


//1.Clases del Juego

class Board{
constructor(){
    //Determinar posiciones iniciales en X , Y
    this.x=0;
    this.y=0;
    //Determinar las posiciones finales, en este caso el ancho y largo total del canvas
    this.width=$canvas.width;
    this.height=$canvas.height;
    this.img = new Image();
    this.img.src="/imagenes/campamento-Rick.jpeg"
}

//Metodo para pintar

draw(){
    if (this.x< -$canvas.width) this.x=0
    this.x--
//Pintamos la imagen, determinamos que imagen es, luego ponemos su posicion inciial en x,y y despues donde queremos que termine en este caso todo el ancho y largo del canvas por que quermeos que ocupe todo el espacio  
ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
//La imagen se mueve
ctx.drawImage(
    this.img,
    this.x+$canvas.width,
    this.y,
    this.width,
    this.height
    );
    }

}



//Instancia

const board=new Board();

//Motor del juego

function updateGame(){
clearCanvas()
board.draw()
}
// Funciones auxiliares
function clearCanvas(){
    ctx.clearRect(0,0,$canvas.width,$canvas.height)
}

//Cada vez que carge la pagina, va traer el elemento star y cuando se le haga click va ejecutar startGame
window.onload= () =>{
    document.getElementById('start').onclick=()=>{
        startGame();
    }
}

function startGame(){
gameInterval=setInterval(updateGame,1000/60)
}
