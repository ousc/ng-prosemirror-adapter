import {ComponentRef, Type} from "@angular/core";
import type {Attrs, Node} from 'prosemirror-model'
import {Decoration, DecorationSource, EditorView, NodeViewConstructor} from "prosemirror-view";
import type {EditorState} from "prosemirror-state";
import type {
  PluginViewSpec,
  WidgetDecorationFactory,
  WidgetDecorationSpec
} from "@prosemirror-adapter/core";
import {NgProsemirrorNode} from "./components/ng-prosemirror-node.component";
import {NgProsemirrorPlugin} from "./components/ng-prosemirror-plugin.component";
import {NgProsemirrorWidget} from "./components/ng-prosemirror-widget.component";


export type NgEditorViewComponent = ComponentRef<any>
export type NgNodeViewUserOptions = {
  component: Type<NgProsemirrorNode>
  as?: string | HTMLElement
  contentAs?: string | HTMLElement
  update?: (node: Node, decorations: readonly Decoration[], innerDecorations: DecorationSource) => boolean | void
  ignoreMutation?: (mutation: MutationRecord) => boolean | void
  selectNode?: () => void
  deselectNode?: () => void
  setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void
  stopEvent?: (event: Event) => boolean
  destroy?: () => void

  // Additional
  onUpdate?: () => void
  inputs?: {
    [key: string]: any
  },
  key?: string
}

export type NodeViewFactory = (options: NgNodeViewUserOptions) => NodeViewConstructor

export type NodeViewContentRef = (node: HTMLElement | null) => void

export interface NodeViewContext {
  // won't change
  contentRef: NodeViewContentRef
  view: EditorView
  getPos: () => number | undefined
  setAttrs: (attrs: Attrs) => void

  // changes between updates
  node: Node
  selected: boolean
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource
}

export type NgPluginViewUserOptions = {
  component: Type<NgProsemirrorPlugin>
  root?: (viewDOM: HTMLElement) => HTMLElement
  update?: (view: EditorView, prevState: EditorState) => void
  destroy?: () => void,
  inputs?: {
    [key: string]: any
  },
  key?: string
}

export type PluginViewFactory = (options: NgPluginViewUserOptions) => Promise<PluginViewSpec>

export interface PluginViewContext {
  view: EditorView
  prevState: EditorState
}

export type NgWidgetUserOptions = {
  as: string | HTMLElement
  component: Type<NgProsemirrorWidget>,
  inputs?: {
    [key: string]: any
  },
  key?: string
}

export type WidgetViewFactory = (options: NgWidgetUserOptions) => WidgetDecorationFactory

export interface WidgetViewContext {
  view: EditorView
  getPos: () => number | undefined
  spec?: WidgetDecorationSpec
}
