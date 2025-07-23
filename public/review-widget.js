
(function() {
  'use strict';

  const API_ENDPOINT = "https://reviews-widgetchris.netlify.app/api/widgets";

  // LitElement base classes from unpkg
  const { LitElement, html, css } = window.Lit;

  class ReviewWidget extends LitElement {
    static styles = css`
      :host {
        display: block;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        line-height: 1.5;
        color: #333;
      }

      /* Base styles */
      .container {
        padding: 24px;
        background-color: #ffffff;
        border-radius: 12px;
        max-width: 100%;
        margin: 0 auto;
        border: 1px solid #e5e7eb;
      }

      .header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        gap: 16px;
      }

      @media (min-width: 640px) {
        .header {
          flex-direction: row;
        }
      }

      .title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
      }

      .rating-container {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }

      .rating-value {
        font-size: 1.875rem;
        font-weight: 700;
        color: #1f2937;
      }

      .stars {
        display: flex;
        font-size: 1.5rem;
        color: #FFB300;
      }

      .reviews-count {
        font-size: 0.875rem;
        color: #6b7280;
      }

      .button {
        display: inline-flex;
        align-items: center;
        padding: 12px 24px;
        background-color: #3F51B5;
        color: white;
        font-weight: 600;
        border-radius: 8px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .button:hover {
        background-color: #303f9f;
      }

      .button svg {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }

      /* Reviews grid */
      .reviews-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: 1fr;
      }

      @media (min-width: 640px) {
        .reviews-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .reviews-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .review-card {
        background-color: white;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 16px;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      }

      .review-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }

      .review-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .review-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
        background-color: #4b5563; /* Default color */
      }
      
      .review-info {
        flex-grow: 1;
      }

      .author {
        font-weight: 600;
        font-size: 1rem;
        color: #111827;
      }
      
      .review-source {
        font-size: 0.75rem;
        color: #6b7280;
      }

      .review-rating {
        font-size: 1rem;
        color: #FFB300;
        margin: 4px 0;
        line-height: 1;
      }

      .review-text {
        font-size: 0.875rem;
        color: #374151;
        line-height: 1.6;
      }
      
      .footer-powered-by {
        text-align: center;
        margin-top: 24px;
        font-size: 0.875rem;
        color: #9ca3af;
      }

      /* Empty state */
      .empty-state {
        text-align: center;
        padding: 48px 24px;
        background-color: #f9fafb;
        border-radius: 8px;
        border: 2px dashed #e5e7eb;
      }

      .empty-state svg {
        width: 48px;
        height: 48px;
        color: #9ca3af;
        margin: 0 auto;
      }

      .empty-title {
        margin-top: 16px;
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
      }

      .empty-text {
        margin-top: 4px;
        color: #6b7280;
      }

      /* Loading spinner */
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 256px;
      }

      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e5e7eb;
        border-left-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
      }

      .modal {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        max-width: 448px;
        width: 100%;
        padding: 24px;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .modal-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f2937;
      }
      
      .modal-description {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 24px;
      }

      .close-button {
        color: #9ca3af;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
      }
      .close-button:hover {
        color: #1f2937;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
      }

      .form-input, .form-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 1rem;
        box-sizing: border-box;
        background-color: #fff;
        color: #1f2937;
      }
      
      .form-textarea {
         min-height: 100px;
         resize: vertical;
      }

      .form-input:focus, .form-textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      }

      .rating-stars {
        display: flex;
        gap: 4px;
      }

      .star-button {
        font-size: 1.75rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        color: #d1d5db;
      }

      .star-button.filled {
        color: #FFB300;
      }
      
      .submit-button {
          width: 100%;
          padding: 12px 16px;
          background-color: #3F51B5;
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
      }
      
      .submit-button:hover {
          background-color: #303f9f;
      }
    `;

    static properties = {
      widgetId: { type: String, reflect: true },
      widgetData: { type: Object },
      loading: { type: Boolean },
      showReviewModal: { type: Boolean },
      reviewStars: { type: Number },
      reviewText: {type: String},
      reviewName: {type: String},
    };

    constructor() {
      super();
      this.widgetId = '';
      this.widgetData = null;
      this.loading = true;
      this.showReviewModal = false;
      this.reviewStars = 0;
      this.reviewText = '';
      this.reviewName = '';
    }

    connectedCallback() {
      super.connectedCallback();
      if (this.widgetId) {
        this.fetchWidgetData();
      }
    }

    async fetchWidgetData() {
      this.loading = true;
      try {
        const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        this.widgetData = data.data;
      } catch (error) {
        console.error('Error fetching widget data:', error);
      } finally {
        this.loading = false;
      }
    }
    
    async handleReviewSubmit(e) {
      e.preventDefault();
      const payload = {
          name: this.reviewName,
          stars: this.reviewStars,
          text: this.reviewText,
          source: 'Direct'
      };

      try {
          const response = await fetch(`${API_ENDPOINT}/${this.widgetId}/reviews`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
          });

          if (!response.ok) {
              throw new Error('Failed to submit review');
          }

          this.showReviewModal = false;
          this.fetchWidgetData(); // Refresh data
      } catch (error) {
          console.error('Error submitting review:', error);
      }
    }

    get overallRating() {
      if (!this.widgetData || this.widgetData.reviews.length === 0) return 0;
      const total = this.widgetData.reviews.reduce((acc, review) => acc + review.stars, 0);
      return (total / this.widgetData.reviews.length).toFixed(1);
    }
    
    get totalReviews() {
        return this.widgetData ? this.widgetData.reviews.length : 0;
    }

    renderStars(rating) {
      const fullStars = Math.round(rating);
      return html`${'★'.repeat(fullStars)}${'☆'.repeat(5 - fullStars)}`;
    }

    render() {
      if (this.loading) {
        return html`<div class="loading"><div class="spinner"></div></div>`;
      }

      if (!this.widgetData) {
        return html`<p>Error: Could not load widget data.</p>`;
      }

      return html`
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
        <div class="container">
          <header class="header">
            <div>
              <h2 class="title">${this.widgetData.businessName}</h2>
              <div class="rating-container">
                <div class="rating-value">${this.overallRating}</div>
                <div class="stars">${this.renderStars(this.overallRating)}</div>
                <div class="reviews-count">Based on ${this.totalReviews} reviews</div>
              </div>
            </div>
            <button @click=${() => { this.showReviewModal = true; }} class="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Write a Review
            </button>
          </header>

          ${this.totalReviews > 0 ? html`
            <div class="reviews-grid">
              ${this.widgetData.reviews.slice().reverse().map(review => html`
                <div class="review-card">
                  <div class="review-content">
                    <div class="review-header">
                      <div class="avatar" style="background-color: #3F51B5;">
                        ${review.name.charAt(0).toUpperCase()}
                      </div>
                      <div class="review-info">
                        <span class="author">${review.name}</span>
                        <span class="review-source">${review.source} review</span>
                      </div>
                    </div>
                    <div class="review-rating">${this.renderStars(review.stars)}</div>
                    <p class="review-text">${review.text}</p>
                  </div>
                </div>
              `)}
            </div>
          ` : html`
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 class="empty-title">No reviews yet</h3>
              <p class="empty-text">Be the first to share your experience.</p>
            </div>
          `}
          
          <footer class="footer-powered-by">Powered by Widget Wizard</footer>
        </div>

        ${this.showReviewModal ? html`
          <div class="modal-overlay">
            <div class="modal">
              <div class="modal-header">
                <h3 class="modal-title">Write a review</h3>
                <button @click=${() => { this.showReviewModal = false; }} class="close-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <p class="modal-description">Share your experience with ${this.widgetData.businessName}.</p>
              
              <form @submit=${this.handleReviewSubmit}>
                <div class="form-group">
                  <label class="form-label">Your Name</label>
                  <input .value=${this.reviewName} @input=${e => this.reviewName = e.target.value} type="text" required class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">Rating</label>
                  <div class="rating-stars">
                    ${[1, 2, 3, 4, 5].map(star => html`
                      <button type="button" class="star-button ${this.reviewStars >= star ? 'filled' : ''}" @click=${() => this.reviewStars = star}>★</button>
                    `)}
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Review</label>
                  <textarea .value=${this.reviewText} @input=${e => this.reviewText = e.target.value} required class="form-textarea"></textarea>
                </div>
                <button type="submit" class="submit-button">Submit Review</button>
              </form>
            </div>
          </div>
        ` : ''}
      `;
    }
  }

  // Define the custom element if it hasn't been defined yet.
  if (!window.customElements.get('review-widget')) {
    // Inject Lit library if not present
    if (!window.Lit) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lit@3/index.js';
        script.type = 'module';
        script.onload = () => {
            window.customElements.define('review-widget', ReviewWidget);
        };
        document.head.appendChild(script);
    } else {
        window.customElements.define('review-widget', ReviewWidget);
    }
  }
})();
