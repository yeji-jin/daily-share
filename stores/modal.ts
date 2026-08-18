import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

/**
 * 모달 관리 방법 (모달이 여러 개여도 store/provider는 이 파일 + modal-provider.tsx 하나씩만 유지)
 *
 * 새 모달을 추가할 때:
 * 1. 아래 ModalType에 새 키를 추가한다. (예: "postEditor" | "confirmDelete")
 * 2. components/modal/ 에 모달 컴포넌트를 만든다. props는 자유롭게 정의해도 됨.
 * 3. providers/modal-provider.tsx의 MODAL_COMPONENTS 객체에 "키: 컴포넌트"를 등록한다.
 * 4. 어디서든 useModal().open("키", { ...props }) 로 열고, useModal().close() 로 닫는다.
 *
 * -> 모달이 늘어나도 store/provider를 새로 만들 필요 없이 이 파일 하나만 건드리면 됨.
 */
export type ModalType = "postEditor" | "deletePostConfirm" | "profileEditor"; // 새 모달 추가 시 여기 유니온에 키를 추가
export type PostEditorMode = "create" | "edit";

interface ModalState {
  type: ModalType | null;
  props: Record<string, unknown>;
}

const initialState: ModalState = {
  type: null,
  props: {},
};

const useModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (type: ModalType, props: Record<string, unknown> = {}) => {
          set({ type, props });
        },
        close: () => {
          set({ type: null, props: {} });
        },
      },
    })),
    { name: "modalStore" },
  ),
);

export const useModal = () => {
  const type = useModalStore((store) => store.type);
  const props = useModalStore((store) => store.props);
  const { open, close } = useModalStore((store) => store.actions);
  return { type, props, open, close };
};
