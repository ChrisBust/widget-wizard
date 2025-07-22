
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  
  // This script will be run on the user's website.
  const scriptContent = `
(function() {
  'use strict';

  const widgetId = "${id}";
  const containerId = "widget-wizard-container";
  const iframeSrc = "${appUrl}/widget/${widgetId}";
  const cssUrl = "${appUrl}/globals.css"; // We can refine this to a smaller, widget-specific CSS file later

  function initWidget() {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Widget Wizard: Container element #' + containerId + ' not found.');
      return;
    }

    // Clear previous content
    container.innerHTML = '';
    
    // Create Iframe
    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.style.width = '100%';
    iframe.style.height = '600px'; // Initial height, can be adjusted
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
    iframe.scrolling = 'no';
    iframe.setAttribute('title', 'Widget Wizard Reviews');
    
    container.appendChild(iframe);
    
    // Adjust iframe height based on content
    window.addEventListener('message', function(event) {
        if (event.source !== iframe.contentWindow) {
            return;
        }
        if (event.data.type === 'widget-resize' && event.data.widgetId === widgetId) {
            iframe.style.height = event.data.height + 'px';
        }
    });
  }

  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
  `;

  return new NextResponse(scriptContent, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // Cache for 1 hour, revalidate after 24 hours
    },
  });
}
