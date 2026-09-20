import { InkColor, PaperStyle } from "./index";
import { PageBlock } from "./creative";

export interface DiaryPageData {
  id: string;
  pageNumber: number;
  date?: string;
  dayOfWeek?: string;
  title?: string;
  content: string;
  blocks?: PageBlock[];
  mood?: string;
  ink?: InkColor;
  paperStyle?: PaperStyle;
  isCover?: boolean;
  entryId?: string;
}
