import { setup } from './dom/document'
import { addListeners } from './dom/events'
import { DEFAULT_SETTINGS, type Settings } from './settings'
import { createUseCases } from './use-cases'

type Littlefoot = Readonly<{
  activate: (id: string) => void
  dismiss: (id?: string) => void
  unmount: () => void
  getSetting: <K extends keyof Settings>(key: K) => Settings[K]
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}>

export function littlefoot(userSettings: Partial<Settings> = {}): Littlefoot {
  const settings = { ...DEFAULT_SETTINGS, ...userSettings }
  const useCases = createUseCases<HTMLElement>(setup(settings), settings)
  const removeListeners = addListeners(useCases)

  return {
    activate(id) {
      useCases.activate(id)
    },

    dismiss(id) {
      if (id === undefined) {
        useCases.dismissAll()
      } else {
        useCases.dismiss(id)
      }
    },

    unmount() {
      removeListeners()
      useCases.unmount()
    },

    getSetting(key) {
      return settings[key]
    },

    updateSetting(key, value) {
      settings[key] = value
    },
  }
}

export default littlefoot
