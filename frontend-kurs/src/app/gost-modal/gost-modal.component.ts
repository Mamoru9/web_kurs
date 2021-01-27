import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthorsService} from '../shared/services/authors.service';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Author} from '../shared/models/author';
import {EditorsService} from '../shared/services/editors.service';
import {Editor} from '../shared/models/editor';

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
  currentAuthor: Author;
  currentEditors: Editor[] = [];
  form: FormGroup;
  modalTitle: string;
  nextStepButtonText: string;
  isAddButton = false;
  isError = false;
  isSkipButton = false;
  errorText = 'Заполните все поля';
  isAuthorStep = true;
  isEditorsStep = false;

  constructor(private authorsService: AuthorsService, private fb: FormBuilder, private editorsService: EditorsService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      lastNameAuthor: [''],
      firstNameAuthor: [''],
      middleNameAuthor: [''],
      lastNameEditor: [''],
      firstNameEditor: [''],
      middleNameEditor: [''],
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
          this.currentAuthor = this.authorsService.findAuthor(firstName, lastName, middleName);
        }
        this.isAuthorStep = this.isError = false;
        this.isEditorsStep = this.isAddButton = this.isSkipButton = true;
      }
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
          currentEditor = this.editorsService.findEditor(firstName, lastName, middleName);
        }
        this.currentEditors.push(currentEditor);
        this.form.controls.firstNameEditor.setValue('');
        this.form.controls.lastNameEditor.setValue('');
        this.form.controls.middleNameEditor.setValue('');
        this.isError = false;
        console.log(this.currentEditors);
      }
    }
  }

}
