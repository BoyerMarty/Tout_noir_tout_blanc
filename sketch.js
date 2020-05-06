

var array;  // array[x / col][y / row]
//var solution;
var cols = 5;
var rows = 5;
var size = 50;



function setup() {
  
  createCanvas(size*cols, size*rows*2 + size/2 + 1);
  background(51);
  array = make2DArray(rows, cols);
  for(let c = 0; c < array.length; c ++){
    for(let r = 0; r < array[c].length; r ++){
      array[c][r] = new cell(c,r);
    }
  }
  
  //generateCNF(true,false,false); // black grid
  
}




function draw() {
  background(51);
  for(let c = 0; c < array.length; c ++){
    for(let r = 0; r < array[c].length; r ++){
      array[c][r].show();
      translate(0,size*rows + size/2);
      array[c][r].show_initial();
      translate(0,-(size*rows + size/2));
    }
  }
  
}





function make2DArray(rows, cols){
  var arr = new Array(cols);
  for ( let c = 0; c < arr.length; c ++){
    arr[c] = new Array(rows);
  }
  return arr;
}



function mouseClicked(){
  index();
}



function index(){
  let c = floor(mouseX / size);
  let r = floor(mouseY / size);
  if(c >= 0 && c < array.length && r >= 0 && r < array[c].length){
    array[c][r].change_value(array);
  }
}




function copy_ar(array_to_copy){
  let copy = new Array(array_to_copy.length);
  for(let c = 0; c < array_to_copy.length; c ++){
    copy[c] = new Array(array_to_copy[c].length);
    for(let r = 0; r < array_to_copy[c].length; r ++){
      copy[c][r] = new cell(array_to_copy[c][r].col,array_to_copy[c][r].row);
      copy[c][r].value = array_to_copy[c][r].value;
    }
  }
  return copy;
}



// check if an array of cells is full white or full black
function checkArrayCell(a){
  // get the boolean value of the fisrt case
  let b = a[0][0].value;
  for(let c = 0; c < a.length; c ++){
    for(let r = 0; r < a[c].length; r ++){
      if(a[c][r].value != b){
        return false;
      }
    }
  }
  return true;
}


// apply move on a copy of the displayed array then check if it is all white or all black
function checkArrayMove(a){
  // create a copy of the displayed array
  let copy = copy_ar(array);
  // update the copy with the moves in a
  for(let c = 0; c < a.length; c ++){
    for(let r = 0; r < a[c].length; r ++){
      if(a[c][r] == 0){
      } else {
        copy[c][r].change_value(copy);
      }
    }
  }
  let t =  checkArrayCell(copy);
  return t;
}






// Create all solution and test each one
function find(){
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
    if(checkArrayMove(solution[k])){
      result.push(solution[k]);
    }
  }
  console.log("all solutions");
  for(let k = 0; k < result.length; k ++){
    console.table(result[k]);
  }
  return result;
}



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


// color : false = white, true = black
// generate a DIMACS format file to solve the current array
function generateCNF(color, save, log){
  
  if(color == "black"){
    // black
    color = true;
    console.log("Color wanted black.");
  } else {
    // white
    color = false;
    console.log("Color wanted white.");
  }
  
  // array that will contain all clauses
  let cnf = [];
  
  
  // for each case of the array
  for(let c = 0; c < array.length; c ++){
    for(let r = 0; r < array[c].length; r ++){
      
      // array that will contain the current case and adjacent cases
      let cases = array[c][r].get_cases(array);
      if(log){
        console.table(cases);
        if(array[c][r].value == color){
          console.log("case " + array[c][r].number +" : number of click need to be even.");
        } else {
          console.log("case " + array[c][r].number +" : number of click need to be odd.");
        }
      }
      
      
      
      // if the color of the case is the good one
      if(array[c][r].value == color){
        // try each binary possibilities
        let num = 0;
        while(num < 2 ** cases.length)
        {
          
          // calcul the number of 1 in the binary representation of num
          let nb_bit = 0;
          for(let i = 0; i < cases.length; i ++){
            if((num & 1 << i) != 0){
              nb_bit ++;
            }
          }
          
          // if the number of bit is even
          if(nb_bit % 2 == 0){
            
            let clause = " ";
            
            // for each bit of num
            for(let i = 0; i < cases.length; i ++){
              let name =  cases[i].number;
              // if bit = 1 => click
              if((num & 1 << i) != 0){
                clause += " " + name;
              } 
              // if bit = 0 => -click
              else {
                clause += "-" + name;
              }
              clause += " ";
            }
            clause += "0";
            if(num >= 2 ** cases.length - 2){
              clause += "\n";
            }
            cnf.push(clause);
            if(log){
              console.log(clause);
            }
          }
          num ++;
        }
      } 
      
      
      
      
      
      else {
        // try each binary possibilities
        let num = 0;
        while(num < 2 ** cases.length)
        {
          // calcul the number of 1 in the binary representation of num
          let nb_bit = 0;
          for(let i = 0; i < cases.length; i ++){
            if((num & 1 << i) != 0){
              nb_bit ++;
            }
          }
          
          // if the number of bit is odd
          if(nb_bit % 2 == 1){
            
            let clause = " ";
            // for each bit
            for(let i = 0; i < cases.length; i ++){
              let name =  cases[i].number;
              // if bit / click = 1
              if((num & 1 << i) != 0){
                clause += " " + name;
              } 
              // if bit / click = 0
              else {
                clause += "-" + name;
              }
              clause += " ";
            }
            clause += "0";
            if(num >= 2 ** cases.length - 2){
              clause += "\n";
            }
            cnf.push(clause);
            if(log){
              console.log(clause);
            }
          }
          num ++;
        }
      }
    }
  }
  let intro = "p cnf " + rows*cols + " " + cnf.length;
  //cnf.splice(0,0, intro);
  console.table(cnf);
  if(save){
    saveStrings(cnf, 'cnf.txt');
  }
}

















// color : false = white, true = black
// generate a DIMACS format file to solve the current array
function generateCNF2(color, save, log){
  
  if(color == "black"){
    // black
    color = true;
    console.log("Color wanted black.");
  } else {
    // white
    color = false;
    console.log("Color wanted white.");
  }
  
  // array that will contain all clauses
  let cnf = [];
  
  
  // for each case of the array
  for(let c = 0; c < array.length; c ++){
    for(let r = 0; r < array[c].length; r ++){
      
      // array that will contain the current case and adjacent cases
      let cases = array[c][r].get_cases(array);
      if(log){
        console.table(cases);
        if(array[c][r].value == color){
          console.log("case " + array[c][r].number +" : number of click need to be even.");
        } else {
          console.log("case " + array[c][r].number +" : number of click need to be odd.");
        }
      }
      
      
      if(cases.length % 2 == 1){
        // if the color of the case is the good one
        if(array[c][r].value == color){
          // try each binary possibilities
          let num = 0;
          while(num < 2 ** cases.length)
          {
            
            // calcul the number of 1 in the binary representation of num
            let nb_bit = 0;
            for(let i = 0; i < cases.length; i ++){
              if((num & 1 << i) != 0){
                nb_bit ++;
              }
            }
            
            // if the number of bit is even
            if(nb_bit % 2 == 0){
              
              let clause = " ";
              
              // for each bit of num
              for(let i = 0; i < cases.length; i ++){
                let name =  cases[i].number;
                // if bit = 1 => click
                if((num & 1 << i) != 0){
                  clause += " " + name;
                } 
                // if bit = 0 => -click
                else {
                  clause += "-" + name;
                }
                clause += " ";
              }
              clause += "0";
              if(num >= 2 ** cases.length - 2){
                clause += "\n";
              }
              cnf.push(clause);
              if(log){
                console.log(clause);
              }
            }
            num ++;
          }
        } 
        
        else {
          // try each binary possibilities
          let num = 0;
          while(num < 2 ** cases.length)
          {
            // calcul the number of 1 in the binary representation of num
            let nb_bit = 0;
            for(let i = 0; i < cases.length; i ++){
              if((num & 1 << i) != 0){
                nb_bit ++;
              }
            }
            
            // if the number of bit is odd
            if(nb_bit % 2 == 1){
              
              let clause = " ";
              // for each bit
              for(let i = 0; i < cases.length; i ++){
                let name =  cases[i].number;
                // if bit / click = 1
                if((num & 1 << i) != 0){
                  clause += " " + name;
                } 
                // if bit / click = 0
                else {
                  clause += "-" + name;
                }
                clause += " ";
              }
              clause += "0";
              if(num >= 2 ** cases.length - 2){
                clause += "\n";
              }
              cnf.push(clause);
              if(log){
                console.log(clause);
              }
            }
            num ++;
          }
        }
      } 
      
      
      
      
      
      
      
      
      
      
      
      
      else {
        // if the color of the case is the good one
        if(array[c][r].value == color){
          // try each binary possibilities
          let num = 0;
          while(num < 2 ** cases.length)
          {
            
            // calcul the number of 1 in the binary representation of num
            let nb_bit = 0;
            for(let i = 0; i < cases.length; i ++){
              if((num & 1 << i) != 0){
                nb_bit ++;
              }
            }
            
            // if the number of bit is odd
            if(nb_bit % 2 == 1){
              
              let clause = " ";
              
              // for each bit of num
              for(let i = 0; i < cases.length; i ++){
                let name =  cases[i].number;
                // if bit = 1 => click
                if((num & 1 << i) != 0){
                  clause += " " + name;
                } 
                // if bit = 0 => -click
                else {
                  clause += "-" + name;
                }
                clause += " ";
              }
              clause += "0";
              if(num >= 2 ** cases.length - 2){
                clause += "\n";
              }
              cnf.push(clause);
              if(log){
                console.log(clause);
              }
            }
            num ++;
          }
        } 
        
        else {
          // try each binary possibilities
          let num = 0;
          while(num < 2 ** cases.length)
          {
            // calcul the number of 1 in the binary representation of num
            let nb_bit = 0;
            for(let i = 0; i < cases.length; i ++){
              if((num & 1 << i) != 0){
                nb_bit ++;
              }
            }
            
            // if the number of bit is even
            if(nb_bit % 2 == 0){
              
              let clause = " ";
              // for each bit
              for(let i = 0; i < cases.length; i ++){
                let name =  cases[i].number;
                // if bit / click = 1
                if((num & 1 << i) != 0){
                  clause += " " + name;
                } 
                // if bit / click = 0
                else {
                  clause += "-" + name;
                }
                clause += " ";
              }
              clause += "0";
              if(num >= 2 ** cases.length - 2){
                clause += "\n";
              }
              cnf.push(clause);
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
  let intro = "p cnf " + rows*cols + " " + cnf.length;
  //cnf.splice(0,0, intro);
  console.table(cnf);
  if(save){
    saveStrings(cnf, 'cnf.txt');
  }
}



