import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeaProduct {
  id: number;
  title: string;
  price: number;
  description?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeaService {
  private apiUrl = 'https://testologia.ru/tea';

  constructor(private http: HttpClient) { }

  getTeas(): Observable<TeaProduct[]> {
    return this.http.get<TeaProduct[]>(this.apiUrl);
  }
}
