import { Injectable } from '@angular/core';
import {Responsible} from '../models/responsible';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {

  private url = 'http://localhost:8080/api/v1/';
  responsible: Responsible[];

  constructor(private http: HttpClient) { }

  async getResponsible() {
    this.responsible = [];
    await this.http.get<any>(this.url + 'responsible').subscribe(res => {
      res.forEach(r => {
        this.responsible.push(new Responsible(r));
      });
    });
  }

  findByEditorIds(ids: number[]) {
    let result = [];
    ids.forEach((id, index) => {
      const temp = this.responsible.filter(res => res.editorId === id);
      result = index === 0 ? temp : temp.filter(value => result.includes(value));
    });
    return result.map(value => value.bookId);
  }
}
