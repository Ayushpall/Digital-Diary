import { InkColor, PaperStyle } from "./index";

export interface DiaryPageData {
  id: string;
  pageNumber: number;
  date?: string;
  dayOfWeek?: string;
  title?: string;
  content: string;
  mood?: string;
  ink?: InkColor;
  paperStyle?: PaperStyle;
  isCover?: boolean;
}
