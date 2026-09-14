import { useEffect, useRef } from 'react';

export type AdPlacementName =
  | 'HOME_AD_TOP'
  | 'HOME_AD_BOTTOM'
  | 'TOOL_AD_AFTER_RESULT'
  | 'CONTENT_AD_BEFORE_RELATED'
  | 'SIDE_AD_LEFT'
  | 'SIDE_AD_RIGHT';

export interface AdPlacementDefinition {
  id: string;
  name: AdPlacementName;
  description: string;
  adFormat: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  minHeightClass: string;
}

/**
 * Centralized Planned Ad Locations Registry
 * Provides 6 distinct, policy-compliant ad placements designed for future AdSense activation.
 */
export const AD_PLACEMENTS: Record<AdPlacementName, AdPlacementDefinition> = {
  HOME_AD_TOP: {
    id: 'home-ad-top',
    name: 'HOME_AD_TOP',
    description: 'Homepage - below the hero / tools introduction area, before the main tools catalog',
    adFormat: 'horizontal',
    minHeightClass: 'min-h-[90px]',
  },
  HOME_AD_BOTTOM: {
    id: 'home-ad-bottom',
    name: 'HOME_AD_BOTTOM',
    description: 'Homepage - between useful FAQ guides and the footer area',
    adFormat: 'horizontal',
    minHeightClass: 'min-h-[90px]',
  },
  TOOL_AD_AFTER_RESULT: {
    id: 'tool-ad-after-result',
    name: 'TOOL_AD_AFTER_RESULT',
    description: 'Tool pages - below the main PDF tool interface and download result area, clearly separated from controls',
    adFormat: 'horizontal',
    minHeightClass: 'min-h-[90px]',
  },
  CONTENT_AD_BEFORE_RELATED: {
    id: 'content-ad-before-related',
    name: 'CONTENT_AD_BEFORE_RELATED',
    description: 'Tool and guide pages - below the main explanatory content and before related tools or FAQ',
    adFormat: 'horizontal',
    minHeightClass: 'min-h-[90px]',
  },
  SIDE_AD_LEFT: {
    id: 'side-ad-left',
    name: 'SIDE_AD_LEFT',
    description: 'Desktop - left side vertical skyscraper advertisement, cleanly positioned outside the main content column',
    adFormat: 'vertical',
    minHeightClass: 'min-h-[600px]',
  },
  SIDE_AD_RIGHT: {
    id: 'side-ad-right',
    name: 'SIDE_AD_RIGHT',
    description: 'Desktop - right side vertical skyscraper advertisement, cleanly positioned outside the main content column',
    adFormat: 'vertical',
    minHeightClass: 'min-h-[600px]',
  },
};

interface AdSlotProps {
  placement?: AdPlacementName;
  id?: string;
  adClient?: string;
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  className?: string;
}

/**
 * AdSlot Component - Google AdSense Ready Architecture
 *
 * Policy-compliant ad slot container that provides clear visual separation from interactive controls.
 * When unconfigured or in preview/development mode, renders a clean, subtle placeholder
 * without displaying any simulated or misleading advertisements.
 */
export function AdSlot({
  placement,
  id,
  adClient,
  adSlot,
  adFormat,
  fullWidthResponsive = true,
  className = '',
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);

  // Derive placement configuration if specified
  const config = placement ? AD_PLACEMENTS[placement] : undefined;
  const elementId = id || (config ? config.id : 'ad-slot-container');
  const format = adFormat || (config ? config.adFormat : 'auto');
  const isVertical = format === 'vertical' || placement === 'SIDE_AD_LEFT' || placement === 'SIDE_AD_RIGHT';

  useEffect(() => {
    // If real publisher and slot are provided, initialize real Google AdSense
    if (adClient && adSlot && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.debug('AdSense script not loaded or blocked by browser.', e);
      }
    }
  }, [adClient, adSlot]);

  // When no live ad credentials are provided, return null with no empty gutters or placeholder borders
  if (!adClient || !adSlot) {
    return null;
  }

  return (
    <aside
      id={elementId}
      className={`w-full overflow-hidden text-center ${
        isVertical ? 'my-4' : 'my-8 sm:my-10'
      } ${className}`}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </aside>
  );
}
