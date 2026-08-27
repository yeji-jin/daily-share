import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import type { ComponentType } from "react";

/**
 * 모달 관리 방법 (모달이 여러 개여도 store/provider는 이 파일 + modal-provider.tsx 하나씩만 유지)
 *
 * 새 모달을 추가할 때:
 * 1. components/modal/ 에 모달 컴포넌트를 만든다. props는 자유롭게 정의해도 됨.
 * 2. 그 모달을 쓰는 곳에서 컴포넌트를 직접 import해서 useModal().open(컴포넌트, { ...props }) 로 연다.
 *    props는 그 컴포넌트가 실제로 요구하는 타입과 제네릭으로 검사됨.
 * 3. useModal().close() 로 닫는다.
 *
 * -> 별도 레지스트리 파일이 없음. 어떤 모달을 어디서 여는지는 각 호출부의 import만 보면 됨.
 */
export type PostEditorMode = "create" | "edit";

interface ModalState {
  // 스토어는 "어떤 모달이든" 담을 수 있어야 해서 여기서만 의도적으로 any로 완화.
  // open()의 제네릭이 호출 시점엔 실제 props 타입을 정확히 검사해주므로 안전함.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any> | null;
  props: Record<string, unknown>;
}

const initialState: ModalState = {
  Component: null,
  props: {},
};

const useModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: <P extends object>(Component: ComponentType<P>, props: P) => {
          set({ Component, props: props as Record<string, unknown> });
        },
        close: () => {
          set({ Component: null, props: {} });
        },
      },
    })),
    { name: "modalStore" },
  ),
);

export const useModal = () => {
  const Component = useModalStore((store) => store.Component);
  const props = useModalStore((store) => store.props);
  const { open, close } = useModalStore((store) => store.actions);
  return { Component, props, open, close };
};
