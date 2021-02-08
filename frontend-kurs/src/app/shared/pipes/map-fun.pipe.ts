import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapFunPipe',
  pure: true
})
export class MapFunPipe implements PipeTransform {

  transform(value: any, fun: Function, args: any[] = []): any {
    return fun(value, args);
  }

}
