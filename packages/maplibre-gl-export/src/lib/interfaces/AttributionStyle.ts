export interface AttributionStyle {
	textSize: number;
	textHaloColor: string;
	textHaloWidth: number;
	textColor: string;
	fallbackTextFont: string[];
}

export interface AttributionOptions {
	style?: AttributionStyle;
	visibility?: 'visible' | 'none';
	// TODO: top-left and bottom-left have issues of text-max-width setting //this was here when Vjeko forked the repository
	position?: 'top-right' | 'bottom-right';
}
