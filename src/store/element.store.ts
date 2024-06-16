import { create } from 'zustand';
import { IElementState } from '../types/store';

type State = {
  elements: IElementState[];
};

type Action = {
  getElementsByParentKey: (parentKey: string) => IElementState[];
  addElements: (elements: IElementState[]) => void;
  addElement: (element: IElementState) => void;
  deleteElement: (key: string) => void;
  findElement: (key: string) => IElementState | undefined;
  findElementsByParentKey: (parentKey: string) => IElementState[];
  renameElement: (key: string, newName: string) => void;
  startRenaming: (key: string) => void;
  endRenaming: (key: string) => void;
  selectElement: (key: string) => void;
  unselectElement: (key: string) => void;
  getAbsolutePath: (key: string) => string;
};

const initialState: State = {
  elements: [],
};

export const useElementStore = create<State & Action>((set, get) => ({
  elements: initialState.elements,
  // Element functions
  getElementsByParentKey: (parentKey) => {
    return get().elements.filter((element) => element.parentKey === parentKey);
  },
  addElements: (elements) => {
    set((state) => {
      const filteredElements = state.elements.filter(
        (stateElement) => !elements.some((el) => el.key === stateElement.key)
      );
      state.elements = [...filteredElements, ...elements];
      return { elements: state.elements };
    });
  },
  addElement: (element) => {
    set((state) => {
      const filteredElements = state.elements.filter(
        (stateElement) => stateElement.key !== element.key
      );
      state.elements = [...filteredElements, element];
      return { elements: state.elements };
    });
  },
  deleteElement: (key) => {
    set((state) => {
      state.elements = state.elements.filter((element) => element.key !== key);
      return { elements: state.elements };
    });
  },
  findElement: (key) => {
    return get().elements.find((element) => element.key === key);
  },
  findElementsByParentKey: (parentKey) => {
    return get().elements.filter((element) => element.parentKey === parentKey);
  },
  renameElement: (key, newName) => {
    set((state) => {
      const element = state.elements.find((el) => el.key === key);
      if (element) {
        element.name = newName;
        state.elements = state.elements.map((el) =>
          el.key === key ? element : el
        );
      }
      return { elements: state.elements };
    });
  },
  startRenaming: (key) => {
    set((state) => {
      const element = state.elements.find((el) => el.key === key);
      if (element) {
        element.renaming = true;
        state.elements = state.elements.map((el) =>
          el.key === key ? element : el
        );
      }
      return { elements: state.elements };
    });
  },
  endRenaming: (key) => {
    set((state) => {
      const element = state.elements.find((el) => el.key === key);
      if (element) {
        element.renaming = false;
        state.elements = state.elements.map((el) =>
          el.key === key ? element : el
        );
      }
      return { elements: state.elements };
    });
  },
  selectElement: (key) => {
    set((state) => {
      const element = state.elements.find((el) => el.key === key);
      if (element) {
        element.selected = true;
        state.elements = state.elements.map((el) =>
          el.key === key ? element : el
        );
      }
      return { elements: state.elements };
    });
  },
  unselectElement: (key) => {
    set((state) => {
      const element = state.elements.find((el) => el.key === key);
      if (element) {
        element.selected = false;
        state.elements = state.elements.map((el) =>
          el.key === key ? element : el
        );
      }
      return { elements: state.elements };
    });
  },
  getAbsolutePath: (key) => {
    const element = get().elements.find((el) => el.key === key);
    let path = '';
    let currentElement: IElementState | undefined = element;
    while (currentElement && currentElement.parentKey !== '') {
      path = `${currentElement.name}/${path}`;
      currentElement = get().elements.find(
        (el) => el.key === currentElement?.parentKey
      );
    }
    path = path.slice(0, -1);
    path = `/${path}`;
    return path;
  },
}));
