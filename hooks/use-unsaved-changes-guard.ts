import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 저장 안 된 변경사항이 있을 때, 브라우저 뒤로가기 / 명시적 닫기 시도를
 * 그냥 진행시키지 않고 확인(alert)을 한 번 거치게 하는 훅.
 *
 * - hasUnsavedChanges: 지금 "나가면 사라지는 내용"이 있는지
 * - onDiscard: 사용자가 "그래도 나가기"를 선택했을 때 실행할 함수 (보통 모달 close())
 *
 * @example
 * const [value, setValue] = useState(initialValue);
 * const hasUnsavedChanges = value !== initialValue;
 *
 * const { isConfirmOpen, setIsConfirmOpen, requestClose, confirmDiscard } =
 *   useUnsavedChangesGuard({
 *     hasUnsavedChanges,
 *     onDiscard: () => close(), // 모달 닫기 등 실제로 나가는 동작
 *   });
 *
 * return (
 *   <>
 *     <Dialog open onOpenChange={(open) => !open && requestClose()}>
 *       ...
 *     </Dialog>
 *     <AlertModal
 *       open={isConfirmOpen}
 *       onOpenChange={setIsConfirmOpen}
 *       title="저장 안 된 변경사항이 있어요"
 *       description="지금 나가면 변경사항이 사라져요. 그래도 나가시겠어요?"
 *       onConfirm={confirmDiscard}
 *     />
 *   </>
 * );
 */
export function useUnsavedChangesGuard({
  hasUnsavedChanges,
  onDiscard,
}: {
  hasUnsavedChanges: boolean;
  onDiscard: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  hasUnsavedChangesRef.current = hasUnsavedChanges;

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // 뒤로가기 한 번을 "흡수"할 더미 history entry를 쌓아둔다.
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (!hasUnsavedChangesRef.current) return;

      // 실제로 페이지를 벗어나지 않도록 더미 entry를 다시 쌓고, 확인 alert를 띄운다.
      window.history.pushState(null, "", window.location.href);
      setIsConfirmOpen(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hasUnsavedChanges]);

  const requestClose = useCallback(() => {
    if (hasUnsavedChangesRef.current) {
      setIsConfirmOpen(true);
      return;
    }
    onDiscard();
  }, [onDiscard]);

  const confirmDiscard = useCallback(() => {
    setIsConfirmOpen(false);
    onDiscard();
  }, [onDiscard]);

  return { isConfirmOpen, setIsConfirmOpen, requestClose, confirmDiscard };
}
