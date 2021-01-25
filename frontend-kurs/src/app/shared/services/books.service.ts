import { Injectable } from '@angular/core';
import {Book} from '../models/book';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private url = 'http://localhost:8080/api/v1/';
  books: Book[];

  constructor(private http: HttpClient) { }

  async getBooks() {
    this.books = [];
    await this.http.get<any>(this.url + 'books').subscribe(res => {
      res.forEach(book => {
        this.books.push(new Book(book));
      });
    });
  }
}
