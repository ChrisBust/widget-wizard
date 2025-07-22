(function() {
  'use strict';

  const APP_URL = 'https://widget-wizard-chris.netlify.app';

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

      const iframeSrc = `${APP_URL}/widget/${widgetId}`;
      
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
        // Basic security check
        if (event.origin !== APP_URL) {
          return;
        }
        
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
