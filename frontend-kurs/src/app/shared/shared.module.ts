import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';



@NgModule({
  declarations: [LoaderComponent],
  exports: [
    LoaderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class SharedModule { }
