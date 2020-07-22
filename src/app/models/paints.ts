export class Color{
  public red: number;
  public green: number;
  public blue: number;
  constructor(red:number, green:number, blue:number){
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
}

export class Point{
  public x:number;
  public y:number;
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}


export const enum StrokeType{ WRITE, CLEAR, UNDO, REDO, OPERATION }

export interface StrokePacket{
  strokeType?: StrokeType,
  line?: {x:number, y:number}[],
  color?: Color, // ここも後々websocketに合わせて修正
  message?: string
}

export class Stroke{
  public strokeType: StrokeType;
  public line: Point[];
  public color: Color;
  public message: string;
  constructor(msg? : string){
    this.line = [];
    if(msg){
      this.strokeType = StrokeType.OPERATION;
      this.message = msg;
    }else{
      this.strokeType = StrokeType.WRITE;
    }
  }
  public setStrokeType(t:StrokeType){
    this.strokeType = t;
  }
  public addPoint(p:Point){
    this.line.push(p);
  }
  //[0,1,2,3] -> [(0,1),(1,2),(2,3)]
  public pairLines(){
    const pres = this.line.slice(1);
    const sucs = this.line.slice(0,-1);
    return pres.map(function(e,i){
      return [e, sucs[i]];
    });
  }
}

export class Paint{
  public strokes: Stroke[];
  constructor(){
    this.strokes = [];
  }
  public addStroke(s:Stroke){
    this.strokes.push(s);
  }
}

export class Brush{
  public start: Point;
  public end: Point;
  public before: Point;
  public isTouch: boolean;
  constructor(){
  }
  public putIn(p:Point){
    this.start = p; 
    this.isTouch = true;
  }
  public putOut(p:Point){
    this.end = p; 
    this.isTouch = false;
  }
  public setBefore(p:Point){
    this.before = p; 
  }
}

