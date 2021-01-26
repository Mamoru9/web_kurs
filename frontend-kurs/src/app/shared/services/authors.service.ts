import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Author} from '../models/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  private url = 'http://localhost:8080/api/v1/';
  authors: Author[];

  constructor(private http: HttpClient) { }

  async getAuthors() {
    this.authors = [];
    await this.http.get<any>(this.url + 'authors').subscribe(res => {
      res.forEach(author => {
        this.authors.push(new Author(author));
      });
    });
  }

  filterAuthorByName(firstName: string, lastName: string, middleName: string, field: any): string[] {
    if (firstName === '' && lastName === '' && middleName === '') {
      return this.authors.map(author => author[field]);
    }

    return  this.authors.filter(author => firstName === '' ? author : author.firstName.toLowerCase().indexOf(firstName.toLowerCase()) === 0)
      .filter(author => lastName === '' ? author : author.lastName.toLowerCase().indexOf(lastName.toLowerCase()) === 0)
      .filter(author => middleName === '' ? author : author.middleName.toLowerCase().indexOf(middleName.toLowerCase()) === 0)
      .map(author => author[field]);
  }
}
