import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {getPaginatedResult, getPaginationHeaders } from './getPaginationHeaders';
import { Message } from '../_models/Message';

@Injectable({
  providedIn: 'root'
})

export class MessageService implements OnInit {
baseUrl = environment.apiurl;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    }

    getMessages(pageNummber: number, pageSize:number, container:string){
    let params = getPaginationHeaders(pageNummber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);

    }

    getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
    }

    sendMessage(username:string, content:string){
    return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername:username, content});
    }

    deleteMessage(id:number){
    return this.http.delete(this.baseUrl + 'messages/' + id);
    }

}
