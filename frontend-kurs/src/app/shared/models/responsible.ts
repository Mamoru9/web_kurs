export class Responsible {
  editorId: number;
  bookId: number;

  constructor(source = null) {
    if (source === null) {
      return;
    }

    this.editorId = source.editorId || null;
    this.bookId = source.bookId || null;
  }
}
