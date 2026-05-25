declare module "three/examples/jsm/loaders/SVGLoader" {
  import { ShapePath } from "three";
  export class SVGLoader {
    constructor();
    load(
      url: string,
      onLoad: (data: SVGData) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    static createShapes(path: ShapePath): any[];
  }
  export interface SVGData {
    paths: ShapePath[];
  }
}
