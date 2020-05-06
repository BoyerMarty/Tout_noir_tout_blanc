

function cell(c, r){
    this.row = r;
    this.col = c;
    this.value = random(1) > 2; // false = white, true = black
    this.number = r*cols + c + 1;
    this.initial_value = this.value;
    this.clic_count = 0;
}


cell.prototype.show = function(){
    stroke(0);
    strokeWeight(0.5);
    
    rectMode(CENTER);
    
    stroke(0);
    if(this.value){
        // true
        fill(128);
    } else {
        // false
        fill(255);
    }
    
    rect(this.col*size + size/2, this.row*size + size/2, size*1, size*1);
    textSize(size*0.25);
    textAlign(CENTER);
    fill(0);
    text(this.number, this.col*size + size/2, this.row*size + size/2);
    
    for(let i = 0; i < this.clic_count; i ++){
        noStroke();
        fill(0);
        ellipse(this.col*size + i*size/10 + size/10, this.row*size + size/10, size/10, size/10)
    }
}


cell.prototype.show_initial = function(){
    stroke(0);
    strokeWeight(0.5);
    
    rectMode(CENTER);
    
    stroke(0);
    if(this.initial_value){
        // true
        fill(128);
    } else {
        // false
        fill(255);
    }
    
    
    
    rect(this.col*size + size/2, this.row*size + size/2, size*1, size*1);
    textSize(size*0.25);
    textAlign(CENTER);
    fill(0);
    text(this.number, this.col*size + size/2, this.row*size + size/2);
}



cell.prototype.change_value = function(ar){
    this.value = this.value == false;
    this.clic_count ++;
    this.clic_count %= 2;
    
    
    if(this.col > 0){
        ar[this.col-1][this.row].value = ar[this.col-1][this.row].value == 0;
    }
    if(this.col + 1 < cols){
        ar[this.col+1][this.row].value = ar[this.col+1][this.row].value == 0;
    }
    if(this.row > 0){
        ar[this.col][this.row-1].value = ar[this.col][this.row-1].value == 0;
    }
    if(this.row + 1 < rows){
        ar[this.col][this.row+1].value = ar[this.col][this.row+1].value == 0;
    }
}



cell.prototype.get_cases = function (ar){
    let n = [];
    n.push(this);
    if(this.col > 0){
        n.push(ar[this.col-1][this.row]);
    }
    if(this.col + 1 < cols){
        n.push(ar[this.col+1][this.row]);
    }
    if(this.row > 0){
        n.push(ar[this.col][this.row-1]);
    }
    if(this.row + 1 < rows){
        n.push(ar[this.col][this.row+1]);
    }
    return n;
}