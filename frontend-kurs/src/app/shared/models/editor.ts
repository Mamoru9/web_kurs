export class Editor {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;

  constructor(source = null) {
    if (source === null) {
      return;
    }

    this.id = source.Id || null;
    this.firstName = source.firstName || null;
    this.lastName = source.lastName || null;
    this.middleName = source.middleName || null;
  }
}
