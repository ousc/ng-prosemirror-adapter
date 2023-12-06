import {Component} from '@angular/core';
import {
  NgProsemirrorPlugin
} from "../../../projects/ng-prosemirror-adaptor/src/lib/components/ng-prosemirror-plugin.component";

@Component({
  selector: 'size',
  template: `
      <div>Size for document: {{ size }}</div>
  `,
  styles: [],
  standalone: true
})
export class Size extends NgProsemirrorPlugin {

  get size() {
    return this.state?.doc?.nodeSize
  }
}
