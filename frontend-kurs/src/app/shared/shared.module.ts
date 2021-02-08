import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { MapFunPipe } from './pipes/map-fun.pipe';



@NgModule({
  declarations: [LoaderComponent, MapFunPipe],
    exports: [
        LoaderComponent,
        MapFunPipe
    ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class SharedModule { }
