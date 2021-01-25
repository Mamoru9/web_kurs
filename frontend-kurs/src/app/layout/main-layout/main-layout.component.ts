import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthorsService} from '../../shared/services/authors.service';
import {BooksService} from '../../shared/services/books.service';
import {ResponsibleService} from '../../shared/services/responsible.service';
import {EditorsService} from '../../shared/services/editors.service';
import {TranslatorsService} from '../../shared/services/translators.service';
import {TranslationsService} from '../../shared/services/translations.service';
import {Observable, Subject} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Author} from '../../shared/models/author';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent implements OnInit {

  isLoad = new Subject<boolean>();
  loader = true;
  form: FormGroup;
  filteredLastNameAuthor: Observable<Author[]>;

  constructor(private authorsService: AuthorsService, private booksService: BooksService,
              private responsibleService: ResponsibleService, private editorsService: EditorsService,
              private translatorsService: TranslatorsService, private translationsService: TranslationsService,
              private cdr: ChangeDetectorRef, private formBuilder: FormBuilder) {
  }

  async ngOnInit() {
    this.isLoad.subscribe(val => {
      this.loader = val;
      this.cdr.markForCheck();
    });
    this.form = this.formBuilder.group({
      lastNameAuthor: [null]
    });
    await this.authorsService.getAuthors();
    await this.booksService.getBooks();
    await this.responsibleService.getResponsible();
    await this.editorsService.getEditors();
    await this.translatorsService.getTranslators();
    await this.translationsService.getTranslations();
    this.isLoad.next(false);
    this.filteredLastNameAuthor = this.form.controls.lastNameAuthor.valueChanges.pipe(
      startWith(''),
      map(value => this.authorsService.filterAuthorLastName(value))
    )
  }
}
