import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {
  NgProsemirrorAdapterProvider
} from "../../projects/ng-prosemirror-adapter/src/lib/ng-prosemirror-adapter.component";
import {EditorComponent} from "./components/editor/editor.component";
import {RerenderDirective} from "./components/rerender.directive";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgProsemirrorAdapterProvider, EditorComponent, RerenderDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {

  constructor(private cd: ChangeDetectorRef) {
  }

  counter = 0;
}
