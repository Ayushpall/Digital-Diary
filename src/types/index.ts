export type InkColor = "midnight" | "carbon" | "sepia";

export interface InkOption {
  id: InkColor;
  name: string;
  hex: string;
  cssClass: string;
}

export type PaperStyle = "lined" | "blank" | "dotgrid";

export interface DiaryEntryMock {
  id: string;
  date: string;
  title: string;
  content: string;
  ink: InkColor;
  paper: PaperStyle;
}
