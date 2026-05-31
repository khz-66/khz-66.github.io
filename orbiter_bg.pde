Orbiter[] orbiter = new Orbiter[10];
Orbiter bigOrbiter;
Orbiter smallOrbiter;

void setup(){
  size(800,800);
  //size( window.innerWidth, window.innerHeight ); // für processing.js: Grße Browserfenster
  
  for(int i=0;i<orbiter.length/5;i++){
    orbiter[i] =new Orbiter();
    /*
    orbiter[i].farbeZentrum=rotorange();
    orbiter[i].farbeOrbiter=rotorange();
    orbiter[i].farbeBahn=rotorange();
    */
  }
  
  for(int i=orbiter.length/5;i<orbiter.length;i++){
    orbiter[i] =new Orbiter();
    /*
    orbiter[i].farbeZentrum=graublau();
    orbiter[i].farbeOrbiter=graublau();
    orbiter[i].farbeBahn=graublau();
    */
  }
  
  bigOrbiter=new Orbiter(new PVector(width*2/3, height/3), min(width/3, height/3), 0.01);
  /*
  bigOrbiter.farbeZentrum=graublau();
  bigOrbiter.farbeBahn=graublau();
  bigOrbiter.farbeOrbiter=graublau();
  */
  bigOrbiter.linieBahn=5;
  
  smallOrbiter=new Orbiter(bigOrbiter.orbiter, bigOrbiter.radiusBahn/2, -0.02);
  /*
  smallOrbiter.farbeZentrum=graublau();
  smallOrbiter.farbeBahn=graublau();
  smallOrbiter.farbeOrbiter=graublau();
  */
  smallOrbiter.linieBahn=3;
}

void draw(){
  background(#FFFFFF);
  
  for(int i=0;i<orbiter.length;i++){
    orbiter[i].display();
  }
  
  bigOrbiter.display();
  smallOrbiter.display();
  
    fill(255, 150);
  rect(0, 0, width, height);
}

color graublau() {
  int baseR = 130;
  int baseG =150;
  int baseB = 170;

  int r = constrain(baseR + int(random(-20, 20)), 0, 255);
  int g = constrain(baseG + int(random(-20, 20)), 0, 255);
  int b = constrain(baseB + int(random(-20, 20)), 0, 255);

  return color(r, g, b);
}

color rotorange() {
  // Grundwerte: warmes Rot-Orange
  int baseR = 255;
  int baseG = 180;
  int baseB = 200;

  // leichte Variation (zufällig ±20)
  int r = constrain(baseR + int(random(-50, 50)), 0, 255);
  int g = constrain(baseG + int(random(-50, 50)), 0, 255);
  int b = constrain(baseB + int(random(-50, 50)), 0, 255);

  return color(r, g, b);
}
