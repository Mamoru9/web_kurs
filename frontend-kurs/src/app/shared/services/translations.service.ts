import { Injectable } from '@angular/core';
import {Translation} from '../models/translation';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {

  private url = 'http://localhost:80/api/v1/';
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

  findByTranslatorIds(ids: number[]): number[] {
    let result = [];
    ids.forEach((id, index) => {
      const temp = this.translations.filter(trans => trans.translatorId === id);
      result = index === 0 ? temp : result.concat(temp.filter(value => result.includes(value)));
    });
    return result.map(value => value.bookId);
  }

  async addTranslations(trans: any): Promise<any> {
    await this.http.post<any>(this.url + 'translation', trans).subscribe(res => {
      this.getTranslations();
    });
  }
}
