import {Component} from '@angular/core';
import {
  NgProsemirrorPlugin
} from "../../../projects/ng-prosemirror-adapter/src/lib/components/ng-prosemirror-plugin.component";

@Component({
  selector: 'size',
  template: `
      <div>Size for document: {{ size }}</div>
  `,
  styles: [],
  standalone: true
})
export class Size extends NgProsemirrorPlugin {

  /**
   * Getter for the `size` property.
   * It returns the size of the document node in the current state.
   * The `state` and `doc` properties are accessed using optional chaining to avoid errors when they are undefined.
   * @returns {number | undefined} The size of the document node, or undefined if `state` or `doc` is undefined.
   */
  get size(): number | undefined {
    return this.state?.doc?.nodeSize;
  }
}
