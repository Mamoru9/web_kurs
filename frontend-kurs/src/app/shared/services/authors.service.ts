import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Author} from '../models/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  private url = 'http://localhost:80/api/v1/';
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
      if (field === 'middleName') {
        return this.authors.filter(author => !!author.middleName).map(author => author.middleName);
      }
      return this.authors.map(author => author[field]);
    }

    return  this.authors.filter(author => firstName === '' ? author : author.firstName.toLowerCase().indexOf(firstName.toLowerCase()) === 0)
      .filter(author => lastName === '' ? author : author.lastName.toLowerCase().indexOf(lastName.toLowerCase()) === 0)
      .filter(author => middleName !== '' && author.middleName.toLowerCase().indexOf(middleName.toLowerCase()) === 0)
      .map(author => author[field]);
  }

  async addAuthor(author: any) {
    await this.http.post<any>(this.url + 'author', author).subscribe(res => {
      this.getAuthors();
    });
  }

  findAuthor(firstName: string, lastName: string, middleName): Author {
    return this.authors.find(author => author.firstName === firstName && author.lastName === lastName && author.middleName === middleName);
  }
}
