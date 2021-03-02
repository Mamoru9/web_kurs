import { Injectable } from '@angular/core';
import {Translator} from '../models/translator';
import {HttpClient} from '@angular/common/http';
import {Author} from '../models/author';

@Injectable({
  providedIn: 'root'
})
export class TranslatorsService {

  private url = 'http://localhost:80/api/v1/';
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

  filterTranslatorByName(firstName: string, lastName: string, middleName: string, field: any): string[] {
    if (firstName === '' && lastName === '' && middleName === '') {
      if (field === 'middleName') {
        return this.translators.filter(author => !!author.middleName).map(author => author.middleName);
      }
      return this.translators.map(author => author[field]);
    }

    return  this.translators.filter(translator => firstName === '' ? translator : translator.firstName.toLowerCase().indexOf(firstName.toLowerCase()) === 0)
      .filter(translator => lastName === '' ? translator : translator.lastName.toLowerCase().indexOf(lastName.toLowerCase()) === 0)
      .filter(translator => middleName !== '' && translator.middleName.toLowerCase().indexOf(middleName.toLowerCase()) === 0)
      .map(translator => translator[field]);
  }

  findTranslator(firstName: string, lastName: string, middleName): Author {
    return this.translators.find(translator => translator.firstName === firstName && translator.lastName === lastName && translator.middleName === middleName);
  }

  async addTranslator(translator: any) {
    await this.http.post<any>(this.url + 'translator', translator).subscribe(res => {
      this.getTranslators();
    });
  }
}
