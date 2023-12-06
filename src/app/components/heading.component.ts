import { Component } from '@angular/core';
import {
  NgProsemirrorNode
} from "../../../projects/ng-prosemirror-adapter/src/lib/components/ng-prosemirror-node.component";

@Component({
  selector: 'heading',
  template: `
      @if (level === 1) {
        <h1><ng-content></ng-content></h1>
      }
      @else if (level === 2) {
        <h2><ng-content></ng-content></h2>
      }
      @else if (level === 3) {
        <h3><ng-content></ng-content></h3>
      }
      @else if (level === 4) {
        <h4><ng-content></ng-content></h4>
      }
      @else if (level === 5) {
        <h5><ng-content></ng-content></h5>
      }
      @else if (level === 6) {
        <h6><ng-content></ng-content></h6>
      }
  `,
  styles: [],
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
