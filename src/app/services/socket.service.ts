import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  logtoken = localStorage.getItem('LoginToken');

  constructor(private socket: Socket) {
		// this.socketService.getMessage().subscribe((data: any) => this.movies = data)
  }

  // emit event
  sendMessage(event: string, msg: string) {
    this.socket.emit(event, msg);
  }

  // listen event
  getMessage(eventName) {
   // return this.socket.fromEvent(eventName).pipe(map((data) => data));
    return new Observable(observer => {
      this.socket.on(eventName, message => {
        observer.next(message);
      });
    });
  }

}
