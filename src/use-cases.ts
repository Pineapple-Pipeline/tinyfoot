type ActionCallback<T> = (popover: T, button: T) => void

export type UseCaseSettings<T> = Readonly<{
  activateCallback?: ActionCallback<T>
  allowMultiple: boolean
  dismissCallback?: ActionCallback<T>
  dismissOnDocumentTouch: boolean
}>

export type Footnote<T> = Readonly<{
  id: string
  activate: (onActivate?: ActionCallback<T>) => void
  destroy: () => void
  dismiss: (onDeactivate?: ActionCallback<T>) => void
  isActive: () => boolean
  isReady: () => boolean
  ready: () => void
  remove: () => void
  reposition: () => void
  resize: () => void
}>

export type FootnoteAction = (id: string) => void

export type UseCases = Readonly<{
  activate: FootnoteAction
  dismiss: FootnoteAction
  dismissAll: () => void
  touchOutside: () => void
  repositionAll: () => void
  resizeAll: () => void
  toggle: FootnoteAction
  unmount: () => void
}>

export interface Adapter<T> {
  readonly footnotes: readonly Footnote<T>[]
  readonly unmount: () => void
}

export function createUseCases<T>(
  { footnotes, unmount }: Adapter<T>,
  settings: UseCaseSettings<T>,
): UseCases {
  const dismiss = () => (footnote: Footnote<T>) => {
    if (footnote.isReady()) {
      footnote.dismiss(settings.dismissCallback)
      setTimeout(footnote.remove)
    }
  }

  const activate = () => (footnote: Footnote<T>) => {
    if (!settings.allowMultiple) {
      footnotes
        .filter((current) => current.id !== footnote.id)
        .forEach(dismiss())
    }

    if (footnote.isReady()) {
      footnote.activate(settings.activateCallback)
      footnote.reposition()
      footnote.resize()
      setTimeout(footnote.ready)
    }
  }

  const ifFound = (action: (footnote: Footnote<T>) => void) => (id: string) => {
    const footnote = footnotes.find((footnote) => footnote.id === id)
    if (footnote) {
      action(footnote)
    }
  }

  const dismissAll = () => footnotes.forEach(dismiss())

  return {
    activate: (id) => ifFound(activate())(id),

    dismiss: (id) => ifFound(dismiss())(id),

    dismissAll,

    touchOutside: () => {
      if (settings.dismissOnDocumentTouch) {
        dismissAll()
      }
    },

    repositionAll: () => footnotes.forEach((current) => current.reposition()),

    resizeAll: () => footnotes.forEach((current) => current.resize()),

    toggle: ifFound((footnote) =>
      footnote.isActive()
        ? dismiss()(footnote)
        : activate()(footnote),
    ),

    unmount,
  }
}
