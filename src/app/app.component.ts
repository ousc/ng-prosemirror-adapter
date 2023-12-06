import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {
  NgProsemirrorAdapterProvider
} from "../../projects/ng-prosemirror-adapter/src/lib/ng-prosemirror-adapter.component";
import {EditorComponent} from "./components/editor/editor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgProsemirrorAdapterProvider, EditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  visible = true;

  constructor(private cd: ChangeDetectorRef) {
  }

  /**
   * The `render` method is used to refresh the component view.
   * Initially, it sets the `visible` property to false, hiding the component.
   * Then, it sets a timeout that after its completion, sets the `visible` property back to true, making the component visible again.
   * Finally, it marks the component for check and triggers change detection to update the view.
   */
  render() {
    this.visible = false; // Hide the component initially

    setTimeout(() => {
      this.visible = true; // Make the component visible after the timeout

      // Mark the component for check and trigger change detection
      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }
}
