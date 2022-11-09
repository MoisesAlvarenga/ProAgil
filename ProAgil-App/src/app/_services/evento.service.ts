import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

constructor(private http: HttpClient) { }

  baseURL = 'https://localhost:5001/api/evento';

  getAllEvento(): Observable<Evento[]>{
    return this.http.get<Evento[]>(this.baseURL);
  }

  getEventoByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }

  getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  postUpload(file: File, name: string){
    const formData: FormData  = new FormData();
    console.log(file.name);
    console.log(file);
    
    
    formData.append('file', file, name);

    return this.http.post(`${this.baseURL}/upload`, formData)
  }

  postEvento(evento: Evento){
    return this.http.post<Evento>(this.baseURL, evento);
  }

  putEvento(evento: Evento){
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento);
  }

  deleteEvento(id: number){
    return this.http.delete<Evento>(`${this.baseURL}/${id}`);
  }



}
