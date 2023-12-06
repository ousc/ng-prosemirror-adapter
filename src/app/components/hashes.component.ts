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
  /**
   * Getter for the `level` property.
   * It returns the level attribute of the node.
   * The `spec` property is accessed using optional chaining to avoid errors when they are undefined.
   * @returns {number | undefined} The level of the node, or undefined if `node` or `attrs` is undefined.
   */
  get level(): number | undefined {
    return this.spec?.['level'];
  }

  /**
   * Getter for the `hashes` property.
   * It creates an array of size equal to the `level` property or 0 if `level` is undefined.
   * Each element of the array is filled with the '#' character.
   * The array is then joined into a string with no separator.
   * @returns {string} A string of '#' characters of length equal to the `level` property, or an empty string if `level` is undefined.
   */
  get hashes() {
    return Array(this.level || 0).fill('#').join('');
  }
}
