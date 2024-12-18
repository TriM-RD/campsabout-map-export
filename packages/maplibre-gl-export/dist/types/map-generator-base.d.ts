import { Map as MaplibreMap, StyleSpecification } from 'maplibre-gl';
import { CirclePaint, Map as MapboxMap } from 'mapbox-gl';
import { AttributionOptions, DPIType, FormatType, NorthIconOptions, SizeType, UnitType } from './interfaces';
export declare const defaultMarkerCirclePaint: CirclePaint;
export declare const defaultAttributionOptions: AttributionOptions;
export declare const defaultNorthIconOptions: NorthIconOptions;
export declare abstract class MapGeneratorBase {
    protected map: MaplibreMap | MapboxMap;
    protected width: number;
    protected height: number;
    protected dpi: number;
    protected format: FormatType;
    protected unit: UnitType;
    protected fileName: string;
    protected markerClassName: string;
    protected markerCirclePaint: CirclePaint;
    protected attributionClassName: string;
    protected attributionOptions: AttributionOptions;
    protected northIconOptions: NorthIconOptions;
    constructor(map: MaplibreMap | MapboxMap, size?: SizeType, dpi?: DPIType, format?: FormatType, unit?: UnitType, fileName?: string, markerClassName?: string, markerCirclePaint?: CirclePaint, attributionClassName?: string, attributionOptions?: AttributionOptions, northIconOptions?: NorthIconOptions);
    protected abstract getRenderedMap(container: HTMLElement, style: StyleSpecification | mapboxgl.Style): MaplibreMap | MapboxMap;
    protected renderMapPost(renderMap: MaplibreMap | MapboxMap): MaplibreMap | MapboxMap;
    private getMarkers;
    protected renderMarkers(renderMap: MaplibreMap | MapboxMap): MaplibreMap | MapboxMap;
    generate(): void;
    private stripHtml;
    private getIconWidth;
    private getElementPosition;
    private addNorthIconImage;
    private addNorthIconToMap;
    private addAttributions;
    private exportImage;
    private toPNG;
    private toPDF;
    private toPixels;
    private addLoader;
    private showLoader;
    private hideLoader;
}
//# sourceMappingURL=map-generator-base.d.ts.map