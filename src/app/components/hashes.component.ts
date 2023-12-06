import {Component} from '@angular/core';
import {
  NgProsemirrorWidget
} from "../../../projects/ng-prosemirror-adapter/src/lib/components/ng-prosemirror-widget.component";

@Component({
  selector: 'hashes',
  template: `
      <span class="hash">{{ hashes }}</span>`,
  styles: [`
    .hash {
      color: blue;
      margin-right: 6px;
    }`],
  standalone: true
})
export class Hashes extends NgProsemirrorWidget {
  get level() {
    return this.spec?.['level'];
  }

  get hashes() {
    return Array(this.level || 0).fill('#').join('');
  }
}
