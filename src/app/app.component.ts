import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {
  NgProsemirrorAdaptorProvider
} from "../../projects/ng-prosemirror-adaptor/src/lib/ng-prosemirror-adaptor.component";
import {EditorComponent} from "./components/editor/editor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgProsemirrorAdaptorProvider, EditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  visible = true;

  constructor(private cd: ChangeDetectorRef) {
  }

  render() {
    this.visible = false;
    setTimeout(() => {
      this.visible = true;
      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }
}
