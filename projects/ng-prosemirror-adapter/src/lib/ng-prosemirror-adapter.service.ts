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

  createComponent = <T>(options: any, _key: string = null): { componentRef: ComponentRef<T>, key: string } => {
    const componentRef = this._vcf.createComponent(options.component, {injector: this._injector}) as ComponentRef<T>;
    const key = options.key || _key || nanoid();
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
    this.nodeViewContext[key] = Object.assign(this.nodeViewContext[key] || {}, {
      setAttrs: nodeView.setAttrs,
      view: nodeView.view,
      getPos: nodeView.getPos,
      node: nodeView.node,
      selected: nodeView.selected,
      decorations: nodeView.decorations,
      innerDecorations: nodeView.innerDecorations,
      contentRef: (element: HTMLElement) => {
        if (
          element
          && element instanceof HTMLElement
          && nodeView.contentDOM
          && element.firstChild !== nodeView.contentDOM
        )
          element.appendChild(nodeView.contentDOM)
      },
    });
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
            componentRef.destroy();
            options.destroy?.();
            delete this.nodeView[key];
            delete this.nodeViewContext[key];
          },
        } as any
      });
      this.updateNodeViewContext(key);
      componentRef.instance.parentView.appendChild(componentRef.instance.el.nativeElement);
      this.nodeViewContext[key].contentRef(componentRef.instance.container);
      return this.nodeView[key];
    };
  }

  pluginView: Record<string, CorePluginView<NgProsemirrorPlugin>> = {};
  pluginViewContext: Record<string, PluginViewContext> = {};

  updatePluginViewContext(key: string, view?: EditorView, prevState?: EditorState) {
    this.pluginViewContext[key] = Object.assign(this.pluginViewContext[key] || {}, {
      view: this.pluginView[key].view || view,
      prevState: this.pluginView[key].prevState || prevState,
    });
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
            delete this.pluginViewContext[key];
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
    this.widgetViewContext[key] = Object.assign(this.widgetViewContext[key] || {}, {
      view: this.widgetView[key].view || view,
      getPos: this.widgetView[key].getPos || getPos,
      spec: this.widgetView[key].spec || spec
    });
  }

  createWidgetView: WidgetViewFactory = (options: NgWidgetUserOptions) => {
    return (pos, userSpec: any = {}) => {
      const key = options.key || nanoid();
      const spec: WidgetDecorationSpec = {
        key,
        ...userSpec,
        destroy: (node) => {
          this.widgetView[key]?.component?._ref?.destroy();
          userSpec.destroy?.(node);
          delete this.widgetViewContext[key];
          delete this.widgetView[key];
        }
      };
      return Decoration.widget(pos, (view, getPos) => {
        const {componentRef} = this.createComponent<NgProsemirrorWidget>(options, key);
        componentRef.instance._ref = componentRef;
        this.widgetView[key] = new CoreWidgetView<NgProsemirrorWidget>({
          pos,
          spec,
          options: {
            ...options,
            component: componentRef.instance
          }
        });
        this.widgetView[key].bind(view, getPos);
        this.updateWidgetViewContext(key, view, getPos, spec);
        componentRef.instance.parentView.appendChild(componentRef.instance.container);
        return this.widgetView[key].dom;
      }, spec);
    }
  }
}

