import { Map as MapboxMap } from 'mapbox-gl';
import { DPIType, FormatType, MapGeneratorBase, SizeType, UnitType } from '../../../maplibre-gl-export';
export default class MapGenerator extends MapGeneratorBase {
    private accesstoken;
    constructor(map: MapboxMap, size?: SizeType, dpi?: DPIType, format?: FormatType, unit?: UnitType, fileName?: string, markerCirclePaint?: import("mapbox-gl").CirclePaint, attributionOptions?: import("../../../maplibre-gl-export").AttributionOptions, northIconOptions?: import("../../../maplibre-gl-export").NorthIconOptions, accesstoken?: string);
    private stringify;
    protected getRenderedMap(container: HTMLElement, style: mapboxgl.Style): MapboxMap;
}
//# sourceMappingURL=map-generator.d.ts.map