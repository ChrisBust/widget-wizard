
(function() {
  'use strict';

  const API_ENDPOINT = "https://reviews-widgetchris.netlify.app/api/widgets";

  // This is a minimal implementation of LitElement and html/css helpers
  // to keep the widget self-contained and dependency-free.
  const LitElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.__renderRequest = null;
      this.__isConnected = false;
    }
    
    static get properties() { return {}; }

    connectedCallback() {
      this.__isConnected = true;
      this.requestUpdate();
    }

    disconnectedCallback() {
      this.__isConnected = false;
    }

    requestUpdate(name, oldValue, newValue) {
      if (this.__renderRequest) return;
      this.__renderRequest = Promise.resolve().then(() => {
        this.__renderRequest = null;
        if (this.__isConnected) {
          this.render();
        }
      });
    }

    render() {
      const template = this.constructor.template(this);
      if (this.shadowRoot.firstChild) {
        this.shadowRoot.replaceChild(template, this.shadowRoot.firstChild);
      } else {
        this.shadowRoot.appendChild(template);
      }
    }
  }

  function html(strings, ...values) {
    const template = document.createElement('template');
    let str = '';
    strings.forEach((string, i) => {
      str += string;
      if (i < values.length) {
        const value = values[i];
        if (typeof value === 'object' && value !== null && value.isTemplateResult) {
          str += value.getHTML();
        } else {
          str += value;
        }
      }
    });
    template.innerHTML = str;
    return template.content.cloneNode(true);
  }

  html.isTemplateResult = true;
  
  function css(strings, ...values) {
    const style = document.createElement('style');
    let str = '';
    strings.forEach((string, i) => {
      str += string;
      if (i < values.length) {
        str += values[i];
      }
    });
    style.textContent = str;
    return style;
  }
  
  class ReviewWidget extends LitElement {
    static get properties() {
      return {
        widgetId: { type: String, reflect: true },
        widget: { type: Object },
        loading: { type: Boolean },
        error: { type: String },
        showForm: { type: Boolean },
        rating: { type: Number },
        submitting: { type: Boolean },
      };
    }

    constructor() {
      super();
      this.widgetId = '';
      this.widget = null;
      this.loading = true;
      this.error = null;
      this.showForm = false;
      this.rating = 0;
      this.submitting = false;
    }

    connectedCallback() {
      super.connectedCallback();
      this.fetchWidgetData();
    }

    async fetchWidgetData() {
      if (!this.widgetId) {
        this.error = "Widget ID is missing.";
        this.loading = false;
        this.requestUpdate();
        return;
      }
      this.loading = true;
      this.requestUpdate();

      try {
        const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch widget data. Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          this.widget = result.data;
          // Sort reviews by creation date, newest first
          if (this.widget && this.widget.reviews) {
            this.widget.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }
        } else {
          throw new Error(result.error || "Unknown error fetching widget.");
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
        this.requestUpdate();
      }
    }
    
    get overallRating() {
      if (!this.widget?.reviews || this.widget.reviews.length === 0) return 0;
      const total = this.widget.reviews.reduce((acc, r) => acc + r.stars, 0);
      return total / this.widget.reviews.length;
    }

    get ratingDistribution() {
        const distribution = [0, 0, 0, 0, 0];
        if (!this.widget?.reviews) return distribution;
        for (const review of this.widget.reviews) {
            distribution[5 - review.stars]++;
        }
        return distribution;
    }

    openForm() {
      this.showForm = true;
      this.requestUpdate();
    }

    closeForm(e) {
      if (e.target === e.currentTarget) { // only close if overlay is clicked
          this.showForm = false;
          this.rating = 0;
          this.requestUpdate();
      }
    }

    closeFormButton() {
        this.showForm = false;
        this.rating = 0;
        this.requestUpdate();
    }

    handleRating(newRating) {
      this.rating = newRating;
      this.requestUpdate();
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        this.submitting = true;
        this.requestUpdate();

        const formData = new FormData(e.target);
        const reviewData = {
            name: formData.get('name'),
            stars: this.rating,
            text: formData.get('text'),
            source: 'Direct',
        };
        
        // Basic validation
        if (!reviewData.name || reviewData.stars === 0 || !reviewData.text) {
          alert('Please fill out all fields and select a rating.');
          this.submitting = false;
          this.requestUpdate();
          return;
        }

        try {
            const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData),
            });
            if (!response.ok) throw new Error('Submission failed');
            
            this.showForm = false;
            this.rating = 0;
            this.submitting = false;
            this.fetchWidgetData(); // Re-fetch to show the new review
        } catch (error) {
            console.error(error);
            alert('There was an error submitting your review.');
            this.submitting = false;
            this.requestUpdate();
        }
    }
    
    static template = (props) => {
        const styles = css`
            :host {
              --w-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
              --w-background: #fff;
              --w-foreground: #0f172a;
              --w-card: #fff;
              --w-card-foreground: #0f172a;
              --w-primary: #3F51B5;
              --w-primary-foreground: #fff;
              --w-secondary: #f1f5f9;
              --w-muted: #f1f5f9;
              --w-muted-foreground: #64748b;
              --w-accent: #FFB300;
              --w-accent-foreground: #0f172a;
              --w-border: #e2e8f0;
              --w-input: #e2e8f0;
              --w-ring: #3F51B5;
              --w-radius: 0.8rem;
              display: block;
              font-family: var(--w-font-family);
            }
            * { box-sizing: border-box; }
            .widget-container {
              background-color: var(--w-background);
              color: var(--w-foreground);
              padding: 1rem;
            }
            @media (min-width: 640px) {
              .widget-container { padding: 1.5rem; }
            }
            .max-w-4xl { max-width: 56rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .header {
              margin-bottom: 1.5rem;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            }
            .header h1 { font-size: 1.875rem; font-weight: 700; margin: 0; }
            .header a { color: var(--w-primary); text-decoration: none; }
            .header a:hover { text-decoration: underline; }
            .stats-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem; }
            .card {
              border-radius: var(--w-radius);
              border: 1px solid var(--w-border);
              background-color: var(--w-card);
              color: var(--w-card-foreground);
              padding: 1.5rem;
            }
            .overall-rating { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
            .overall-rating .score { font-size: 3rem; font-weight: 700; line-height: 1; }
            .overall-rating .subtext { color: var(--w-muted-foreground); margin-top: 0.5rem; }
            .rating-dist-title { font-weight: 600; margin-bottom: 0.75rem; }
            .dist-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
            .dist-row .label { color: var(--w-muted-foreground); width: 1.5rem; text-align: right; }
            .dist-row .icon { width: 1rem; height: 1rem; color: var(--w-accent); }
            .progress { position: relative; height: 0.5rem; flex-grow: 1; overflow: hidden; border-radius: 9999px; background-color: var(--w-secondary); }
            .progress-indicator { height: 100%; background-color: var(--w-primary); transition: width 0.3s ease; }
            .dist-row .count { color: var(--w-muted-foreground); width: 2rem; text-align: right; }
            
            .reviews-header { display: flex; flex-direction: column; gap: 1rem; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .reviews-header h2 { font-size: 1.25rem; font-weight: 700; margin: 0; }
            .button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: calc(var(--w-radius) - 2px);
              font-size: 0.875rem;
              font-weight: 500;
              height: 2.5rem;
              padding: 0 1rem;
              background-color: var(--w-primary);
              color: var(--w-primary-foreground);
              cursor: pointer;
              border: none;
              transition: background-color 0.2s ease;
            }
            .button:hover { background-color: #303f9f; } /* Darker shade of primary */
            
            .reviews-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }

            .review-card {
                display: flex;
                flex-direction: column;
                height: 100%;
                background-color: var(--w-card);
                border: 1px solid var(--w-border);
                border-radius: var(--w-radius);
                padding: 1.5rem;
            }
            .review-card-header { display: flex; align-items: center; gap: 0.75rem; }
            .avatar {
              position: relative; display: flex; height: 2.5rem; width: 2.5rem;
              flex-shrink: 0; overflow: hidden; border-radius: 9999px;
              background-color: var(--w-muted); align-items: center; justify-content: center;
              font-weight: 600; color: var(--w-muted-foreground);
            }
            .author-info .name { font-weight: 600; }
            .author-info .source { font-size: 0.75rem; color: var(--w-muted-foreground); }
            .review-card-body { flex-grow: 1; padding-top: 1rem; }
            .review-card-body p { margin: 0; font-size: 0.875rem; line-height: 1.5; color: hsl(var(--w-foreground)/0.8); }
            .star-rating { display: flex; align-items: center; gap: 0.125rem; margin: 0.5rem 0; }
            .star-rating svg { width: 1.25rem; height: 1.25rem; }
            .star-filled { color: var(--w-accent); }
            .star-empty { color: var(--w-border); }

            .no-reviews { text-align: center; padding: 5rem 0; border: 2px dashed var(--w-border); border-radius: var(--w-radius); background-color: var(--w-card); color: var(--w-muted-foreground); }
            .no-reviews svg { margin: 0 auto; height: 3rem; width: 3rem; }
            .no-reviews h3 { margin-top: 0.5rem; font-size: 1.25rem; font-weight: 600; color: var(--w-foreground); }
            .footer { text-align: center; margin-top: 3rem; font-size: 0.875rem; color: var(--w-muted-foreground); }

            /* Modal Styles */
            .modal-overlay {
                position: fixed; inset: 0; z-index: 50;
                background-color: rgba(9, 10, 17, 0.8);
                backdrop-filter: blur(4px);
                display: flex; align-items: center; justify-content: center;
            }
            .modal-content {
                position: relative;
                background-color: #111827; /* Dark background */
                color: #d1d5db; /* Light gray text */
                border: 1px solid #374151; /* Gray border */
                border-radius: var(--w-radius);
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
                width: 90%;
                max-width: 450px;
                padding: 1.5rem;
            }
            .modal-header { text-align: center; margin-bottom: 1rem; }
            .modal-title { font-size: 1.25rem; font-weight: 600; color: #fff; margin:0; }
            .modal-description { font-size: 0.875rem; color: #9ca3af; margin-top: 0.5rem; }
            .modal-close-btn {
              position: absolute; right: 1rem; top: 1rem;
              background: none; border: none; color: #9ca3af; cursor: pointer;
              font-size: 1.5rem; line-height: 1;
            }
            .modal-close-btn:hover { color: #fff; }
            .form { display: flex; flex-direction: column; gap: 1rem; }
            .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
            .form-label { font-size: 0.875rem; font-weight: 500; color: #d1d5db; }
            .form-input, .form-textarea {
              display: flex; width: 100%;
              border-radius: calc(var(--w-radius) - 4px);
              border: 1px solid #374151;
              background-color: #1f2937;
              padding: 0.75rem;
              font-size: 0.875rem;
              color: #f3f4f6;
              transition: border-color 0.2s, box-shadow 0.2s;
            }
            .form-input:focus, .form-textarea:focus {
              outline: none;
              border-color: var(--w-ring);
              box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
            }
            .form-textarea { min-height: 100px; resize: vertical; }
            .rating-stars { display: flex; align-items: center; gap: 0.5rem; }
            .star-btn { cursor: pointer; background: none; border: none; padding: 0; color: #4b5563; }
            .star-btn.active { color: var(--w-accent); }
            .star-btn svg { width: 1.75rem; height: 1.75rem; }
            .form-footer { display: flex; justify-content: flex-end; }
            .form-submit-btn {
              display: inline-flex; align-items: center; justify-content: center;
              border-radius: calc(var(--w-radius) - 2px);
              font-size: 0.875rem; font-weight: 500;
              height: 2.5rem; padding: 0 1rem;
              background-color: var(--w-primary); color: var(--w-primary-foreground);
              cursor: pointer; border: none;
              transition: background-color 0.2s ease;
            }
             .form-submit-btn:hover { background-color: #4f46e5; }
             .form-submit-btn:disabled { background-color: #374151; cursor: not-allowed; }

            /* Responsive Breakpoints */
            @media (min-width: 640px) {
              .header { flex-direction: row; align-items: center; justify-content: space-between; }
              .reviews-header { flex-direction: row; }
            }
            @media (min-width: 768px) {
              .stats-grid { grid-template-columns: 1fr 2fr; }
              .reviews-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (min-width: 1024px) {
              .reviews-grid { grid-template-columns: repeat(3, 1fr); }
            }
        `;
        
        if (props.loading) { return html`<style>${styles}</style><div class="widget-container">Loading...</div>`; }
        if (props.error) { return html`<style>${styles}</style><div class="widget-container">Error: ${props.error}</div>`; }
        if (!props.widget) { return html`<style>${styles}</style><div class="widget-container">No data available.</div>`; }

        const { widget, showForm, rating, submitting } = props;
        const totalReviews = widget.reviews.length;
        const overallRating = props.overallRating;
        const ratingDistribution = props.ratingDistribution;
        
        const renderStarRating = (currentRating) => {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += `<svg class="${i <= currentRating ? 'star-filled' : 'star-empty'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
            }
            return html`<div class="star-rating">${document.createRange().createContextualFragment(stars)}</div>`;
        }
        
        const renderRatingStarsForForm = (currentRating) => {
          let stars = '';
           for (let i = 1; i <= 5; i++) {
                stars += `<button type="button" class="star-btn ${i <= currentRating ? 'active' : ''}" @click="${() => props.handleRating(i)}"><svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></button>`;
            }
            return html`<div class="rating-stars">${document.createRange().createContextualFragment(stars)}</div>`;
        }

        const addReviewForm = showForm ? html`
          <div class="modal-overlay" @click="${(e) => props.closeForm(e)}">
            <div class="modal-content">
                <button class="modal-close-btn" @click="${() => props.closeFormButton()}">&times;</button>
                <div class="modal-header">
                  <h3 class="modal-title">Write a review</h3>
                  <p class="modal-description">Share your experience with ${widget.businessName}.</p>
                </div>
                <form class="form" @submit="${(e) => props.handleSubmit(e)}">
                  <div class="form-group">
                    <label for="name" class="form-label">Your Name</label>
                    <input id="name" name="name" required class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Rating</label>
                    ${renderRatingStarsForForm(rating)}
                  </div>
                  <div class="form-group">
                    <label for="text" class="form-label">Review</label>
                    <textarea id="text" name="text" required class="form-textarea"></textarea>
                  </div>
                  <div class="form-footer">
                      <button type="submit" class="form-submit-btn" .disabled=${submitting}>
                          ${submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                  </div>
                </form>
            </div>
          </div>
        ` : '';

        const reviewCards = widget.reviews.map(review => html`
            <div class="review-card">
              <div class="review-card-header">
                <div class="avatar">${review.name.charAt(0)}</div>
                <div class="author-info">
                  <div class="name">${review.name}</div>
                  <div class="source">${review.source} review</div>
                </div>
              </div>
              <div class="review-card-body">
                ${renderStarRating(review.stars)}
                <p>${review.text}</p>
              </div>
            </div>
        `);
        
        const statsSection = totalReviews > 0 ? html`
            <div class="stats-grid">
              <div class="card overall-rating">
                <div class="score">${overallRating.toFixed(1)}</div>
                ${renderStarRating(overallRating)}
                <p class="subtext">Based on ${totalReviews} reviews</p>
              </div>
              <div class="card">
                <h3 class="rating-dist-title">Rating distribution</h3>
                ${ratingDistribution.map((count, i) => html`
                  <div class="dist-row">
                    <span class="label">${5 - i}</span>
                    <svg class="icon" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <div class="progress"><div class="progress-indicator" style="width: ${(count / totalReviews) * 100}%"></div></div>
                    <span class="count">${count}</span>
                  </div>
                `).join('')}
              </div>
            </div>
        ` : '';

        const reviewsSection = totalReviews > 0 ? html`
            <div class="reviews-grid">
                ${reviewCards.join('')}
            </div>
        ` : html`
            <div class="no-reviews">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3>No reviews yet</h3>
                <p>Your widget is ready to collect feedback.</p>
            </div>
        `;
        
        return html`
          <style>${styles}</style>
          <div class="widget-container">
            <div class="max-w-4xl mx-auto">
                <header class="header">
                  <h1>${widget.businessName}</h1>
                  <a href="${widget.website}" target="_blank" rel="noopener noreferrer">${widget.website}</a>
                </header>
                
                ${statsSection}
                
                <div class="reviews-header">
                  <h2>${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                  <button class="button" @click="${() => props.openForm()}">Write a Review</button>
                </div>

                ${reviewsSection}
                
                <footer class="footer">
                  <p>Powered by Widget Wizard</p>
                </footer>
            </div>
          </div>
          ${addReviewForm}
        `;
    }
  }
  
  if (!window.customElements.get('review-widget')) {
    window.customElements.define('review-widget', ReviewWidget);
  }
})();
