import { Injectable } from '@angular/core';
import {Translation} from '../models/translation';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {

  private url = 'http://localhost:8080/api/v1/';
  translations: Translation[];

  constructor(private http: HttpClient) { }

  async getTranslations() {
    this.translations = [];
    this.http.get<any>(this.url + 'translations').subscribe(res => {
      res.forEach(translation => {
        this.translations.push(new Translation(translation));
      });
    });
  }
}
