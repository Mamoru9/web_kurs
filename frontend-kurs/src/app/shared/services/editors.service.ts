import { Injectable } from '@angular/core';
import {Editor} from '../models/editor';
import {HttpClient} from '@angular/common/http';
import {Author} from '../models/author';

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

  filterEditorByName(firstName: string, lastName: string, middleName: string, field: any): string[] {
    if (firstName === '' && lastName === '' && middleName === '') {
      return this.editors.map(author => author[field]);
    }

    return  this.editors.filter(editor => firstName === '' ? editor : editor.firstName.toLowerCase().indexOf(firstName.toLowerCase()) === 0)
      .filter(editor => lastName === '' ? editor : editor.lastName.toLowerCase().indexOf(lastName.toLowerCase()) === 0)
      .filter(editor => middleName === '' ? editor : editor.middleName.toLowerCase().indexOf(middleName.toLowerCase()) === 0)
      .map(editor => editor[field]);
  }

  findEditor(firstName: string, lastName: string, middleName): Author {
    return this.editors.find(editor => editor.firstName === firstName && editor.lastName === lastName && editor.middleName === middleName);
  }

  async addEditor(editor: any) {
    await this.http.post<any>(this.url + 'editor', editor).subscribe(res => {
      this.getEditors();
    });
  }
}
