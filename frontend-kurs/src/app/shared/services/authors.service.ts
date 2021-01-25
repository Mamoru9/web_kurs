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

  filterAuthorLastName(value: string): Author[] {
    const filterValue = value.toLowerCase();
    return this.authors
      .filter(author => author.lastName.toLowerCase().indexOf(filterValue));
  }
}
