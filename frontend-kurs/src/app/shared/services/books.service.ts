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

  getBooksTitleById(ids: number[]): string[] {
    return this.books.map(book => {
      if (ids.find(id => id === book.id)) {
        return book.title;
      }
    });
  }

  getBookByTitle(title: string): Book {
    return this.books.find(book => book.title === title);
  }

  async addBook(book: any): Promise<any> {
    await this.http.post<any>(this.url + 'book', book).subscribe(res => {
      this.getBooks();
    });
  }

  getBooksByAuthorId(authorId: number): Book[] {
    return this.books.filter(book => book.authorId === authorId);
  }

  getBook(title: string, place: string, edition: string, year: string, numberOfPage: number, authorId: number): Book {
    return this.books.find(book => book.title === title && book.place === place && book.edition === edition && book.year === year && book.numberOfPage === numberOfPage && book.authorId === authorId);
  }
}
