import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { webSocket } from "rxjs/webSocket";
import { environment } from '../../environments/environment';
import { Paint, Action , Point, Color, Brush, ActionPacket, ActionType } from '../models/action';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {
  //サーバーからの入力（全体の情報が流れるストリーム）
  public webStream = webSocket("ws://"+location.hostname+":3000");
  
  constructor() {
    console.log("service constructor called");
  }

  // サーバーへ一筆送信  
  public sendAction(st: Action){
    this.webStream.next(st);
  }

  //websocketのストリームをactionのそれに変換
  public actionStream(){
    return this.webStream.pipe(map(v => {
      console.log("get web socket");
      //console.log(this.shapeAction(v));
      return this.shapeAction(v);
    }));
  }

  //operation用のストリームを生成
  public operateStream(){
    return this.webStream.pipe(
      map(v => {
        return this.shapeAction(v);
      }),
      filter(v => v.actionType === ActionType.OPERATION),
      //for debug
      map(v =>{
        console.log("recieved operate packet");
        return v
      })
    );
  }
  //annouce用のストリームを生成
  public announceStream(){
    return this.webStream.pipe(
      map(v => {
        return this.shapeAction(v);
      }),
      filter(v => v.actionType === ActionType.ANNOUNCE),
      //for debug 
      map(v =>{
        console.log("recieved announce packet");
        return v
      })
      );
  }
  //chat用のストリームを生成
  public chatStream(){
    return this.actionStream().pipe(
      filter(v => v.actionType === ActionType.CHAT),
      //for debug 
      map(v =>{
        console.log("recieved chat packet");
        return v
      })
      );
  }

  //ストリームのjsonをactionに変換
  private shapeAction(v:ActionPacket){
    let st = new Action();
    st.setActionType(v.actionType);
    switch(v.actionType){
      case ActionType.WRITE:
        v.line.map(p => { st.addPoint(new Point(p.x,p.y)) });
        st.color = new Color(v.color.red,v.color.green,v.color.blue);
        st.lineWidth = v.lineWidth;
        console.log(st);
        break;
      case ActionType.CLEAR:
        break;
      case ActionType.OPERATION:
        st.message = v.message;
        break;
      case ActionType.ANNOUNCE:
        st.message = v.message;
        break;
      case ActionType.CHAT:
        st.userName = v.userName;
        st.message = v.message;
        break;
      default:
        console.log("catch unknown packet");
        break;
    }
    console.log(st);
    return st;
  }
}
