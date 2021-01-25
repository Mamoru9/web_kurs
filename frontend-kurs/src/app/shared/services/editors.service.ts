import { Injectable } from '@angular/core';
import {Editor} from '../models/editor';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EditorsService {

  private url = 'http://localhost:8080/api/v1/';
  editors: Editor[];

  constructor(private http: HttpClient) { }

  async getEditors() {
    this.editors = [];
    await this.http.get<any>(this.url + 'editors').subscribe(res => {
      res.forEach(editor => {
        this.editors.push(new Editor(editor));
      });
    });
  }
}
