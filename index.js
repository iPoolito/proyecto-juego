//La etiqueta que vamos a utiliazar para referirnos al canvas
const $canvas = document.querySelector("canvas");
//indicamos que dibujaremos en 2D
const ctx= $canvas.getContext("2d");
let frames=0
let gameOn=false;
let space=false;
let vidas=3;
//1.Clases del Juego tablero, jugador, Obstaculos.

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
//Clase de RICK

class Rick{
 constructor(x,y){
     //Esta seccion va servir como referencia a la posicion
     //donde queremos que se encuentre y el tamano al momento de pintarlo

     this.x = x;
     this.y =y;
     this.width=70;
     this.height=90;
     //Darle movimiento
     this.speedX=0;
     this.speedY=0;
     this.img=new Image();
     this.img.src="/imagenes/picklerick-canonpng";

 }
 //Metodos de  RICK
 
 draw(){
     //Para pintarlo 
     //que empice en la posicion que le vamos a indicar y que termine con el ancho y largo que queremos
     ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
 }
 //Movimietno, unicamente arriba o abajo

 moveUp(){
     return this.y
 }

 moveDown(){
     return this.y+this.height
 }
 moveLeft(){
    return this.x
 }
 moveRight(){
     return this.x+this.width
 }
 newPos(){
     this.x+=this.speedX
     this.y+=this.speedY
     
 }
 //Condiciones para no salir del area del juego
outBoard(){
    if(this.y<0){
        this.y=600;
    }
    if(this.y>600){
        this.y=0;
    }
    if(this.x<0){
        this.x=0;
    }
    if(this.x>350){
        this.x=350;
    }
}
//Delimitar el area de rick
left() {
    return this.x
  }
  
  right() {
    return this.x + this.width
  }
  
  top() {
    return this.y
  }
  
  bottom() {
    return this.y + this.height 
  }
  

crashWith(obstacle) {

    // SI CUMPLE CUALQUIERA CON ESTAS CONDICIONES, ENTONCES, CHOCAMOS
    return !(
        this.bottom() < obstacle.top() ||
        this.top() > obstacle.bottom() || // CHOQUE CON LA PARTE SUPERIOR DEL LASER ROJO HACIA LA PARTE INFERIOR DE LA RATA
        this.right() < obstacle.left() || // CHOQUE CON LA PARTE LATERAL DERECHA DE MI LASER ROJO HACIA EL LATERAL IZQUIERDO DE LA RATA
        this.left() > obstacle.right() // CHOQUE CON LA PARTE LATERAL IZQUIERDA DE MI LASER ROJO HACIA EL LATERAL DERECHO DE  LA RATA
    )
  }
  

}
class Rats{
    constructor(x,y){
        this.x = x
        this.y=y
        this.width=70;
        this.height=90;
        this.img=new Image();
     this.img.src="/imagenes/ratita.png";
    }
draw(){
    ctx.drawImage(this.img,this.x,this.y,this.width,this.height);

}

//Delimitar el area del obstaculo
left() {
    return this.x
  }
  
  right() {
    return this.x + this.width
  }
  
  top() {
    return this.y
  }
  
  bottom() {
    return this.y + this.height 
  }
  

}

class laser{
    constructor(x,y){
        this.x = x
        this.y=y
        this.width=70;
        this.height=40;
        this.img=new Image();
     this.img.src="/imagenes/laser.png";
    }
draw(){
    ctx.drawImage(this.img,this.x,this.y,this.width,this.height);

}
left() {
    return this.x
  }
  
  right() {
    return this.x + this.width
  }
  
  top() {
    return this.y
  }
  
  bottom() {
    return this.y + this.height 
  }
  crashWith(obstacle) {

    // SI CUMPLE CUALQUIERA CON ESTAS CONDICIONES, ENTONCES, CHOCAMOS
    return !(
        this.bottom() < obstacle.top() ||
        this.top() > obstacle.bottom() || // CHOQUE CON LA PARTE SUPERIOR DEL LASER ROJO HACIA LA PARTE INFERIOR DE LA RATA
        this.right() < obstacle.left() || // CHOQUE CON LA PARTE LATERAL DERECHA DE MI LASER ROJO HACIA EL LATERAL IZQUIERDO DE LA RATA
        this.left() > obstacle.right() // CHOQUE CON LA PARTE LATERAL IZQUIERDA DE MI LASER ROJO HACIA EL LATERAL DERECHO DE  LA RATA
    )
  }
  
  
}



//Instancia

const board=new Board();
const player=new Rick(50,300);

//Motor del juego

function updateGame(){
  //  gameOn=false;
clearCanvas();
board.draw();
player.newPos();
player.outBoard();
player.draw();
disparo();
updateObstacles();
checkGolpe() 

}
//Creacion de Obstaculos
const myObstacles=[];

function updateObstacles(){
//Ciclo para pintar a cada uno de los obstaculos creados
    for(let i=0;i<myObstacles.length;i++){
//Restamos en X para que simulen que se estan desplazando  de derecha a izquierda
        myObstacles[i].x-=1
        myObstacles[i].draw()
    }
//VAmos aumentando los frames en 1
frames+=1;
//Cada 120 frames entraremos a la condicion de crear un obstaculo random
if(frames%200==0){
//ancho y largo del canvas
    let minHeight=0;
    let maxHeight=600;
    let height= Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

    myObstacles.push(new Rats(1000,height));

}
}

const disparos=[];
//Creacion del laser
function disparo(){
    //console.log(space)
    for(let i=0;i<disparos.length;i++){
        //Restamos en X para que simulen que se estan desplazando  derecha a izquierda
            disparos[i].x+=1
            disparos[i].draw()
            }

            if(space==true){
                disparos.push(new laser(player.x+50,player.y))
            }
    
        
        space==false;
    
  
}
let crashed
//Verificar si pego el lazer
function checkGolpe () {
    // SI UNO DE LOS VALORES REGRESA CON TRUE, ENTONCES SE DEVUELVE TRUE. SI NINGUNO, ABSOLUTAMENTE NINGUNO, CUMPLE, ENTONCES DEVUELVE FALSE
    for(let i = 0; i<disparos.length;i++){
    crashed = myObstacles.some((obstacle) => {
        
            return disparos[i].crashWith(obstacle)
        
        
    })
}
   // console.log("crashed", crashed)
    if(crashed) {
        console.log('pego la bala')
       //clearInterval(gameInterval)
    }
  
  }
  

//como darle tiempo al laser?
function pushearLaser(){
    disparos.push(new laser(player.x+50,player.y))
}

// Funciones auxiliares
function clearCanvas(){
    ctx.clearRect(0,0,$canvas.width,$canvas.height)
}





//Cada vez que carge la pagina, va traer el elemento star y cuando se le haga click va ejecutar startGame
window.onload= () =>{
    document.getElementById('start').onclick=()=>{
        //gameOn=false;
        startGame();
    }
}

function startGame(){
    
  //  if (gameOn==true)
   // {
gameInterval=setInterval(updateGame,1000/60)
   // }
}
//EVENTOS DEL JUGADOR
document.addEventListener("keydown",(e)=>{

    switch(e.keyCode){
    case 39:
      player.speedX+=1;
      break;
    case 37:
      player.speedX-=1
      break;

    case 38:
      player.speedY-=1;
      break
    case 40:
      player.speedY+=1;
      break;
    case 81:
        space=true;
    break    ;
  
  
    }
    
  
  })

  document.addEventListener("keyup",(e)=>{
    player.speedX=0;
    player.speedY=0;
    space=false;
  })
  