import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthorsService} from '../shared/services/authors.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Author} from '../shared/models/author';
import {EditorsService} from '../shared/services/editors.service';
import {Editor} from '../shared/models/editor';
import {TranslatorsService} from '../shared/services/translators.service';
import {Translator} from '../shared/models/translator';
import {ResponsibleService} from '../shared/services/responsible.service';
import {TranslationsService} from '../shared/services/translations.service';
import {Book} from '../shared/models/book';

@Component({
  selector: 'app-gost-modal',
  templateUrl: './gost-modal.component.html',
  styleUrls: ['./gost-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GostModalComponent implements OnInit {

  filteredLastNameAuthor: Observable<string[]>;
  filteredFirstNameAuthor: Observable<string[]>;
  filteredMiddleNameAuthor: Observable<string[]>;
  filteredLastNameEditor: Observable<string[]>;
  filteredFirstNameEditor: Observable<string[]>;
  filteredMiddleNameEditor: Observable<string[]>;
  filteredLastNameTranslator: Observable<string[]>;
  filteredFirstNameTranslator: Observable<string[]>;
  filteredMiddleNameTranslator: Observable<string[]>;
  currentAuthor: Author;
  currentEditors: Editor[] = [];
  currentTranslators: Translator[] = [];
  form: FormGroup;
  modalTitle: string;
  nextStepButtonText: string;
  isAddButton = false;
  isError = false;
  errorText = 'Заполните все поля';
  isAuthorStep = true;
  isEditorsStep = false;
  isTranslatorsStep = false;
  isSelectBookStep = false;
  isAddBookStep = false;
  isBooksStep: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  books: Book[] = [];

  constructor(private authorsService: AuthorsService, private fb: FormBuilder, private editorsService: EditorsService,
              private translatorsService: TranslatorsService, private responsibleService: ResponsibleService,
              private translationsService: TranslationsService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      lastNameAuthor: [''],
      firstNameAuthor: [''],
      middleNameAuthor: [''],
      lastNameEditor: [''],
      firstNameEditor: [''],
      middleNameEditor: [''],
      lastNameTranslator: [''],
      firstNameTranslator: [''],
      middleNameTranslator: ['']
    });

    this.filteredLastNameAuthor = this.form.controls.lastNameAuthor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.authorsService.filterAuthorByName(this.form.controls.firstNameAuthor.value, value, this.form.controls.middleNameAuthor.value, 'lastName'))
    );
    this.filteredFirstNameAuthor = this.form.controls.firstNameAuthor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.authorsService.filterAuthorByName(value, this.form.controls.lastNameAuthor.value, this.form.controls.middleNameAuthor.value, 'firstName'))
    );
    this.filteredMiddleNameAuthor = this.form.controls.middleNameAuthor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.authorsService.filterAuthorByName(this.form.controls.firstNameAuthor.value, this.form.controls.lastNameAuthor.value, value, 'middleName'))
    );
    this.filteredLastNameEditor = this.form.controls.lastNameEditor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.editorsService.filterEditorByName(this.form.controls.firstNameEditor.value, value, this.form.controls.middleNameEditor.value, 'lastName'))
    );
    this.filteredFirstNameEditor = this.form.controls.firstNameEditor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.editorsService.filterEditorByName(value, this.form.controls.lastNameEditor.value, this.form.controls.middleNameEditor.value, 'firstName'))
    );
    this.filteredMiddleNameEditor = this.form.controls.middleNameEditor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.editorsService.filterEditorByName(this.form.controls.firstNameEditor.value, this.form.controls.lastNameEditor.value, value, 'middleName'))
    );
    this.filteredLastNameTranslator = this.form.controls.lastNameTranslator.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.translatorsService.filterTranslatorByName(this.form.controls.firstNameTranslator.value, value, this.form.controls.middleNameTranslator.value, 'lastName'))
    );
    this.filteredFirstNameTranslator = this.form.controls.firstNameTranslator.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.translatorsService.filterTranslatorByName(value, this.form.controls.lastNameTranslator.value, this.form.controls.middleNameTranslator.value, 'firstName'))
    );
    this.filteredMiddleNameTranslator = this.form.controls.middleNameTranslator.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.translatorsService.filterTranslatorByName(this.form.controls.firstNameTranslator.value, this.form.controls.lastNameTranslator.value, value, 'middleName'))
    );

    this.isBooksStep.subscribe(value => {
      if (value) {
        let editorsBooks = [];
        let translatorsBooks = [];
        if (this.currentEditors.length) {
          this.currentEditors = this.currentEditors.map(editor => this.editorsService.findEditor(editor.firstName, editor.lastName, editor.middleName));
          editorsBooks = this.responsibleService.findByEditorIds(this.currentEditors.map(editor => editor.id));
        }
        if (this.currentTranslators) {
          this.currentTranslators = this.currentTranslators.map(translator => this.translatorsService.findTranslator(translator.firstName, translator.lastName, translator.middleName));
          translatorsBooks = this.translationsService.findByTranslatorIds(this.currentTranslators.map(translators => translators.id));
        }
        this.books = editorsBooks.filter(eBook => translatorsBooks.includes(eBook));
        if (this.books.length) {
          this.modalTitle = 'Выбрать литератутру из существующих';
          this.isSelectBookStep = true;
        } else {
          this.modalTitle = 'Добавить новую литературу';
          this.isAddBookStep = true;
        }
      }
    });

    this.modalTitle = 'Введите ФИО автора';
    this.nextStepButtonText = 'Далее';
  }

  async nextButtonClick() {
    if (this.isAuthorStep) {
      const firstName = this.form.controls.firstNameAuthor.value;
      const lastName = this.form.controls.lastNameAuthor.value;
      const middleName = this.form.controls.middleNameAuthor.value;
      if (firstName === '' || lastName === '') {
        this.isError = true;
      } else {
        this.currentAuthor = this.authorsService.findAuthor(firstName, lastName, middleName);
        if (!this.currentAuthor) {
          await this.authorsService.addAuthor({firstName, lastName, middleName});
          this.currentAuthor = new Author({firstName, lastName, middleName});
        }
        this.modalTitle = 'Добавте ответственных';
        this.isAuthorStep = this.isError = false;
        this.isEditorsStep = this.isAddButton = true;
      }
    } else if (this.isEditorsStep) {
      this.modalTitle = 'Добавте переводчиков';
      this.isEditorsStep = this.isError = false;
      this.isTranslatorsStep = true;
    } else if (this.isTranslatorsStep) {
      this.isTranslatorsStep = this.isError = false;
      this.isBooksStep.next(true);
    }
  }

  async addButtonClick() {
    if (this.isEditorsStep) {
      const firstName = this.form.controls.firstNameEditor.value;
      const lastName = this.form.controls.lastNameEditor.value;
      const middleName = this.form.controls.middleNameEditor.value;
      if (firstName === '' || lastName === '') {
        this.isError = true;
      } else {
        let currentEditor = this.editorsService.findEditor(firstName, lastName, middleName);
        if (!currentEditor) {
          await this.editorsService.addEditor({firstName, lastName, middleName});
          currentEditor = new Editor({firstName, lastName, middleName});
          this.currentEditors.push(currentEditor);
        } else if (!this.currentEditors.find(editor => editor.firstName === currentEditor.firstName && editor.lastName === currentEditor.lastName && editor.middleName)) {
          this.currentEditors.push(currentEditor);
        }
        this.form.controls.firstNameEditor.setValue('');
        this.form.controls.lastNameEditor.setValue('');
        this.form.controls.middleNameEditor.setValue('');
        this.isError = false;
      }
    } else if (this.isTranslatorsStep) {
      const firstName = this.form.controls.firstNameTranslator.value;
      const lastName = this.form.controls.lastNameTranslator.value;
      const middleName = this.form.controls.middleNameTranslator.value;
      if (firstName === '' || lastName === '') {
        this.isError = true;
      } else {
        let currentTranslator = this.translatorsService.findTranslator(firstName, lastName, middleName);
        if (!currentTranslator) {
          await this.translatorsService.addTranslator({firstName, lastName, middleName});
          currentTranslator = new Translator({firstName, lastName, middleName});
          this.currentTranslators.push(currentTranslator);
        } else if (!this.currentTranslators.find(translator => translator.firstName === currentTranslator.firstName && translator.lastName === currentTranslator.lastName && translator.middleName === currentTranslator.middleName)) {
          this.currentTranslators.push(currentTranslator);
        }
        this.form.controls.firstNameTranslator.setValue('');
        this.form.controls.lastNameTranslator.setValue('');
        this.form.controls.middleNameTranslator.setValue('');
        this.isError = false;
      }
    }
  }

}
