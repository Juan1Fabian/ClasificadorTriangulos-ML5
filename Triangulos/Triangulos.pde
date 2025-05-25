void setup()
{
  size(64, 64);
}

void draw()
{ 
  for (int i = 0;i < 6; i++){
    background(255);
    strokeWeight(4);
    pushMatrix();
  
    float r = random(8, 24);
    float x = random(r, width - r);
    float y = random(r, height - r);
    
    translate(x,y);
    
    if(i == 0){
      //A
      rotate(random(-0.1, 0.1));
      triangle(-r, -r, r, r, -r, r);
      saveFrame("data/TrianguloRecA###.png");
    }else if(i == 1){
      //B
      rotate(random(-0.1, 0.1));
      triangle(-r, r, r, r, r, -r);
      saveFrame("data/TrianguloRecB###.png");
    }else if(i == 2){
      //C
      rotate(random(-0.1, 0.1));
      triangle(r, -r, -r, -r, -r, r);
      saveFrame("data/TrianguloRecC###.png");
    }else if(i == 3){
      //D
      rotate(random(-0.1, 0.1));
      triangle(-r, -r, r, r, r, -r);
      saveFrame("data/TrianguloRecD###.png");
    }else if(i == 4){
      //A
      rotate(random(-0.1, 0.1));
      triangle(r, -r, -r, -r, 0, r);
      saveFrame("data/TrianguloEquilatero###.png");
    }else if(i == 5){
      //B
      rotate(random(-0.1, 0.1));
      triangle(0, -r, r, r, -r, r);
      saveFrame("data/TrianguloIsósceles###.png");
    }
    popMatrix();
  }
  if(frameCount == 100)
  {
    exit();
  }
}
