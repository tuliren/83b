export interface HeaderSection {
  text: string;
  alignment: 'left' | 'center' | 'right';
  color?: string;
  fontSize?: number;
  bold?: boolean;
}

export interface ContentPage {
  title: string;
  text: string;
  headers?: HeaderSection[];
  scalingFactor?: number;
}
