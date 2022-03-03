const $canvas = document.querySelector('#canvas'),
    $reloadBtn = document.querySelector('.reloadBtn');

const ctx = $canvas.getContext('2d');
let score = 0;

//Reset game
$reloadBtn.addEventListener('click', ()=>{
    window.location.reload();
});

//Snake
const snake = {
    width: 30,
    height: 30,
    vx: 30,
    vy: 0,
    segments: [ 
        { //head
            x: 0,
            y: ($canvas.height / 2) - 30,
        }
    ],
    draw(x, y, color){
        //Background
        ctx.fillStyle = color;
        ctx.fillRect(
            x, 
            y, 
            this.width, 
            this.height
        );
        //Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.beginPath()
        ctx.rect(
            x, 
            y, 
            this.width, 
            this.height
        );
        ctx.stroke();
    },
    addSize(){
        this.segments.push(
            {
               x: this.segments[this.segments.length - 1].lastPosition.x,
               y: this.segments[this.segments.length - 1].lastPosition.y,
               lastPosition: {}
            }
        );
    }
};
//Snake food
const food = {
    width: 30,
    height: 30,
    x: 0,
    y: 0,
    positions: [60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390],
    draw(){
        ctx.fillStyle = '#DA2100';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
//Grid
function drawGrid(){
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    for(let i = 30; i < 450; i+= 30){
        //Columns
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, $canvas.height);
        ctx.stroke();
        //Rows
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo($canvas.width, i);
        ctx.stroke();
    };
};

function gameLoop(){
    let gameInterval = setInterval(()=>{
        //Clear canvas
        ctx.clearRect(0 , 0, $canvas.width, $canvas.height);
        drawGrid();
        food.draw();

        //Draw snake
        snake.segments.forEach((segment, index) =>{
            //Snake head
            if(index === 0){
                Object.assign(segment, {
                    lastPosition: {
                        x: segment.x,
                        y: segment.y
                    },
                    x: segment.x + snake.vx,
                    y: segment.y + snake.vy
                });
            //tail
            }else{
                Object.assign(segment, {
                    lastPosition: {
                        x: segment.x,
                        y: segment.y
                    },
                    //Assign the position of the previous segment
                    x: snake.segments[index - 1].lastPosition.x,
                    y: snake.segments[index - 1].lastPosition.y
                }); 
            }
            snake.draw(
                segment.x,
                segment.y,
                'rgba(144, 238, 144, 0.6)'
            );
        });
        //Draw Score
        ctx.fillStyle = '#000';
        ctx.font = "20px Arial";
        ctx.fillText(score, snake.segments[0].x + 7, snake.segments[0].y + 22);
        //Has eaten
        if(
            snake.segments[0].x === food.x &&
            snake.segments[0].y === food.y    
        ){
            pushFood();

            snake.addSize(); 
            score++;
        }
        //Collision
        if(hasCollided()){
            $reloadBtn.classList.add('active');
            clearInterval(gameInterval);
        }
    }, 350);
};

function hasCollided(){
    let hasCollidedWithSegment = snake.segments.some((segment, index) =>{
        if(
            index > 0 && 
            snake.segments[0].x === segment.x &&
            snake.segments[0].y === segment.y
        ) return true
    });

    if(
        (snake.segments[0].x + snake.width > $canvas.width ||
        snake.segments[0].x + snake.width < 0 ||
        snake.segments[0].y + snake.height > $canvas.height ||
        snake.segments[0].y < 0 ) || (hasCollidedWithSegment)
    ){
        return true
    }
    return false
};

function pushFood(){
    let pos = [0, 0].map(num =>{
        return food.positions[Math.ceil(
            Math.random() * food.positions.length - 1
        )];
    })
    Object.assign(food, {
       x: pos[0],
       y: pos[1]
    });
}
//Controls
document.addEventListener('keydown', (e)=>{
    switch(e.key){
        case 'ArrowUp':
            snake.vy = -30;
            snake.vx = 0;
            break;
        case 'ArrowRight':
            snake.vy = 0;
            snake.vx = 30;
            break;
        case 'ArrowDown':
            snake.vy = 30;
            snake.vx = 0;
            break;
        case 'ArrowLeft':
            snake.vy = 0;
            snake.vx = -30;
            break;
    };
});

document.addEventListener('DOMContentLoaded', ()=>{
    gameLoop();
    pushFood();
});
