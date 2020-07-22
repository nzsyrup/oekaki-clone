import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { Observable, Subject } from 'rxjs';

import { ConnectService } from '../service/connect.service';
import { Paint, Stroke , Point, Color, Brush,StrokeType } from '../models/paints';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('chatInput') inputForm; // 
  public operationStream: Observable<Stroke>;
  public chatLog : string[];


  constructor(private connectService: ConnectService) { 
    this.operationStream = connectService.operateStream();
    this.chatLog = ["text field"];
  }

  ngOnInit(): void {
    this.operationStream.subscribe(
      msg =>{
        console.log("recieved message");
        console.log(msg);
        this.chatLog.push(msg.message);
      }
    );
  }
  ngOnChanges(){
    console.log(this.chatLog);
  }

  public getEnter(){
    let elm = this.inputForm.nativeElement;
    const inputAnswer = elm.value;
    console.log(inputAnswer);
    elm.value = "";
    this.connectService.sendStroke(new Stroke(inputAnswer));
  }

}
