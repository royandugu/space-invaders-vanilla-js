//Constant declaration
const gridContainer=document.querySelector(".gridContainer");
const width=15;
const blastAudio=new Audio("Audio/blast.mp3");
const lazerAudio=new Audio("Audio/lazerShooting.mp3");
const scoreDisplayer=document.querySelector(".score");
const gameSound=document.querySelector("#gameSound");
const musicButton=document.querySelector(".buttonTrigger"); 
const scorePanel=document.querySelector(".scorePanel");
const scoreDisplay=document.querySelector(".scoreDisplay");
const stepDisplay=document.querySelector(".stepDisplay");


//Variable declartion
let aliens=[];
let takenDowns=[];
let element;
let i;
let j=-1;
let direction=1;
let shooterIndex=202;
let sfxOnButton=document.querySelector(".onRadio");
let sfxOffButton=document.querySelector(".offRadio");
let score=0;
let buttonClicked=false;
let step=0;


//Grid formation
for(i=0;i<225;i++){
    element=document.createElement("div");
    gridContainer.appendChild(element);
}   
const squares=document.querySelectorAll(".gridContainer div");


//Play music
musicButton.addEventListener("click",()=>{
    if(buttonClicked) {
        gameSound.pause();
        musicButton.textContent="Music on";
        buttonClicked=false;
    }
    else{
        gameSound.play();
        musicButton.textContent="Music off";
        buttonClicked=true;
    }
})


//Creating aliens
for(i=0;i<27;i++){
    if(j===8) j=width;
    else if(j===23) j=2*width;  
    else ++j;
    aliens.push(j);
}
aliens.forEach(index=>squares[index].classList.add("aliens"));


//Moving aliens
const moveInvaders=()=>{
    ++step;
    if(endChecker()) return;
    const leftEdge=aliens[0]%width===0;
    const rightEdge=aliens[aliens.length-1]%width===width-1;
    if((leftEdge && direction===-1) || (rightEdge && direction===1)) direction=width;
    else if(direction===width){
        if(rightEdge)direction=-1;
        else direction=1; 
    }
    aliens.forEach(index=>squares[index].classList.remove("aliens"));
    for(i=0;i<aliens.length;i++) aliens[i]+=direction;
    for(i=0;i<aliens.length;i++){
        if(!takenDowns.includes(i)) squares[aliens[i]].classList.add("aliens");
    }
    setTimeout(moveInvaders,1000);
}
setTimeout(moveInvaders,1000);


//Shooter setup 
squares[shooterIndex].classList.add("shooter");
const moveShooter=(e)=>{
    squares[shooterIndex].classList.remove("shooter");
    if(e.keyCode===37 && shooterIndex%width!=0) shooterIndex-=1;
    else if(e.keyCode===39 && shooterIndex%width!=width-1) shooterIndex +=1;
    squares[shooterIndex].classList.add("shooter");
}
document.addEventListener("keydown",moveShooter);


//Explosion setup
const boom=(targetElem)=>{
    if(sfxOnButton.checked) blastAudio.play();
    targetElem.classList.remove("aliens");
    targetElem.classList.add("boom");
    scoreUpdater();
    setTimeout(()=>targetElem.classList.remove("boom"),1000); 
}


//Score updater
const scoreUpdater=()=>{
    score++;
    scoreDisplayer.textContent=score;
}


//Lazer setup
const lazerShooter=(e)=>{
    let lazerPos=shooterIndex;
    if(e.keyCode===32){
        if(sfxOnButton.checked) lazerAudio.play();
        const lazerLimiter=()=>{
            squares[lazerPos].classList.remove("lazer");
            if(squares[lazerPos].classList.contains("aliens")){ 
                boom(squares[lazerPos]);
                squares[lazerPos].classList.remove("aliens");
                const deactiveAlien=aliens.indexOf(lazerPos);
                takenDowns.push(deactiveAlien);
                return; 
            }
            else if(lazerPos<width) return;
            else lazerPos=lazerPos-width;
            squares[lazerPos].classList.add("lazer");
            setTimeout(lazerLimiter,500);
        }
        lazerLimiter();
    }
}


//Check if the game has ended
const endChecker=()=>{
    if(takenDowns.length===aliens.length || alienReachDown()) {
        scorePanel.classList.add("comeDown");
        scoreDisplay.textContent=score;
        stepDisplay.textContent=step;
        return true;
    }
    else return false;
}


const alienReachDown=()=>{
    for(i=195;i<=209;i++){
        if(squares[i].classList.contains("aliens")) return true;
    }
    return false;
}


//Check if a div has both classes of aliens and lazer and then boom 
document.addEventListener("keypress",lazerShooter);
document.querySelector(".restartBtn").addEventListener("click",()=>window.location.reload());