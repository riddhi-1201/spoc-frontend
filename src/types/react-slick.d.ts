declare module "react-slick" {
  import * as React from "react";

  export interface Settings {
    className?: string;
    adaptiveHeight?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
    dots?: boolean;
    arrows?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    responsive?: Array<{
      breakpoint: number;
      settings:
        | "unslick"
        | Settings
        | {
            [key: string]: unknown;
          };
    }>;
    [key: string]: unknown;
  }

  export default class Slider extends React.Component<Settings> {
    slickNext(): void;
    slickPrev(): void;
    slickGoTo(slideNumber: number, dontAnimate?: boolean): void;
    slickPause(): void;
    slickPlay(): void;
  }
}
