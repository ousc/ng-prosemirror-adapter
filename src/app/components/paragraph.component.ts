import {Component} from '@angular/core';
import {
  NgProsemirrorNode
} from "../../../projects/ng-prosemirror-adapter/src/lib/components/ng-prosemirror-node.component";

@Component({
  selector: 'paragraph',
  template: `
      <div role="presentation" [class.selected]="selected" #contentRef></div>
  `,
  styles: [`
    :host .selected {
      outline: blue solid 1px;
    }
  `],
  standalone: true
})
export class Paragraph extends NgProsemirrorNode {}
