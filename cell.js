

function cell(c, l){
    this.ligne = l;
    this.colonne = c;
    this.valeur = false; // false = blanc, true = noir
    this.nombre = l*colonnes + c + 1;
    this.valeur_initiale = this.valeur;
    this.clic = 0;
}


cell.prototype.afficher = function(){
    stroke(0);
    strokeWeight(0.5);
    rectMode(CENTER);
    stroke(0);
    if(this.valeur){
        // true = gris / blanc
        fill(128);
    } else {
        // false = noir
        fill(255);
    }
    rect(this.colonne*taille + taille/2, this.ligne*taille + taille/2, taille*1, taille*1);
    textSize(taille*0.25);
    textAlign(CENTER);
    fill(0);
    text(this.nombre, this.colonne*taille + taille/2, this.ligne*taille + taille/2);
    if(this.clic %2 != 0){
        noStroke();
        fill(0);
        ellipse(this.colonne*taille + taille/10 + taille/10, this.ligne*taille + taille/10, taille/10, taille/10)
    }
}


cell.prototype.afficher_initiale = function(){
    stroke(0);
    strokeWeight(0.5);
    rectMode(CENTER);
    stroke(0);
    if(this.valeur_initiale){
        // true = gris / blanc
        fill(128);
    } else {
        // false = noir
        fill(255);
    }
    rect(this.colonne*taille + taille/2, this.ligne*taille + taille/2, taille*1, taille*1);
    textSize(taille*0.25);
    textAlign(CENTER);
    fill(0);
    text(this.nombre, this.colonne*taille + taille/2, this.ligne*taille + taille/2);
}



// retourne la case courante et les cases adjacentes
cell.prototype.get_cases = function (ar){
    let tab = [];
    tab.push(this);
    if(this.colonne > 0){
        tab.push(ar[this.colonne-1][this.ligne]);
    }
    if(this.colonne + 1 < colonnes){
        tab.push(ar[this.colonne+1][this.ligne]);
    }
    if(this.ligne > 0){
        tab.push(ar[this.colonne][this.ligne-1]);
    }
    if(this.ligne + 1 < lignes){
        tab.push(ar[this.colonne][this.ligne+1]);
    }
    return tab;
}
