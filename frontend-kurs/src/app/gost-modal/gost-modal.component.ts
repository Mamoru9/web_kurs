import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthorsService} from '../shared/services/authors.service';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

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
  authorForm: FormGroup;

  constructor(private authorsService: AuthorsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.authorForm = this.fb.group({
      lastNameAuthor: [''],
      firstNameAuthor: [''],
      middleNameAuthor: ['']
    });

    this.filteredLastNameAuthor = this.authorForm.controls.lastNameAuthor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.authorsService.filterAuthorByName(this.authorForm.controls.firstNameAuthor.value, value, this.authorForm.controls.middleNameAuthor.value, 'lastName'))
    );
    this.filteredFirstNameAuthor = this.authorForm.controls.firstNameAuthor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.authorsService.filterAuthorByName(value, this.authorForm.controls.lastNameAuthor.value, this.authorForm.controls.middleNameAuthor.value, 'firstName'))
    );
    this.filteredMiddleNameAuthor = this.authorForm.controls.middleNameAuthor.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.authorsService.filterAuthorByName(this.authorForm.controls.firstNameAuthor.value, this.authorForm.controls.lastNameAuthor.value, value, 'middleName'))
    );
  }

}
