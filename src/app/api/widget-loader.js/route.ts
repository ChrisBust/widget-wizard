
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  
  // This script will be run on the user's website.
  const scriptContent = `
(function() {
  'use strict';

  class ReviewWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      const widgetId = this.getAttribute('widgetId');
      if (!widgetId) {
        console.error('Widget Wizard: widgetId attribute is missing.');
        this.shadowRoot.innerHTML = '<p style="color:red;">Error: widgetId is missing.</p>';
        return;
      }

      const iframeSrc = "${appUrl}/widget/" + widgetId;
      
      const iframe = document.createElement('iframe');
      iframe.src = iframeSrc;
      iframe.style.width = '100%';
      iframe.style.height = '600px'; // Initial height
      iframe.style.border = 'none';
      iframe.style.borderRadius = '12px';
      iframe.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
      iframe.scrolling = 'no';
      iframe.setAttribute('title', 'Widget Wizard Reviews');
      
      this.shadowRoot.appendChild(iframe);
      
      window.addEventListener('message', (event) => {
        if (event.source !== iframe.contentWindow) {
          return;
        }
        if (event.data.type === 'widget-resize' && event.data.widgetId === widgetId) {
          iframe.style.height = event.data.height + 'px';
        }
      });
    }
  }

  // Define the custom element if it hasn't been defined yet.
  if (!window.customElements.get('review-widget')) {
    window.customElements.define('review-widget', ReviewWidget);
  }

})();
  `;

  return new NextResponse(scriptContent, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // Cache for 1 hour
    },
  });
}
