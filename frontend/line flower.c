#define m1 2  //Left Motor ML1
#define m2 3  //left Motor ML2
#define m3 4  //Right Motor MR1
#define m4 5  //Right Motor MR2
#define e1 9  //Left Motor Enable Pin EA
#define e2 10 //Right Motor Enable Pin EB

//5 Channel IR Sensor Connection//
#define ir2 A0
#define ir3 A1
#define ir4 A2
#define ir5 A3
#define ir6 A4
//*//

void setup() {
  pinMode(m1, OUTPUT);
  pinMode(m2, OUTPUT);
  pinMode(m3, OUTPUT);
  pinMode(m4, OUTPUT);
  pinMode(e1, OUTPUT);
  pinMode(e2, OUTPUT);
  pinMode(ir2, INPUT);
  pinMode(ir3, INPUT);
  pinMode(ir4, INPUT);
  pinMode(ir5, INPUT);
  pinMode(ir6, INPUT);
}

void loop() {
  //Reading Sensor Values
  int s1 = digitalRead(ir2);  //Left Most Sensor
  int s2 = digitalRead(ir3);  //Left Sensor
  int s3 = digitalRead(ir4);  //Middle Sensor
  int s4 = digitalRead(ir5);  //Right Sensor
  int s5 = digitalRead(ir6);  //Right Most Sensor


  //1 Current code:
  if(s1==1 && s2==0 && s3==0 && s4==0 && s5==0)TurnLeft();

  if(s1==1 && s2==1 && s3==0 && s4==0 && s5==0)TurnLeft();
    
  if(s1==1 && s2==1 && s3==1 && s4==0 && s5==0)TurnLeft();
  
  if(s1==1 && s2==1 && s3==1 && s4==1 && s5==0)TurnLeft();


  if(s1==0 && s2==1 && s3==1 && s4==1 && s5==0)Forward();
  if(s1==0 && s2==1 && s3==1 && s4==0 && s5==0)Forward();
  if(s1==0 && s2==0 && s3==1 && s4==1 && s5==0)Forward();
  




  if(s1==0 && s2==0 && s3==0 && s4==0 && s5==1)TurnRight();

  if(s1==0 && s2==0 && s3==0 && s4==1 && s5==1)TurnRight();

  if(s1==0 && s2==0 && s3==1 && s4==1 && s5==1)TurnRight();

  if(s1==0 && s2==1 && s3==1 && s4==1 && s5==1)TurnRight();


  
 


  if(s1==0 && s2==0 && s3==0 && s4==0 && s5==0)Backward();

  if(s1==1 && s2==1 && s3==1 && s4==1 && s5==1)Slow();

}


void Forward(){
   //going forward with full speed 
  analogWrite(e1, 100); //you can adjust the speed of the motors from 0-100
  analogWrite(e2, 100); //you can adjust the speed of the motors from 0-100
  digitalWrite(m1, HIGH);
  digitalWrite(m2, LOW);
  digitalWrite(m3, HIGH);
  digitalWrite(m4, LOW);
}
void Slow(){
     //going forward with full speed 
  analogWrite(e1, 25); //you can adjust the speed of the motors from 0-100
  analogWrite(e2, 25); //you can adjust the speed of the motors from 0-100
  digitalWrite(m1, HIGH);
  digitalWrite(m2, LOW);
  digitalWrite(m3, HIGH);
  digitalWrite(m4, LOW);
}


void TurnLeft(){
   //going left with full speed 
  analogWrite(e1, 75); //you can adjust the speed of the motors from 0-100
  analogWrite(e2, 75); //you can adjust the speed of the motors from 0-100
  digitalWrite(m1, LOW);
  digitalWrite(m2, HIGH);
  digitalWrite(m3, HIGH);
  digitalWrite(m4, LOW);
}
void TurnRight(){
  //going right with full speed 
  analogWrite(e1, 75); //you can adjust the speed of the motors from 0-100
  analogWrite(e2, 75); //you can adjust the speed of the motors from 0-100
  digitalWrite(m1, HIGH);
  digitalWrite(m2, LOW);
  digitalWrite(m3, LOW);
  digitalWrite(m4, HIGH);
}

void Stop(){
  //stop
  digitalWrite(m1, LOW);
  digitalWrite(m2, LOW);
  digitalWrite(m3, LOW);
  digitalWrite(m4, LOW);
}
void Backward(){
    //going REVERSE with 60% speed
  analogWrite(e1, 50); //you can adjust the speed of the motors from 0-100
  analogWrite(e2, 50); //you can adjust the speed of the motors from 0-100
  digitalWrite(m1, LOW);
  digitalWrite(m2, HIGH);
  digitalWrite(m3, LOW);
  digitalWrite(m4,HIGH);

}