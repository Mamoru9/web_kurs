import { Injectable } from '@angular/core';
import {Translator} from '../models/translator';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslatorsService {

  private url = 'http://localhost:8080/api/v1/';
  translators: Translator[];

  constructor(private http: HttpClient) { }

  async getTranslators() {
    this.translators = [];
    await this.http.get<any>(this.url + 'translators').subscribe(res => {
      res.forEach(translator => {
        this.translators.push(new Translator(translator));
      });
    });
  }
}
