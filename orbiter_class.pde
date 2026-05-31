// Klasse Orbiter
//
// Konstruktor:
//
// Orbiter(PVector Zentrum, float Bahnradius, float Umlaufgeschwindigkeit)
// - Farben standardmäßig zufällig
//
// oder
//
// Orbiter()
// - Position, Bahnradius und Farbe zufällig
//
// .locate()       - Position Orbiter abhängig vom Zentrum berechnen 
// .display()      - Position berechnen und orbiter darstellen
//
// .orbiter        - Variable Typ PVector: Position des Orbiters
// .zentrum        - Variable Typ PVector: Position des Zentrums
//
// .radiusZentrum  - Variable Typ  float
// .radiusOrbiter  - Variable Typ  float
// .radiusBahn     - Variable Typ  float
// .linieBahn      - Variable Typ  float: Liniendicke der Bahn
// 
// .farbeZentrum   - Variable Typ color
// .farbeOrbiter   - Variable Typ color
// .farbeBahn      - Variable Typ color
//
// .winkelOrbiter  - Variable Typ float: Momentaner Winkel Orbiter
// .schrittOrbiter - Variable Typ float: Winkelgeschwindigkeit Orbiter

class Orbiter{
  PVector zentrum, orbiter;                       //zentrum als Vektor
  float radiusZentrum, radiusOrbiter, radiusBahn; //Radien von Zentrum, Orbiter und Bahn
  float linieBahn=1;                              //Liniendicke Bahn
  float winkelOrbiter, schrittOrbiter;            //Momentaner Winkel, Winkelgeschwindigkeit Orbiter
  color farbeZentrum, farbeOrbiter, farbeBahn;

  //Konstruktor 
  Orbiter(PVector zentrumTmp, float radiusBahnTmp, float schrittOrbiterTmp){
    zentrum=zentrumTmp;
    radiusBahn=radiusBahnTmp;
    schrittOrbiter=schrittOrbiterTmp;             //Geschwindigkeit Orbiter
    
    radiusZentrum=radiusBahn/5;                   //Radien abhängig vom Bahnradius
    radiusOrbiter=radiusZentrum/3;
    
    winkelOrbiter=random(TWO_PI);                 //Anfänglicher Winkel zufällig
    orbiter=new PVector();
    
    colorMode(HSB);                               //HSB-Modus: Einfacher aufhellen 
    int hue=int(random(255));                     //Zufallswert für Farbton
    farbeZentrum=color(hue,255,255);              //Farben von Zentrum... 
    farbeOrbiter=color(hue,128,255);              //...Orbiter...
    farbeBahn=color(hue,128,255);                 //...und Bahn
  }
  
  //Konstruktor mit Zufallswerten
  Orbiter(){
    zentrum=new PVector(random(width),random(height));
    float r=min(width, height)/20;
    radiusBahn=random(0.5*min(width, height)/20, 2*min(width, height)/20);
    schrittOrbiter=random(-0.1, 0.1);             //Geschwindigkeit Orbiter
    
    radiusZentrum=radiusBahn/5;                   //Radien abhängig vom Bahnradius
    radiusOrbiter=radiusZentrum/3;
    
    winkelOrbiter=random(TWO_PI);                 //Anfänglicher Winkel zufällig
    orbiter=new PVector();
    
    colorMode(HSB);                               //HSB-Modus: Einfacher aufhellen
    int hue=int(random(255));                     //Zufallswert für Farbton
    farbeZentrum=color(hue,255,255);              //Farben von Zentrum... 
    farbeOrbiter=color(hue,128,255);              //...Orbiter...
    farbeBahn=color(hue,128,255);                 //...und Bahn
  }
  
  //Methode Positionbestimmung Orbiter abhängig vom Zenrum
  void locate(){  
    orbiter.set(zentrum.x+radiusBahn*cos(winkelOrbiter), zentrum.y+radiusBahn*sin(winkelOrbiter));
    winkelOrbiter+=schrittOrbiter%TWO_PI;         //Orbiter weiterbewegen
  }
  
  //Methode Positionbestimmung und Darstellung Orbiter
  void display(){
    locate();
    orbiterZeichnen();
  }
  
  //Methode Darstellung Orbiter
  void orbiterZeichnen(){
    colorMode(HSB);
    
    //Bahn zeichnen
    noFill();
    stroke(farbeBahn);
    strokeWeight(linieBahn);
    ellipse(zentrum.x, zentrum.y, 2*radiusBahn, 2*radiusBahn);
    
    //Orbiter zeichnen
    noStroke();
    fill(farbeOrbiter);
    ellipse(orbiter.x, orbiter.y, 2*radiusOrbiter, 2*radiusOrbiter);
    
    //Zentrum zeichnen
    noStroke();
    fill(farbeZentrum);
    ellipse(zentrum.x, zentrum.y, 2*radiusZentrum, 2*radiusZentrum);  
  }
}
