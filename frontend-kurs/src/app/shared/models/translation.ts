export class Translation {
  translatorId: number;
  bookId: number;

  constructor(source = null) {
    if (source === null) {
      return;
    }

    this.translatorId = source.translatorId || null;
    this.bookId = source.bookId || null;
  }
}
