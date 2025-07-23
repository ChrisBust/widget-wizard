
(async function() {
  'use strict';

  // Production API endpoint
  const API_ENDPOINT = "https://reviews-widgetchris.netlify.app/api/widgets";

  // Using Lit for web components
  const { LitElement, html, css } = await import('https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js');

  class ReviewWidget extends LitElement {
    static styles = css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        --vibrant-purple: #8A2BE2; /* A vibrant purple for primary actions */
        --vibrant-pink: #FF1493;   /* A vibrant pink for accents like stars */
        --dark-bg: #1A1A1A;
        --card-bg: #2C2C2C;
        --text-primary: #FFFFFF;
        --text-secondary: #B3B3B3;
        --border-color: #444444;
        --input-bg: #333333;
        --input-border: #555555;
      }
      .widget-container {
        background-color: var(--dark-bg);
        color: var(--text-primary);
        padding: 24px;
        border-radius: 12px;
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }
      header h1 {
        margin: 0;
        font-size: 24px;
        color: var(--text-primary);
      }
      .write-review-btn {
        background-color: var(--vibrant-purple);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.3s;
      }
      .write-review-btn:hover {
        background-color: #7B24CB;
      }
      .reviews-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      .review-card {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .review-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .review-card-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--vibrant-purple);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      .review-card-author {
        font-weight: 600;
        color: var(--text-primary);
      }
      .review-card-source {
        font-size: 12px;
        color: var(--text-secondary);
      }
      .star-rating {
        display: flex;
        gap: 2px;
      }
      .star-rating svg {
        width: 16px;
        height: 16px;
        color: var(--text-secondary);
      }
      .star-rating svg.filled {
        color: var(--vibrant-pink);
        fill: var(--vibrant-pink);
      }
      .review-card-body {
        font-size: 14px;
        line-height: 1.5;
        color: var(--text-secondary);
      }
      .no-reviews {
        text-align: center;
        padding: 40px;
        border: 2px dashed var(--border-color);
        border-radius: 12px;
      }
      .modal {
        display: flex;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.6);
        align-items: center;
        justify-content: center;
      }
      .modal-content {
        background-color: #18181B; /* Dark background from image */
        color: #FFFFFF;
        margin: auto;
        padding: 32px;
        border-radius: 12px;
        width: 90%;
        max-width: 450px;
        position: relative;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      }
      .modal-close-btn {
        color: var(--text-secondary);
        position: absolute;
        top: 16px;
        right: 16px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        background: none;
        border: none;
      }
      .modal-content h2 {
          margin-top: 0;
          font-size: 24px;
          font-weight: bold;
          color: #FFFFFF;
      }
      .modal-content p {
          margin-bottom: 24px;
          color: #A1A1AA; /* Muted text from image */
      }
      .form-group {
        margin-bottom: 20px;
      }
      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #FFFFFF;
      }
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 12px;
        background-color: #18181B; /* Match modal bg */
        color: #FFFFFF;
        border: 1px solid #52525B; /* Darker border */
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box; /* Important for padding and width */
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--vibrant-purple);
        box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.4);
      }
       .star-input-container {
        display: flex;
        gap: 4px;
      }
      .star-input-container svg {
        width: 24px;
        height: 24px;
        cursor: pointer;
        color: #52525B;
        transition: color 0.2s;
      }
      .star-input-container svg.hover,
      .star-input-container svg.selected {
        color: var(--vibrant-pink);
        fill: var(--vibrant-pink);
      }
      .form-submit-btn {
        width: 100%;
        background-color: var(--vibrant-purple);
        color: white;
        padding: 12px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        transition: background-color 0.3s;
      }
      .form-submit-btn:hover {
        background-color: #7B24CB;
      }
      @media (max-width: 600px) {
        .widget-container {
          padding: 16px;
        }
        header {
          flex-direction: column;
          align-items: flex-start;
        }
        .modal-content {
          width: 95%;
          padding: 24px;
        }
      }
    `;

    static properties = {
      widgetId: { type: String },
      widgetData: { type: Object },
      isLoading: { type: Boolean },
      error: { type: String },
      isModalOpen: { type: Boolean },
      rating: { type: Number },
      hoverRating: { type: Number },
    };

    constructor() {
      super();
      this.isLoading = true;
      this.isModalOpen = false;
      this.rating = 0;
      this.hoverRating = 0;
    }

    connectedCallback() {
      super.connectedCallback();
      this.widgetId = this.getAttribute('widgetId');
      if (this.widgetId) {
        this.fetchWidgetData();
      } else {
        this.error = 'widgetId attribute is missing.';
        this.isLoading = false;
      }
    }

    async fetchWidgetData() {
      try {
        const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
          this.widgetData = result.data;
        } else {
          throw new Error(result.error || 'Failed to fetch widget data.');
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    }

    renderStars(rating) {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(html`
          <svg class="${i <= rating ? 'filled' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        `);
      }
      return html`<div class="star-rating">${stars}</div>`;
    }

    openModal() {
      this.isModalOpen = true;
    }

    closeModal() {
      this.isModalOpen = false;
      this.rating = 0;
      this.hoverRating = 0;
    }

    handleRating(rate) {
        this.rating = rate;
    }

    handleHoverRating(rate) {
        this.hoverRating = rate;
    }

    async handleFormSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const name = formData.get('name');
      const text = formData.get('text');
      const stars = this.rating;

      if (!stars) {
        alert("Please select a star rating.");
        return;
      }

      const submitButton = form.querySelector('.form-submit-btn');
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';

      try {
        const response = await fetch(`${API_ENDPOINT}/${this.widgetId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, stars, text, source: 'Direct' }),
        });
        const result = await response.json();
        if(!result.success){
            throw new Error(result.error || 'Failed to submit review.');
        }
        this.closeModal();
        this.fetchWidgetData(); // Refresh data
      } catch (error) {
        console.error('Submission error:', error);
        alert(`Error: ${error.message}`);
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Review';
      }
    }
    
    renderModal() {
        if (!this.isModalOpen) return '';

        const stars = [1, 2, 3, 4, 5].map(star => html`
            <svg
                class="${this.hoverRating >= star || this.rating >= star ? 'selected' : ''}"
                @click="${() => this.handleRating(star)}"
                @mouseenter="${() => this.handleHoverRating(star)}"
                @mouseleave="${() => this.handleHoverRating(0)}"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        `);
        
        return html`
            <div class="modal">
                <div class="modal-content">
                    <button class="modal-close-btn" @click="${this.closeModal}">&times;</button>
                    <h2>Write a review</h2>
                    <p>Share your experience with ${this.widgetData.businessName}.</p>
                    <form @submit="${this.handleFormSubmit}">
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Rating</label>
                            <div class="star-input-container">${stars}</div>
                        </div>
                        <div class="form-group">
                            <label for="review">Review</label>
                            <textarea id="review" name="text" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="form-submit-btn">Submit Review</button>
                    </form>
                </div>
            </div>
        `;
    }
    

    render() {
      if (this.isLoading) {
        return html`<p>Loading widget...</p>`;
      }
      if (this.error) {
        return html`<p style="color:red;">Error: ${this.error}</p>`;
      }

      // Sort reviews by date, newest first
      const sortedReviews = this.widgetData.reviews ? 
        [...this.widgetData.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

      return html`
        <div class="widget-container">
          <header>
            <h1>${this.widgetData.businessName}</h1>
            <button class="write-review-btn" @click="${this.openModal}">Write a review</button>
          </header>
          
          ${sortedReviews.length > 0 ? html`
            <div class="reviews-grid">
              ${sortedReviews.map(review => html`
                <div class="review-card">
                  <div class="review-card-header">
                    <div class="review-card-avatar">${review.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div class="review-card-author">${review.name}</div>
                      <div class="review-card-source">${review.source} review</div>
                    </div>
                  </div>
                  ${this.renderStars(review.stars)}
                  <p class="review-card-body">${review.text}</p>
                </div>
              `)}
            </div>
          ` : html`
            <div class="no-reviews">
              <p>Be the first to leave a review.</p>
            </div>
          `}
        </div>
        ${this.renderModal()}
      `;
    }
  }

  if (!window.customElements.get('review-widget')) {
    window.customElements.define('review-widget', ReviewWidget);
  }

})();
