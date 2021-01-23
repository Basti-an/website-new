export type CvModel = Record<string, CvEntry[]>;

export interface CvEntry {
  title: string;
  duration: string;
  image: Image;
  url: string;
  description?: string;
}

export interface Image {
  url: string;
  title: string;
  fullWidth: boolean;
  background?: string;
}
