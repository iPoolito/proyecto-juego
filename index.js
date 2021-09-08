//Instancias para poder manipular el DOM

const contenedor=document.querySelector(".text-container")
const instruction= document.querySelector(".text");
const img=document.querySelector("#start")
const divInstructions= document.querySelector(".instructions-container");
const divGameBoard= document.querySelector(".gameBoard");




//La etiqueta que vamos a utiliazar para referirnos al canvas
const $canvas = document.querySelector("#canvas");
//indicamos que dibujaremos en 2D
const ctx= $canvas.getContext("2d");
let frames=0
let gameOn=false;
let space=false;
let vidas=3;
let score=0;
//1.Clases del Juego tablero, jugador, Obstaculos.

class Board{
constructor(src){
    //Determinar posiciones iniciales en X , Y
    this.x=0;
    this.y=0;
    //Determinar las posiciones finales, en este caso el ancho y largo total del canvas
    this.width=$canvas.width;
    this.height=$canvas.height;
    this.img = new Image();
    this.img.src=src//"/imagenes/campamento-Rick.jpeg"
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
drawNoMove(){
  ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
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
    if(this.y<100){
        this.y=100;
        this.speedY=0
    }
    if(this.y>500){
        this.y=500;
        this.speedY=0
    }
    if(this.x<0){
        this.x=0;
    }
    if(this.x>900){
        this.x=900;
    }
}
//Delimitar el area de rick para cuando choque
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

class Vidas{
  
  constructor(x,y){
    this.x = x
    this.y=y
    this.width=70;
    this.height=90;
    this.img=new Image();
 this.img.src="/imagenes/vidasrick.png";
}
draw(){
ctx.drawImage(this.img,this.x,this.y,this.width,this.height);

}
}

class rickRoad{
  constructor(x,y,src){
      //Esta seccion va servir como referencia a la posicion
      //donde queremos que se encuentre y el tamano al momento de pintarlo
 
      this.x = x;
      this.y =y;
      this.width=40;
      this.height=40;
      //Darle movimiento
      this.speedX=0;
      this.speedY=0;
      this.img=new Image();
      this.img.src=src 
 
  }
  //Metodos de rick en top
  
  draw(){
      //Para pintarlo 
      //que empice en la posicion que le vamos a indicar y que termine con el ancho y largo que queremos
      ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
  }

}


//Clase del inicio y meta
class start{
  constructor(x,y,src){
      //Esta seccion va servir como referencia a la posicion
      //donde queremos que se encuentre y el tamano al momento de pintarlo
      this.x = x;
      this.y =y;
      this.width=80;
      this.height=80;
      this.img=new Image();
      this.img.src= src//"/imagenes/start.png";
 
  }
  draw(){
      //Para pintarlo 
      //que empice en la posicion que le vamos a indicar y que termine con el ancho y largo que queremos
      ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
  }

}




//Instancia

const board=new Board("/imagenes/campamento-Rick.jpeg");  //tablero
const player=new Rick(50,300); //el jugador
const rickGanar=new rickRoad(300,25,"/imagenes/Pickle_rick_transparent_edgetrimmed.png");//Rick moviendose arriba
const inicio=new start(250,10,"/imagenes/start.png");// START
const meta= new start(700,10,"/imagenes/bano.png");// END
const boardLost=new Board("/imagenes/perdiste morty.png");//PANTALLA DE PERDER
const boardWin=new Board("/imagenes/winImage.jpg");//PANTALLA DE GANAR


//Motor del juego

function updateGame(){
  //  gameOn=false;
clearCanvas();
board.draw();
player.newPos();
player.outBoard();
player.draw();
inicio.draw();
meta.draw();
rickGanar.draw();
disparo();
updateObstacles();
checkScore();
checkGolpe() ;
checkLife();
checkGameOver();
checkWin();

}
//Creacion de Obstaculos
const myObstacles=[];

function updateObstacles(){
//Ciclo para pintar a cada uno de los obstaculos creados
    for(let i=0;i<myObstacles.length;i++){
//Restamos en X para que simulen que se estan desplazando  de derecha a izquierda
        myObstacles[i].x-=1
        myObstacles[i].draw()
        //COndicion que va eliminado las ratas del arreglo cuando salen del canvas
        if(myObstacles[i].x<0){
          //SI las ratas  atraviesan va restando vidas.
          vidas--
          //console.log(vidas)
            myObstacles.splice(i,1)
        }
    }
    //console.log(myObstacles)
//VAmos aumentando los frames en 1
frames+=1;
if(frames%7==0){
  rickGanar.x++
}
//Cada 120 frames entraremos a la condicion de crear un obstaculo random
    if(frames%60==0){
//ancho y largo del canvas
    let minHeight=100;
    let maxHeight=500;
    let height= Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    //console.log(height)

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
            //Limpia los disparos si sobrepasan el canvas 

            if(disparos[i].x>1000){
                disparos.splice(i,1)
            }
            }
            //console.log(disparos)

            if(space==true){

              //setTimeout(pushearLaser,1000);
                disparos.push(new laser(player.x+50,player.y))
            
              }
    
        
        space==false;
    
  
}
let crashed
//Verificar si pego el lazer
function checkGolpe () {
    // iteramos en el arreglo de los disparos
    for(let i = 0; i<disparos.length;i++){
        //iteramos en el arreglo de las ratas
    for(let r=0;r<myObstacles.length;r++){
        //si un disparo ya choco con una rata
        if(disparos[i].crashWith(myObstacles[r])){
            //que splice laa rata y el disparo de su arreglo
            //Se aumenta en 1 el score al ir matando las ratas
            score++
            disparos.splice(i,1)
            myObstacles.splice(r,1)
        }
    }
}
   // console.log("crashed", crashed)
    if(crashed) {
        myObstacles.splice()
       // console.log('pego la bala')
       //clearInterval(gameInterval)
    }
  
  }
//Array donde colocamos el objeto de las vidas.
  const lifeArr=[];
  //SE pushean 3 vidas de inicio
function setLifes(){
        lifeArr.push(new Vidas(10,10))
        lifeArr.push(new Vidas(80,10))
        lifeArr.push(new Vidas(150,10))
}
 
  function checkLife(){
    //Se itera para poder pintar cada una de las vidas.
    for(let i =0 ; i<lifeArr.length;i++){
      lifeArr[i].draw()
    }
      //Si las vidas disminuyen se van sacando del arreglo los objetos.
        if(vidas==2){
          
          lifeArr.splice(2,1);
         
      }
        if(vidas==1){
          lifeArr.splice(1,1);
        
        }
        if(vidas==0){
          lifeArr.splice(0,1)
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


//SCORE
function checkScore(){
    ctx.font='18px ZCOOL KuaiLe';
    ctx.fillStyle= 'green';
    ctx.fillText(`Ratas eliminadas: ${score}`,800,25)
}
//GAME OVER
function checkGameOver(){
  if(vidas==0){
    clearInterval(gameInterval)
    clearCanvas();
    lost();
  }
}
 //DESPUES DE PERDER.

 function lost(){
  boardLost.drawNoMove();
  fraseLost();
}

function fraseLost(){
  ctx.font='40px ZCOOL KuaiLe';
  ctx.fillStyle= 'black';
  ctx.fillText(`Eres un inutil Morty`,50,200)
  ctx.fillText(`Ni si quiera un juego puedes ganar?`,50,250)
}
//GANAR
function checkWin(){
  if(rickGanar.x>730){
    clearInterval(gameInterval)
    clearCanvas();
  
    RickOut();
    setTimeout(win,8400)
    //win()
  }
}

function win(){
  removeRick()

boardWin.drawNoMove()
fraseWin()
}

function fraseWin(){

  ctx.font='40px ZCOOL KuaiLe';
  ctx.fillStyle= 'Green';
  ctx.fillText(`YOU WIN`,430,50)
  ctx.fillText(`Ratas eliminadas: ${score}`,300,560)
}
//Agregar la parte de las instrucciones y las arrowKeys!
function instrucciones(){
  instruction.innerHTML=`
  <p class="instructions"> Help picle rick get out of the drain  <br/>DONT LET THE RATS CROSS THE ROAD  <br/>
  
  `
  //INSTRUCCIONES DE MOVIMIENTO
  let movimiento=document.createElement("p")
  let text1=document.createTextNode("Use arrow keys for moving.");
  movimiento.appendChild(text1);
  divInstructions.appendChild(movimiento)
  //INSTRUCCIONDES DE DISPARO
  let disparo=document.createElement("p")
  let text2=document.createTextNode(" spacebar for shooting.");
  disparo.appendChild(text2);
  divInstructions.appendChild(disparo)
 img.remove()
arrowKeys();
//reStart(); DESCOMENTAR
//reiniciar=document.querySelector(".reset");
let reiniciar=document.querySelector(".reset");
}


function RickOut(){
  const rickWin= document.createElement("IMG")
  rickWin.setAttribute("src","/imagenes/rick-sale.gif")
  rickWin.setAttribute("width","1000");
  rickWin.setAttribute("height","600");
  rickWin.setAttribute("class","rickWin");
  divGameBoard.insertBefore(rickWin,divGameBoard.firstChild)
}
//Creacion del canvas
function removeRick(){
  const removeRick=document.querySelector(".rickWin")
  removeRick.remove()
}
function arrowKeys(){
  const flechas= document.createElement("IMG")
  flechas.setAttribute("src","/imagenes/keys.png")
  flechas.setAttribute("width","180");
  flechas.setAttribute("height","150");
  flechas.setAttribute("class","flechas");
  divInstructions.appendChild(flechas)
}
function reStart(){
  const reset= document.createElement("IMG")
  reset.setAttribute("src","/imagenes/restart.png")
  reset.setAttribute("width","180");
  reset.setAttribute("height","150");
  reset.setAttribute("class","reset");
  divInstructions.appendChild(reset)
  
}
//Cada vez que carge la pagina, va traer el elemento star y cuando se le haga click va ejecutar startGame
window.onload= () =>{
    document.getElementById('start').onclick=()=>{
        //gameOn=false;
        startGame();
        vidas=3;
        setLifes();
        instrucciones();
    }
   
}
/*
reiniciar.addEventListener('click',()=>{
  console.log('reiniciando')
})
*/

function startGame(){
    
  //  if (gameOn==true)
   // {
gameInterval=setInterval(updateGame,1000/60)
   // }
}
//EVENTOS DEL JUGADOR

document.addEventListener("keydown",(e)=>{
    e.preventDefault()

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
    case 32:
        space=true;
    break    ;
  
  
    }
    
  
  })

  document.addEventListener("keyup",(e)=>{
    player.speedX=0;
    player.speedY=0;
    space=false;
  })
  
 