import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function formatTimeAgo(time: Date | string | number) {
  return formatDistanceToNow(new Date(time), { addSuffix: true, locale: ko });
}
