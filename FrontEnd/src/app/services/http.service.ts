import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private socket!: Socket;

  constructor(private httpClient: HttpClient) {}

  get<T>(url:string): Observable<T>{
    return this.httpClient.get<T>(url);
  }

  post<T>(url:string,body:{[key: string]:any}): Observable<T> {
    return this.httpClient.post<T>(url,body);
  }

  getAuth<T>(url:string): Observable<T> {
    const token: string | null = this.getToken();
    if(!token) return this.get<T>(url);

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : `Bearer ${token}`
    })
    return this.httpClient.get<T>(url,{headers});
  }

  postAuth<T>(url:string,body:{[key: string]:any}): Observable<T> {
    const token: string | null = this.getToken();
    if(!token) return this.post<T>(url,body);

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : `Bearer ${token}`
    })
    return this.httpClient.post<T>(url,body,{headers});
  }

  getToken():string | null {
    return localStorage.getItem('token');
  }

  init(){
    const token = localStorage.getItem('token');
    this.socket = io(environment.api, {
      auth: {
        token: token
      }
    });
  }

  emit(event: string, callback: any) {
    this.socket.emit(event, callback);
  }

  emitWithData(event: string, data: any, callback:any) {
    this.socket.emit(event, data, callback);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
