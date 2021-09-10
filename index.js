//Instancias para poder manipular el DOM

const contenedor=document.querySelector(".text-container")
const instruction= document.querySelector(".text");
const img=document.querySelector("#start")
const divInstructions= document.querySelector(".instructions-container");
const divGameBoard= document.querySelector(".gameBoard");
let reiniciar
const audio = new Audio("/music/opening.mp3");
const audioLost = new Audio("/music/evil-morty-lost.mp3");
const audioWin = new Audio("/music/warriors.mp3");
const audioShot = new Audio("/music/lasershot.mp3");

let keys={}


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
     this.img.src="/imagenes/picklerick-canon.png";

 }
 //Metodos de  RICK
 
 draw(){
     //Para pintarlo 
     //que empice en la posicion que le vamos a indicar y que termine con el ancho y largo que queremos
     ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
 }
 //Movimiento

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
//Clase de ratas
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
//Clase del laser
class laser{
    constructor(x,y){
        this.x = x
        this.y=y
        this.width=20;
        this.height=2;
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
checkKeys();
rickGanar.draw();
disparo();
updateObstacles();
checkScore();
checkGolpe() ;
checkGolpeRick()
checkLife();
checkGameOver();
checkWin();

}
//Creacion de Obstaculos
const myObstacles=[];

function updateObstacles(){
//COndicion para aumentar la velocidad respecto al score
let velocidad=3
let spawn=70
if(score>5 && score<21){
velocidad=5
spawn=70
}
if(score>20 && score<30){
  velocidad=5
  spawn=50
}
if(score>29 && score<50){
  velocidad=5
  spawn=5
}
  
  

//Ciclo para pintar a cada uno de los obstaculos creados
    for(let i=0;i<myObstacles.length;i++){
//Restamos en X para que simulen que se estan desplazando  de derecha a izquierda
//Velocidad de las ratas
        myObstacles[i].x-=velocidad//5
        myObstacles[i].draw()
        //COndicion que va eliminado las ratas del arreglo cuando salen del canvas
        if(myObstacles[i].x<0){
          //SI las ratas  atraviesan va restando vidas.
          vidas--
         // console.log("estas son las vidas",vidas)
            myObstacles.splice(i,1)
        }
    }
    //console.log(myObstacles)
//VAmos aumentando los frames en 1
frames+=1;
//CONDICION QUE AUMENTA LA POSICION DEL PICKLE DEL CAMINO
if(frames%4==0){//7
  rickGanar.x++
}

//Cada 120 frames entraremos a la condicion de crear un obstaculo random
    if(frames%spawn==0){//60
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
            disparos[i].x+=10
            disparos[i].draw()
            //Limpia los disparos si sobrepasan el canvas 

            if(disparos[i].x>1000){
                disparos.splice(i,1)
            }
            }
            //console.log(disparos)

            if(space==true && frames%10==0){

              //setTimeout(pushearLaser,1000);
              playAudioShot();
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
   // console.log("crashed", crashed)
    if(crashed) {
        myObstacles.splice()
       // console.log('pego la bala')
       //clearInterval(gameInterval)
    }
  
  }
}
  let lifePoints=1
  function checkGolpeRick(){
    const rickGolpe=myObstacles.some((obstacle)=>{
      return player.crashWith(obstacle)
    })

    if(rickGolpe){
      lifePoints++
      //console.log(lifePoints)

    }
    if(lifePoints%50==0){
      vidas--
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
    ctx.fillStyle= 'RED';
    ctx.fillText(`Killed Rats: ${score}`,800,25)
}
//GAME OVER
function checkGameOver(){
  if(vidas==0){
    clearInterval(gameInterval)
    clearCanvas();
    rickCry();
    
    setTimeout(lost,5000)
   playAudioLost()
  
    //lost();
  }
}
 //DESPUES DE PERDER.

 function lost(){
   removeRickCry()
  boardLost.drawNoMove();
  fraseLost();
  reStart();//aghregado
  //Permite darle click y al boton de reset
  setResetDOM();
}
//Funcion para la frase de perder
function fraseLost(){
  ctx.font='40px ZCOOL KuaiLe';
  ctx.fillStyle= 'white';
  ctx.fillText(`Really Morty?`,50,200)
  ctx.fillText(`even in a game you can't win?`,50,250)
}
//GANAR
function checkWin(){
  if(rickGanar.x>730){
    //para el tiempo o el motor del juego 
    clearInterval(gameInterval)
    //limpia el canvas
    clearCanvas();
    //pone la secunecia de rick saliendo
    RickOut();
    //reproduce el audio
    playAudioWin()
    //Tieempo que deja la secuencia reproduciendo 
    setTimeout(win,8400)
  
  }
}

function win(){
  //Remueve la secunecia del final
  removeRick()
//Imagen de ganaste
boardWin.drawNoMove()
//Crea la frase de ganaste y el score
fraseWin()
//Crea en boton de Reinicio
reStart();
//LAS FUNCIONES PARA PODER DARLE CLICK
setResetDOM();

}

function fraseWin(){

  ctx.font='40px ZCOOL KuaiLe';
  ctx.fillStyle= 'RED';
  ctx.fillText(`YOU WIN`,430,50)
  ctx.fillText(`Killed Rats: ${score}`,350,560)
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
spacebar();
//reStart(); //DESCOMENTAR
//setResetDOM();
//reiniciar=document.querySelector(".reset"); // DESCOMENTAR
//intervalo que revisa si el boton ya fue presionado
//resetInterval=setInterval(resetGame,1000/60) //DESCOMENTAR
}
function setResetDOM(){
  reiniciar=document.querySelector(".reset"); 
resetInterval=setInterval(resetGame,1000/60)
}
//Secuencia cuando ganass
function RickOut(){
  const rickWin= document.createElement("IMG")
  rickWin.setAttribute("src","/imagenes/rick-sale.gif")
  rickWin.setAttribute("width","1000");
  rickWin.setAttribute("height","600");
  rickWin.setAttribute("class","rickWin");
  divGameBoard.insertBefore(rickWin,divGameBoard.firstChild)
}
//Secuencia cuando pierdes
function rickCry(){
  const rickllorando= document.createElement("IMG")
  rickllorando.setAttribute("src","/imagenes/lose.gif")
  rickllorando.setAttribute("width","1000");
  rickllorando.setAttribute("height","600");
  rickllorando.setAttribute("class","rickllorando");
  divGameBoard.insertBefore(rickllorando,divGameBoard.firstChild)
}


////remueve el elemento de la secuencia
function removeRick(){
  const removeRick=document.querySelector(".rickWin")
  removeRick.remove()
}


function removeRickCry(){
  const removeRickllorando=document.querySelector('.rickllorando');
  removeRickllorando.remove()
}

function arrowKeys(){
  const flechas= document.createElement("IMG")
  flechas.setAttribute("src","/imagenes/keys.png")
  flechas.setAttribute("width","180");
  flechas.setAttribute("height","150");
  flechas.setAttribute("class","flechas");
  divInstructions.appendChild(flechas)
}
function spacebar(){
  const spaceBar= document.createElement("IMG")
  spaceBar.setAttribute("src","/imagenes/spacebar.png")
  spaceBar.setAttribute("width","180");
  spaceBar.setAttribute("height","150");
  spaceBar.setAttribute("class","spaceBar");
  divInstructions.appendChild(spaceBar)
}
function reStart(){
  const reset= document.createElement("IMG")
  reset.setAttribute("src","/imagenes/restarttt.png")
  reset.setAttribute("width","100");
  reset.setAttribute("height","100");
  reset.setAttribute("class","reset");
  divInstructions.appendChild(reset)
  
}
//Limpiar arregglos
function resetArr(arr){
  
  for(let i =0; i<arr.length;i++)
  //preveniendo que sean muchos objetos en el array que hay que limpiar
  arr.splice(i,100)
 // console.log("limpiando array")

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
setTimeout(playAudio,1000)

function playAudio(){
  audio.play()
  audio.volume=0.1
  
}

function playAudioLost(){
  audio.pause();
audioLost.play();
audioLost.currentTime=35;
audioLost.volume=0.1;

}
function playAudioWin(){
  audio.pause();
audioWin.play();
audioWin.currentTime=3;
audioWin.volume=0.1;

}

function playAudioShot(){
  audioShot.play()
  audioShot.currentTime=1
  audioShot.volume=0.4
}
function startGame(){
 
  //  if (gameOn==true)
   // {
gameInterval=setInterval(updateGame,1000/60)
   // }
}
//EVENTOS DEL JUGADOR
function resetGame(){
  reiniciar.onclick=()=>{
    //paramos auido
    audioWin.pause()
    audioLost.pause()
    //Paramos el motor del juego
    clearInterval(gameInterval)
  
    //limpiamos los arreglos
      resetArr(myObstacles)
      resetArr(disparos)
      resetArr(lifeArr)
    //seteamos vidas
    setLifes();
    vidas=3;
    //seteamos los lifePoints
    lifePoints=1;
    //Regresamos el Rick al inicio
    player.x=50
    player.y=300
    rickGanar.x=300
    //seteamos el score
    score=0;
    startGame()
    console.log("reiniciando")
    reiniciar.remove();
  }
}

//VARIANTE DE KEYS

function checkKeys(){
  /*
if(keys[38]==true){
  player.speedY-=5;
}
if(keys[39]){
  player.speedX+=5;
}
if(keys[37]){
  player.speedX-=5
}
if(keys[40]){
  player.speedY+=5;
}
if(keys[32]){
  space=true;
}
*/

}


document.addEventListener("keydown",(e)=>{
    e.preventDefault()
/**/
    switch(e.keyCode){
    case 39:
      player.speedX+=5;
      break;
    case 37:
      player.speedX-=5
      break;

    case 38:
      player.speedY-=5;
      break
    case 40:
      player.speedY+=5;
      break;
    case 32:
        space=true;
    break    ;
  
  
    }
    
   keys[e.keyCode]==true;
  
  })

  document.addEventListener("keyup",(e)=>{
    keys[e.keyCode]==false;
    player.speedX=0;
    player.speedY=0;
    space=false;
  })
  
 