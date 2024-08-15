import {Component} from '@angular/core';
import {
  NgProsemirrorNode
} from "../../../projects/ng-prosemirror-adapter/src/lib/components/ng-prosemirror-node.component";

@Component({
  selector: 'heading',
  template: `
      <div [class]="'heading h'+level" #contentRef>
          <ng-content></ng-content>
      </div>
  `,
  standalone: true
})
export class Heading extends NgProsemirrorNode {
  /**
   * Getter for the `level` property.
   * It returns the level attribute of the node.
   * The `node` and `attrs` properties are accessed using optional chaining to avoid errors when they are undefined.
   * @returns {number | undefined} The level of the node, or undefined if `node` or `attrs` is undefined.
   */
  get level(): number | undefined {
    return this.node?.attrs?.['level'];
  }
}
