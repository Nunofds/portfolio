window.onload = function(){
    //DECLARATION DES VARIABLES
    var canvasWidht = 900;
    var canvasHeight = 600;
    var blockSize = 25;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widhtInBlocks = canvasWidht/blockSize;
    var heigtInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;
    
    init(); //DEMARRE LA FUNCTION init()
    function init(){    // DECLARATION FUNCTION init()
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidht;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid #cdd4d6";
        canvas.style.margin = "50px auto";    //CSS
        canvas.style.display = "block";    //CSS
        canvas.style.backgroundColor = "#303030";    //CSS
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        snakee = new Snake([[6,4], [5,4], [4,4][3,4]], "right");  //dessin snakee en debut du jeu
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    //REFRAICHIR CANVAS (function init())
    function refreshCanvas(){
        snakee.advance();   // executer la methode "advance"
        if(snakee.checkCollission()){
           gameOver();
        }
        else{
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;
                do{
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee));
                if(score % 5 == 0){
                   speedUp();
                   }
            }
            ctx.clearRect(0,0, canvasWidht, canvasHeight);  //dessine sur le canvas le rectangle
            drawScore();        //dessine le score a l'écran
            snakee.draw();      // executer la methode "draw" pour le serpent
            applee.draw();      // executer la methode "draw" pour la pomme
            timeout = setTimeout(refreshCanvas,delay);
        }
    }
    //SPEED SNAKE APRES AVOIR MANGER 5 POMMES
    function speedUp(){
        delay = delay / 2;
    }
    //GAME OVER
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "midle";
        ctx.strokeStyle = "#ffa500";
        ctx.lineWidth = 5;
        var centreX = canvasWidht / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY -100);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY -100);
        ctx.restore();
    }
    //RESTART
    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4][3,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        delay = 100;
        clearTimeout(timeout);
        refreshCanvas();
    }
    //SCORE
    function drawScore(){
        ctx.save();     //sauvegarde comme il été avant
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "#3ad1ec";
        ctx.textAlign = "center";
        var centreX = canvasWidht / 2;
        var centreY = canvasHeight - 10;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();      //reprend les parametres du debut
    }
    //DESSINER BLOCK SUR CANVAS (serpent)
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x , y , blockSize , blockSize);
    }
    //CONSTRUTION CORPS SERPENT
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){     //methode pour dessiner le corps du serpent dans le canvas (écran)
            ctx.save(); 
            ctx.fillStyle = "#33cc33";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function(){      //methode pour faire avancer le serpent
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -=1;
                    break;
                case "right":
                    nextPosition[0] +=1;
                    break;
                case "down":
                    nextPosition[1] +=1;
                    break;
                case "up":
                    nextPosition[1] -=1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);    // nouvelle position de la tête du serpent avec un deplacement de 1 ex:[[7,4], [6,4], [5,4], [4,4]]
            if(!this.ateApple){
                this.body.pop();
            }
            else{
                this.ateApple = false;
            }
            this.setDirection = function(newDirection){     //direction du serpent 
                var allowedDirections;
                switch(this.direction){
                    case "left":
                    case "right":
                        allowedDirections = ['up', "down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ['left', "right"];
                        break;
                    default:
                        throw("Invalid Direction");
                }
                if(allowedDirections.indexOf(newDirection) > -1){
                    this.direction = newDirection;
                }
            }
        };
        this.checkCollission = function(){   //méthode pour vérifier collissions du serpent (mur,corps)
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widhtInBlocks -1;
            var maxY = heigtInBlocks -1;
            var isNotBeteweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBeteweenVerticalWalls = snakeY < minY || snakeY > maxY;
                
            if(isNotBeteweenHorizontalWalls || isNotBeteweenVerticalWalls){
                wallCollision = true;
            }
            for (var i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleeToEat){     //methode pour savoir si serpent a mangé la pomme
            var head = this.body[0];
            if(head[0] === appleeToEat.position[0] && head[1] === appleeToEat.position[1]){
               return true;
            }
            else{
                return false;
            }
        }
    };
    //POMME
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widhtInBlocks -1));
            var newY = Math.round(Math.random() * (heigtInBlocks -1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            for(var i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                  isOnSnake = true;
                }
                return isOnSnake;
            }
        };
    };
    //DONNER UNE DIRECTION AU SERPENT SELON LES TOUCHES CLAVIER (utilisateur)
    document.onkeydown = function handleKeydown(e){
            var key = e.keyCode;
            var newDirection;
            switch(key){
                case 37:
                    newDirection = "left";
                    break;
                case 38:
                    newDirection = "up";
                    break;
                case 39:
                    newDirection = "right";
                    break;
                case 40:
                    newDirection = "down";
                    break;
                case 32:
                    restart();
                    return;
                default:
                    return;
            }
            snakee.setDirection(newDirection);
    }; 
};
    

