



var array;  // array[x / col][y / row]
var colonnes = 5;
var lignes = 5;
var taille;


var bouton_resoudre;
var bouton_reset;
var bouton_generer_grille;
var checkbox_couleur;
var slider_taille_grille;



function setup() {
  createCanvas(400,400);
  taille = width / colonnes;
  background(51);
  array = make2DArray(colonnes, lignes);
  // pour chaque case
  for(let c = 0; c < array.length; c ++){
    for(let l = 0; l < array[c].length; l ++){
      // initialisation des cases
      array[c][l] = new cell(c,l);
    }
  }
  
  setup_DOM();
}







function draw() {
  background(51);
  // pour chaque case
  for(let c = 0; c < array.length; c ++){
    for(let l = 0; l < array[c].length; l ++){
      // affichage des cases
      array[c][l].afficher();
      //translate(0,taille*lignes + taille/2);
      //array[c][l].afficher_initiale();
      //translate(0,-(taille*lignes + taille/2));
    }
  }
  
  if(slider_taille_grille.value() != array.length){
    colonnes = slider_taille_grille.value();
    lignes = slider_taille_grille.value();
    taille = width / colonnes;
    array = make2DArray(colonnes, lignes);
    // pour chaque case
    for(let c = 0; c < array.length; c ++){
      for(let l = 0; l < array[c].length; l ++){
        // initialisation des cases
        array[c][l] = new cell(c,l);
      }
    }
  }
}





function make2DArray(_lignes, _colonnes){
  var arr = new Array(_colonnes);
  for ( let c = 0; c < arr.length; c ++){
    arr[c] = new Array(_lignes);
  }
  return arr;
}



function mouseClicked(){
  index();
}


// change la valeurd e l'élément cliqué et des cases adjacentes
function index(){
  let c = floor(mouseX / taille);
  let l = floor(mouseY / taille);
  if(c >= 0 && c < array.length && l >= 0 && l < array[c].length){
    changer_valeur(c,l,array);
  }
}




function copy_ar(array_to_copy){
  let copy = new Array(array_to_copy.length);
  for(let c = 0; c < array_to_copy.length; c ++){
    copy[c] = new Array(array_to_copy[c].length);
    for(let l = 0; l < array_to_copy[c].length; l ++){
      copy[c][l] = new cell(array_to_copy[c][l].colonne ,array_to_copy[c][l].ligne);
      copy[c][l].valeur = array_to_copy[c][l].valeur;
    }
  }
  return copy;
}



// retourne vrai si le tableau est d'une seule couleur
function verifier_couleur(a){
  // b = valeur/couleur de la première case
  let b = a[0][0].value;
  for(let c = 0; c < a.length; c ++){
    for(let l = 0; l < a[c].length; l ++){
      if(a[c][l].value != b){
        return false;
      }
    }
  }
  return true;
}



/*
// test si les clics dans a rendent le tableau d'une seule couleur
function tester_array_clic(a){
  // créer une copie du tableau
  let copie = copy_ar(array);
  // met à jour le tableau avec les clics dans a
  for(let c = 0; c < a.length; c ++){
    for(let l = 0; l < a[c].length; l ++){
      if(a[c][r] == 0){
      } else {
        copie[c][l].changer_valeur(copie);
      }
    }
  }
  return verifier_couleur(copie);
}

*/



/*
// Create all solution and test each one
function find(){
  // Generate array of 2d array with all possible move
  let solution = new Array(2**((colonnes)*(lignes)));
  // for each table
  for(let k = 0; k < solution.length; k ++){
    let val = k;
    solution[k] = make2DArray(lignes, colonnes);
    // for each cols
    for(let c = 0; c < solution[k].length ; c ++){
      // for each rows
      for(let r = 0; r < solution[k][c].length; r ++){
        let v = 2**(r*colonnes + c);
        // if val has a bit of value v
        if((val & v) != 0){
          solution[k][c][r] = 1;
          val -= v;
        } else {
          solution[k][c][r] = 0;
        }
      }
    }
  }
  console.log("all possible moves");
  console.log(solution);
  // check all arrays
  let result = [];
  for(let k = 0; k < solution.length; k ++){
    if(tester_array_clic(solution[k])){
      result.push(solution[k]);
    }
  }
  console.log("all solutions");
  for(let k = 0; k < result.length; k ++){
    console.table(result[k]);
  }
  return result;
}
*/

/*
function generate_solution(){
  // Generate array of 2d array with all possible move
  let solution = new Array(2**((cols)*(rows)));
  // for each table
  for(let k = 0; k < solution.length; k ++){
    let val = k;
    solution[k] = make2DArray(rows, cols);
    // for each cols
    for(let c = 0; c < solution[k].length ; c ++){
      // for each rows
      for(let r = 0; r < solution[k][c].length; r ++){
        let v = 2**(r*cols + c);
        // if val has a bit of value v
        if((val & v) != 0){
          solution[k][c][r] = k;
          val -= v;
        } else {
          solution[k][c][r] = 0;
        }
      }
    }
  }
  return solution;
}
*/







function setup_DOM(){
  bouton_generer_grille = createButton('Génerer');
  bouton_generer_grille.position(10,taille*lignes+20);
  bouton_generer_grille.mousePressed(generer_grille);
  
  bouton_resoudre = createButton('Résoudre');
  bouton_resoudre.position(bouton_generer_grille.x,bouton_generer_grille.y + bouton_generer_grille.height);
  
  checkbox_couleur = createCheckbox('couleur cible : 1 = noir, 0 = blanc', true); 
  checkbox_couleur.position(bouton_resoudre.x,bouton_resoudre.y + bouton_resoudre.height);
  
  bouton_resoudre.mousePressed(genererFNC);
  
  
  bouton_reset = createButton('Reset');
  bouton_reset.position(checkbox_couleur.x,checkbox_couleur.y + checkbox_couleur.height);
  bouton_reset.mousePressed(reset_grille);
  
  slider_taille_grille = createSlider(1,20,5,1);
  slider_taille_grille.position(bouton_reset.x,bouton_reset.y + bouton_reset.height);
  slider_taille_grille.style('width',height+'px');
  
}





// change le valeur de la case et des cases adjacentes
function changer_valeur(c,l,ar){
  cellule = ar[c][l];
  cellule.valeur = cellule.valeur == false;
  cellule.clic ++;
  
  if(cellule.colonne > 0){
    ar[cellule.colonne-1][cellule.ligne].valeur = ar[cellule.colonne-1][cellule.ligne].valeur == 0;
  }
  if(cellule.colonne + 1 < colonnes){
    ar[cellule.colonne+1][cellule.ligne].valeur = ar[cellule.colonne+1][cellule.ligne].valeur == 0;
  }
  if(cellule.ligne > 0){
    ar[cellule.colonne][cellule.ligne-1].valeur = ar[cellule.colonne][cellule.ligne-1].valeur == 0;
  }
  if(cellule.ligne + 1 < lignes){
    ar[cellule.colonne][cellule.ligne+1].valeur = ar[cellule.colonne][cellule.ligne+1].valeur == 0;
  }
}


function generer_grille(proba){
  
  proba = typeof proba !== 'undefined' ? proba : 0.5;
  // pour chaque case de array
  for(let c = 0; c < array.length; c ++){
    for(let l = 0; l < array[c].length; l ++){
      if(random() <= proba){
        changer_valeur(c,l,array);
      }
    }
  }
  // pour chaque case de array
  for(let c = 0; c < array.length; c ++){
    for(let l = 0; l < array[c].length; l ++){
      array[c][l].clic = 0;
      array[c][l].valeur_initiale = array[c][l].valeur;
    }
  }
}


function reset_grille(){
  // pour chaque case de array
  for(let c = 0; c < array.length; c ++){
    for(let l = 0; l < array[c].length; l ++){
      array[c][l].valeur = checkbox_couleur.checked() != true;
      array[c][l].valeur_initiale = !checkbox_couleur.checked() != true;
      array[c][l].clic = 0;
    }
  }
}


























// color : false = white, true = black
// generate a DIMACS format file to solve the current array
function genererFNC(save, log, zero, intro){
  
  let couleur = checkbox_couleur.checked();
  save = typeof save !== 'undefined' ? save : true;
  log = typeof log !== 'undefined' ? log : false;
  zero = typeof zero !== 'undefined' ? zero : true;
  intro = typeof intro !== 'undefined' ? intro : false;
  
  if(couleur){
    // noir
    console.log("Couleur recherchée noir.");
  } else {
    // blanc
    console.log("Couleur recherchée blanche.");
  }
  
  // tableau qui va contenir la forme normale conjonctive
  let fnc = [];
  
  
  // pour chaque case de array
  for(let c = 0; c < array.length; c ++){
    for(let l = 0; l < array[c].length; l ++){
      
      // tableau qui va contenir la case courante et ses cases adjacentes
      let cases = array[c][l].get_cases(array);
      if(log){
        console.table(cases);
        if(array[c][l].valeur == couleur){
          console.log("case " + array[c][l].nombre +" : le nombre de clic doit être pair.");
        } else {
          console.log("case " + array[c][l].nombre +" : le nombre de clic doit être impair.");
        }
      }
      
      // Si le nombre de variable est impaire
      if(cases.length % 2 == 1){
        // Si la couleur de la case est la bonne
        if(array[c][l].valeur == couleur){
          
          // test de toutes les possibilitées binaire
          let num = 0;
          while(num < 2 ** cases.length)
          {
            // calcul du nombre de bit à 1
            let nb_bit = 0;
            for(let i = 0; i < cases.length; i ++){
              if((num & 1 << i) != 0){
                nb_bit ++;
              }
            }
            
            // si le nombre de bit est pair
            if(nb_bit % 2 == 0){
              
              let clause = " ";
              
              // pour chaque bit de num
              for(let i = 0; i < cases.length; i ++){
                let nom =  cases[i].nombre;
                // si bit = 1 => clic
                if((num & 1 << i) != 0){
                  clause += " " + nom;
                } 
                // if bit = 0 => -clic
                else {
                  clause += "-" + nom;
                }
                clause += " ";
              }
              if(zero){
                clause += "0";
              }
              // si on a atteint la fin de la boucle while
              if(num >= 2 ** cases.length - 2){
                // saut de ligne pour séparer les clauses de chaque cases
                clause += "\n";
              }
              // on ajoute la clause générer à fnc
              fnc.push(clause);
              if(log){
                console.log(clause);
              }
            }
            
            num ++;
            
          }
        } 
        // Si la couleur de la case est la mauvaise
        else {
          // test de toutes les possibilitées binaire
          let num = 0;
          while(num < 2 ** cases.length)
          {
            // calcul du nombre de bit à 1
            let nb_bit = 0;
            for(let i = 0; i < cases.length; i ++){
              if((num & 1 << i) != 0){
                nb_bit ++;
              }
            }
            
            
            // si le nombre de bit est impair
            if(nb_bit % 2 == 1){
              
              let clause = " ";
              // pour chaque bit de num
              for(let i = 0; i < cases.length; i ++){
                let nom =  cases[i].nombre;
                // si bit = 1 => clic
                if((num & 1 << i) != 0){
                  clause += " " + nom;
                } 
                // si bit = 0 => -clic
                else {
                  clause += "-" + nom;
                }
                clause += " ";
              }
              if(zero){
                clause += "0";
              }
              // si on a atteint la fin de la boucle while
              if(num >= 2 ** cases.length - 2){
                // saut de ligne pour séparer les clauses de chaque cases
                clause += "\n";
              }
              // on ajoute la clause générer à fnc
              fnc.push(clause);
              if(log){
                console.log(clause);
              }
            }
            num ++;
            
          }
        }
      } 
      
      // Si le nombre de variable est paire
      else {
        // Si la couleur de la case est la bonne
        if(array[c][l].valeur == couleur){
          
          // test de toutes les possibilitées binaire
          let num = 0;
          while(num < 2 ** cases.length)
          {
            // calcul du nombre de bit à 1
            let nb_bit = 0;
            for(let i = 0; i < cases.length; i ++){
              if((num & 1 << i) != 0){
                nb_bit ++;
              }
            }
            
            // si le nombre de bit est pair
            if(nb_bit % 2 == 1){
              
              let clause = " ";
              
              // pour chaque bit de num
              for(let i = 0; i < cases.length; i ++){
                let nom =  cases[i].nombre;
                // si bit = 1 => clic
                if((num & 1 << i) != 0){
                  clause += " " + nom;
                } 
                // if bit = 0 => -clic
                else {
                  clause += "-" + nom;
                }
                clause += " ";
              }
              if(zero){
                clause += "0";
              }
              // si on a atteint la fin de la boucle while
              if(num >= 2 ** cases.length - 2){
                // saut de ligne pour séparer les clauses de chaque cases
                clause += "\n";
              }
              // on ajoute la clause générer à fnc
              fnc.push(clause);
              if(log){
                console.log(clause);
              }
            }
            
            num ++;
            
          }
        } 
        // Si la couleur de la case est la mauvaise
        else {
          // test de toutes les possibilitées binaire
          let num = 0;
          while(num < 2 ** cases.length)
          {
            // calcul du nombre de bit à 1
            let nb_bit = 0;
            for(let i = 0; i < cases.length; i ++){
              if((num & 1 << i) != 0){
                nb_bit ++;
              }
            }
            
            
            // si le nombre de bit est pair
            if(nb_bit % 2 == 0){
              let clause = " ";
              // pour chaque bit de num
              for(let i = 0; i < cases.length; i ++){
                let nom =  cases[i].nombre;
                // si bit = 1 => clic
                if((num & 1 << i) != 0){
                  clause += " " + nom;
                } 
                // si bit = 0 => -clic
                else {
                  clause += "-" + nom;
                }
                clause += " ";
              }
              if(zero){
                clause += "0";
              }
              // si on a atteint la fin de la boucle while
              if(num >= 2 ** cases.length - 2){
                // saut de ligne pour séparer les clauses de chaque cases
                clause += "\n";
              }
              // on ajoute la clause générer à fnc
              fnc.push(clause);
              if(log){
                console.log(clause);
              }
            }
            num ++;
            
          }
        }
      } 
    }
  }
  if(intro){
    let intro = "p cnf " + lignes*colonnes + " " + fnc.length;
    fnc.splice(0,0, intro);
  }
  if(save){
    saveStrings(fnc, 'fnc.txt');
  }
  console.table(fnc);
}



