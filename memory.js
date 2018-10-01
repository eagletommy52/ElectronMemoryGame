class MatchingGame {
    //picturematching game
    constructor(app) {
        //set up all the dom refs
        this.app = document.getElementById(app);
        this.scoreBox = document.getElementById('score-box');
        this.timerBox = document.getElementById('timer-box');
        this.playBtn = document.getElementById('playBtn');
        this.playBtn.addEventListener('click', this.setupGame.bind(this));
        this.msgBox = document.getElementById('msgBox');
        //Tile template for later cloning
        this.tileTemplate = document.createElement('div');
        this.tileTemplate.className = 'tile';
        this.tileTemplate.appendChild(document.createElement('img'));
        this.tileTemplate.firstChild.src = 'images/blank.png';
        this.tileTemplate.firstChild.className = 'tileImg';
        //set up variables to be used in the game
        this.numTiles;
        this.startTime;
        this.gameScore=1000;
        this.gameArr;
        this.lastItem;
        this.matches = 0;
        this.attempts = 0;
        this.picsArr = [
            'anchor',
            'apple',
            'barn',
            'baseball',
            'basketball-player',
            'boxer',
            'car',
            'cat',
            'cowboy-boot',
            'duck',
            'eagle',
            'golden-anchor',
            'grapes',
            'horse',
            'house',
            'jumping-horse',
            'jumping',
            'key',
            'keys',
            'lion',
            'monster-truck',
            'motorcycle',
            'pocket-watch',
            'scissors',
            'seahorse',
            'shoe',
            'stopwatch',
            'wagon-wheel',
            'wheel',
            'slamdunk'
          ];
        this.numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        this.realPicsArr = getWebPics(30)
    
        }
        setupGame(){
            this.numTiles = document.getElementById('diffSelect').value;
            //create instances of Match Tiles
            this.app.innerHTML = "";
            this.matches = 0;
            this.attempts = 0;
            this.lastItem = undefined;
            this.gameScore=1000;
            this.gameArr = this.numArr.slice(0,this.numTiles);
            //this.gameArr = this.picsArr.slice(0,this.numTiles);
            this.gameArr = [...this.gameArr, ...this.gameArr];
            this.gameArr.sort(()=>(0.5-Math.random()));
            //this.gameArr = this.gameArr.map(tileName=>new MatchTile(tileName, this.tileTemplate, this));
            this.gameArr = this.gameArr.map(tileName=>new MatchTile(tileName, this.tileTemplate, this, this.realPicsArr[tileName].src));
            this.gameArr.map(tile=>{this.app.appendChild(tile.imgDiv)})
            this.startCountdown(5);   
        }
        startCountdown(secs){
            this.msgBox.innerHTML = secs?`Starting Game in ${secs} seconds...`:'';
            secs == 0 ? this.startGame() : setTimeout(() => this.startCountdown(secs-1), 1000);
        }
        startGame(){
            //flip every tile on the game board
            this.gameArr.map(tile=>tile.tileListen());
            this.gameArr.map(tile=>tile.flip());
            this.startTime = Date.now();
            this.tickInterval = setInterval(this.tick.bind(this), 1000);
        }
        itemSelected(item){
            this.lastItem ? this.checkMatch(this.lastItem,item): this.lastItem=item;
        }
        checkMatch(item1, item2){
            this.attempts++;
            this.lastItem = undefined;
            if(item1.name == item2.name) {
                item1.isMatched = true;
                item2.isMatched = true;
                this.gameScore += 5000
                this.matches++;
                if(this.matches == this.numTiles) {
                    this.tick();
                    this.endGame();
                }
            } else { 
                this.gameScore -= 1000
                setTimeout(()=>{
                    item1.isSelected = false;
                    item2.isSelected = false;
                    item1.flip();
                    item2.flip();
                    return;
                },2000)   
            }
        }
        tick(){
            let elapsed = Date.now()-this.startTime;    
            this.timerBox.innerHTML = `${Math.floor(elapsed/1000/60)<10?'0'+Math.floor(elapsed/1000/60):Math.floor(elapsed/1000/60)}:${Math.floor(elapsed/1000%60)<10?'0'+Math.floor(elapsed/1000%60):Math.floor(elapsed/1000%60)}`;
            this.gameScore -= 100;
            this.scoreBox.innerHTML = `Attempts: &nbsp;${this.attempts} &nbsp;Matches: &nbsp;${this.matches} &nbsp;Average: &nbsp;${Math.round(this.matches/this.attempts*100)?Math.round(this.matches/this.attempts*100):0}% &nbsp;Score: &nbsp;${this.gameScore} &nbsp;`;
        }
        endGame(){
            this.msgBox.innerHTML = "All Tiles Matched -- Way to Go!";
            clearInterval(this.tickInterval);
        }
    }
    
class MatchTile {
    constructor(name,template, parent, imgSrc) {
        this.parent = parent;
        this.name = name;
        this.imgSrc = imgSrc || `images/${name}.jpg`;
        this.flipped = false;
        this.isMatched = false;
        this.isSelected = false;
        this.imgDiv = template.cloneNode(true);
        this.imgDiv.firstChild.src = this.imgSrc;
    }
    tileListen(){
        this.imgDiv.addEventListener('click', this.wasClicked.bind(this));
    }
    wasClicked(){
        if(!this.isMatched && !this.isSelected) {
            this.flip();
            this.isSelected = true;
            this.parent.itemSelected(this)
        }
    }
    flip(){
        this.flipped = !this.flipped;
        //Do swap image flipping based on flip logic.
        this.imgDiv.classList.add("flip-vertical-edge");
        setTimeout(()=>this.flipped?this.imgDiv.firstChild.src = 'images/blank.png': this.imgDiv.firstChild.src = this.imgSrc,100)
        setTimeout(()=>this.imgDiv.classList.remove('flip-vertical-edge'),200);
    }
}
function getWebPics(length) {
    let picArr = [];
    for(let i = 0; i<length; i++){
        let url= 'http://picsum.photos/65/65/?random';
        let picReq = new XMLHttpRequest();
        let image = document.createElement('img');
        picReq.open('GET', url);
        picReq.responseType = 'blob';
        picReq.onload = () => {
            image.src = window.URL.createObjectURL(picReq.response);
            picArr.push(image);
            if(i==(length-1)) {
                let playBtn = document.getElementById('playBtn');
                playBtn.style.opacity = '1.0';
                playBtn.disabled = false;
            }
            return;
        }
        picReq.send();
    }
    return picArr
}
    
    
    const memGame = new MatchingGame('app');
    