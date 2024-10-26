import { FileType } from "@/interfaces/file";
import { createSerialKey, parseSerialKey } from "@/utils/serial_key";
import { create } from "zustand";

export type State = {
  selectedFileSerials: string[];
  highlightedFile: {
    fileKey: string;
    windowKey: string;
    fileName: string;
    type: FileType;
    ref: React.RefObject<HTMLElement>;
  } | null;
  fileRefs: Map<string, React.RefObject<HTMLElement>>;
  fileIconRefs: Map<string, React.RefObject<HTMLElement>>;
};

export type Action = {
  selectFile: (fileKey: string, windowKey: string) => void;
  unselectFile: (fileKey: string, windowKey: string) => void;
  unselectAllFiles: () => void;
  isFileKeySelected: (fileKey: string) => boolean;
  setHighlightedFile: (highlightedFile: State["highlightedFile"]) => void;
  setFileIconRef: (
    fileKey: string,
    windowKey: string,
    ref: React.RefObject<HTMLElement>,
  ) => void;
  getSelectedFileKeys: () => string[];
};

const initialState: State = {
  selectedFileSerials: [],
  highlightedFile: null,
  fileRefs: new Map(),
  fileIconRefs: new Map(),
};

export const useFileStore = create<State & Action>((set, get) => ({
  selectedFileSerials: initialState.selectedFileSerials,
  highlightedFile: initialState.highlightedFile,
  fileRefs: initialState.fileRefs,
  fileIconRefs: initialState.fileIconRefs,
  selectFile: (fileKey, windowKey) => {
    set((state) => {
      const serialKey = createSerialKey(fileKey, windowKey);
      if (!state.selectedFileSerials.includes(serialKey)) {
        state.selectedFileSerials = [...state.selectedFileSerials, serialKey];
      }
      return { selectedFileSerials: state.selectedFileSerials };
    });
  },
  unselectFile: (fileKey, windowKey) => {
    const serialKey = createSerialKey(fileKey, windowKey);
    set((state) => {
      state.selectedFileSerials = state.selectedFileSerials.filter(
        (k) => k !== serialKey,
      );
      return { selectedFileSerials: state.selectedFileSerials };
    });
  },
  unselectAllFiles: () => {
    set({ selectedFileSerials: [] });
  },
  isFileKeySelected: (fileKey) => {
    return get().selectedFileSerials.some((key) => key.startsWith(fileKey));
  },
  setHighlightedFile: (highlightedFile) => {
    set({ highlightedFile });
  },
  setFileIconRef: (fileKey, windowKey, ref) => {
    const serialKey = createSerialKey(fileKey, windowKey);
    set((state) => {
      state.fileIconRefs.set(serialKey, ref);
      return { fileIconRefs: state.fileIconRefs };
    });
  },
  getSelectedFileKeys: () => {
    // delete duplicated file keys
    const fileKeys = new Set<string>();
    get().selectedFileSerials.forEach((serial) => {
      const { fileKey } = parseSerialKey(serial);
      fileKeys.add(fileKey);
    });
    return Array.from(fileKeys);
  },
}));
