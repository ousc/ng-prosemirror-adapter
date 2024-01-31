import {ComponentRef, Injectable, Injector, ViewContainerRef} from '@angular/core';
import {Decoration, EditorView} from "prosemirror-view";
import {NgProsemirrorAdapterProvider} from "./ng-prosemirror-adapter.component";
import {
  NgEditorViewComponent,
  NgNodeViewUserOptions,
  NgPluginViewUserOptions,
  NgWidgetUserOptions,
  NodeViewContext,
  NodeViewFactory,
  PluginViewContext,
  PluginViewFactory,
  WidgetViewContext,
  WidgetViewFactory
} from "./ngProsemirrorAdapter.type";
import {CoreNodeView, CorePluginView, CoreWidgetView, type WidgetDecorationSpec} from "@prosemirror-adapter/core";
import {nanoid} from "nanoid";
import {NgProsemirrorNode} from "./components/ng-prosemirror-node.component";
import {NgProsemirrorEditor} from "./components/ng-prosemirror-editor.component";
import {NgProsemirrorWidget} from "./components/ng-prosemirror-widget.component";
import {NgProsemirrorPlugin} from "./components/ng-prosemirror-plugin.component";
import {EditorState} from "prosemirror-state";

/**
 * Returns the first child element of the given HTMLElement.
 * If the HTMLElement does not have a first child element, it returns the HTMLElement itself.
 *
 * @param {HTMLElement} el - The HTMLElement to get the first child element from.
 * @returns {HTMLElement} The first child element of the given HTMLElement, or the HTMLElement itself if it does not have a first child element.
 */
export const firstElementChild = (el: HTMLElement): HTMLElement => {
  if (el.firstElementChild) {
    return el.firstElementChild as HTMLElement;
  }
  return el;
}

@Injectable()
export class NgProsemirrorAdapterService {
  constructor(
    private _injector: Injector,
    private _vcf: ViewContainerRef,
  ) {
  }

  editor: NgProsemirrorEditor;

  provider: NgProsemirrorAdapterProvider;

  nodeView: Record<string, CoreNodeView<NgEditorViewComponent>> = {};
  nodeViewContext: Record<string, NodeViewContext> = {};

  createComponent = <T>(options: any): { componentRef: ComponentRef<T>, key: string } => {
    const componentRef = this._vcf.createComponent(options.component, {injector: this._injector}) as ComponentRef<T>;
    const key = options.key || nanoid();
    Object.keys(options.inputs || {}).forEach((key) => {
      componentRef.setInput(key, options.inputs[key])
    });

    componentRef.setInput("provider", this.provider);
    componentRef.setInput("key", key);
    return {componentRef, key};
  }

  updateNodeViewContext(key: string) {
    const nodeView = this.nodeView[key];
    if (!nodeView.view) {
      return;
    }
    this.nodeViewContext[key] = {
      ...this.nodeViewContext[key],
      setAttrs: nodeView.setAttrs,
      view: Object.assign(Object.create(Object.getPrototypeOf(nodeView.view)), nodeView.view),
      getPos: nodeView.getPos,
      node: nodeView.node,
      selected: nodeView.selected,
      decorations: nodeView.decorations,
      innerDecorations: nodeView.innerDecorations,
      contentRef: (element) => {
        if (
          element
          && element instanceof HTMLElement
          && nodeView.contentDOM
          && element.firstChild !== nodeView.contentDOM
        )
          firstElementChild(element).appendChild(nodeView.contentDOM)
      },
    };
  }

  createNodeView: NodeViewFactory = (options: NgNodeViewUserOptions) => {
    return (node, view, getPos, decorations, innerDecorations) => {
      const {componentRef, key} = this.createComponent<NgProsemirrorNode>(options);
      this.nodeView[key] = new CoreNodeView<NgEditorViewComponent>({
        node,
        view,
        getPos,
        decorations,
        innerDecorations,
        options: {
          ...options,
          component: componentRef,
          onUpdate: () => {
            options.onUpdate?.();
            this.updateNodeViewContext(key);
            this.nodeViewContext[key].contentRef(componentRef.instance.container);
          },
          selectNode: () => {
            options.selectNode?.();
            this.updateNodeViewContext(key);
          },
          deselectNode: () => {
            options.deselectNode?.();
            this.updateNodeViewContext(key);
          },
          destroy: () => {
            options.destroy?.();
            componentRef.destroy();
            this.updateNodeViewContext(key);
          },
        }
      });
      componentRef.instance.parentView.appendChild(componentRef.location.nativeElement);
      this.updateNodeViewContext(key);
      this.nodeViewContext[key].contentRef(componentRef.instance.container);
      return this.nodeView[key];
    };
  }

  pluginView: Record<string, CorePluginView<NgProsemirrorPlugin>> = {};
  pluginViewContext: Record<string, PluginViewContext> = {};

  updatePluginViewContext(key: string, view?: EditorView, prevState?: EditorState) {
    const pluginView = this.pluginView[key];
    if (!pluginView.view) {
      pluginView.view = view;
      pluginView.prevState = prevState;
    }
    this.pluginViewContext[key] = {
      view: pluginView.view,
      prevState: pluginView.prevState,
    };
  }

  createPluginView: PluginViewFactory = (options: NgPluginViewUserOptions) => {
    return (view: EditorView) => {
      const {componentRef, key} = this.createComponent<NgProsemirrorPlugin>(options);
      this.pluginView[key] = componentRef.instance.pluginView || new CorePluginView<NgProsemirrorPlugin>({
        view,
        options: {
          ...options,
          component: componentRef.instance,
          update: (view, prevState) => {
            options.update?.(view, prevState);
            this.updatePluginViewContext(key);
          },
          destroy: () => {
            componentRef.destroy();
            options.destroy?.()
            this.pluginView[key].destroy();
            delete this.pluginView[key];
          },
        }
      });
      this.pluginView[key].update(view, view.state);
      this.updatePluginViewContext(key, view, view.state);
      componentRef.instance.parentView.appendChild(componentRef.instance.container);
      return this.pluginView[key];
    }
  }

  widgetView: Record<string, CoreWidgetView<NgProsemirrorWidget>> = {};
  widgetViewContext: Record<string, WidgetViewContext> = {};

  updateWidgetViewContext(key: string, view?: EditorView, getPos?: () => number | undefined, spec?: WidgetDecorationSpec) {
    const widgetView = this.widgetView[key];
    widgetView.view = widgetView.view || view;
    widgetView.getPos = widgetView.getPos || getPos;
    widgetView.spec = widgetView.spec || spec;
    this.widgetViewContext[key] = {
      ...this.widgetViewContext[key],
      ...widgetView,
      spec: widgetView.spec
    };
  }

  createWidgetView: WidgetViewFactory = (options: NgWidgetUserOptions) => {
    return (pos, userSpec = {}) => {
      const {componentRef, key} = this.createComponent<NgProsemirrorWidget>(options);
      const spec: WidgetDecorationSpec = {
        key,
        ...userSpec,
        destroy: (node)=>{
          userSpec.destroy?.(node);
          componentRef.destroy();
        }
      }

      this.widgetView[key] = new CoreWidgetView<NgProsemirrorWidget>({
        pos,
        spec,
        options: {
          ...options,
          component: componentRef.instance
        }
      });

      return Decoration.widget(pos, (view, getPos) => {
        this.widgetView[key].bind(view, getPos);
        this.updateWidgetViewContext(key, view, getPos, spec);
        componentRef.instance.onUpdate.emit(this.widgetViewContext[key]);
        componentRef.instance.parentView.appendChild(componentRef.instance.container);
        return this.widgetView[key].dom;
      }, spec);
    }
  }
}

