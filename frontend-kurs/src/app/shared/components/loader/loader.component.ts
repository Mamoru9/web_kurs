import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  @Input() position = 'fixed';
  @Input() zIndex = 2147483647;
  constructor() { }

}
