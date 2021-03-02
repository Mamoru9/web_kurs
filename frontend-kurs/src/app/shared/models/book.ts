export class Book {
  id: number;
  title: string;
  place: string;
  edition: string;
  year: string;
  numberOfPage: number;
  authorId: number;

  constructor(source = null) {
    if (source === null) {
      return;
    }

    this.id = source.Id || null;
    this.title = source.title || null;
    this.place = source.place || null;
    this.edition = source.edition || null;
    this.year = source.year || null;
    this.numberOfPage = source.numberOfPage || null;
    this.authorId = source.authorId || null;
  }
}
