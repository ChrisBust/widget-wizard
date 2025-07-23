
import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class ReviewWidget extends LitElement {
  static properties = {
    widgetId: { type: String },
    _widgetData: { state: true },
    _error: { state: true },
    _isModalOpen: { state: true },
    _rating: { state: true },
    _hoverRating: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      color: #0f172a;
      --primary-color: #8b5cf6;
      --primary-color-light: #a78bfa;
      --accent-color: #f59e0b;
      --card-bg: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --border-color: #e2e8f0;
      --star-inactive-color: #cbd5e1;
    }

    .widget-container {
      background-color: #f8fafc;
      padding: 24px;
      border-radius: 12px;
      max-width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 16px;
    }
    
    .reviews-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
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
      font-size: 48px;
      font-weight: bold;
      color: var(--text-primary);
    }

    .star-rating {
      display: flex;
      gap: 2px;
    }

    .star-rating svg {
      width: 24px;
      height: 24px;
      fill: var(--accent-color);
      color: var(--accent-color);
    }
    
    .star-rating .empty-star {
      fill: var(--star-inactive-color);
      color: var(--star-inactive-color);
    }

    .total-reviews-text {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 8px;
    }

    .distribution-card h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: var(--text-primary);
    }

    .distribution-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .distribution-row .star-icon {
      color: var(--accent-color);
      width: 16px;
      height: 16px;
    }
    
    .distribution-row .progress-bar {
      flex-grow: 1;
      height: 8px;
      background-color: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .distribution-row .progress-fill {
      height: 100%;
      background-color: var(--primary-color);
      border-radius: 4px;
    }
    
    .distribution-row .count {
      width: 20px;
      text-align: right;
      color: var(--text-secondary);
    }


    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .reviews-header h2 {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }

    .write-review-btn {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .write-review-btn:hover {
      background-color: var(--primary-color-light);
    }

    .reviews-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;
    }

    .review-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
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
      background-color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: var(--text-primary);
    }
    
    .review-card-author-info p {
      margin: 0;
    }

    .review-card-author {
      font-weight: 600;
      color: var(--text-primary);
    }

    .review-card-source {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .review-card .star-rating svg {
      width: 16px;
      height: 16px;
    }

    .review-card-text {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-primary);
    }
    
    .no-reviews {
      text-align: center;
      padding: 40px;
      border: 2px dashed var(--border-color);
      border-radius: 8px;
    }
    
    .no-reviews svg {
      width: 48px;
      height: 48px;
      color: var(--text-secondary);
      margin: 0 auto 16px;
    }

    .footer {
      text-align: center;
      margin-top: 32px;
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    /* MODAL STYLES */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(15, 23, 42, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: #1e293b; /* Dark background */
      color: #e2e8f0; /* Light text */
      padding: 24px;
      border-radius: 8px;
      width: 90%;
      max-width: 450px;
      position: relative;
    }
    
    .modal-header {
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .modal-header h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    
    .modal-header p {
      font-size: 14px;
      color: #94a3b8;
      margin: 4px 0 0 0;
    }

    .modal-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 24px;
      cursor: pointer;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      background-color: #0f172a;
      border: 1px solid #334155;
      color: #e2e8f0;
      padding: 10px;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.4);
    }
    
    .star-rating-input {
      display: flex;
      gap: 4px;
    }

    .star-rating-input svg {
      width: 28px;
      height: 28px;
      cursor: pointer;
      color: #475569;
      transition: color 0.2s;
    }
    
    .star-rating-input svg.hover,
    .star-rating-input svg.active {
      color: var(--primary-color);
    }
    
    .form-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .btn-secondary {
      background-color: #334155;
      color: #e2e8f0;
    }
    
    .btn-secondary:hover {
      background-color: #475569;
    }
    
    /* Responsive Tablet */
    @media (min-width: 640px) {
      .header {
        flex-direction: row;
        align-items: center;
      }
      .stats-grid {
        grid-template-columns: 200px 1fr;
      }
    }
    
    /* Responsive Desktop */
    @media (min-width: 768px) {
      .reviews-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .stats-grid {
        grid-template-columns: 250px 1fr;
      }
      .reviews-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `;

  constructor() {
    super();
    this.widgetId = '';
    this._widgetData = null;
    this._error = null;
    this._isModalOpen = false;
    this._rating = 0;
    this._hoverRating = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchWidgetData();
  }

  async _fetchWidgetData() {
    if (!this.widgetId) {
      this._error = 'widgetId attribute is missing.';
      return;
    }

    try {
      const response = await fetch(`https://reviews-widgetchris.netlify.app/api/widgets/${this.widgetId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch widget data. Status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'API returned an error.');
      }
      this._widgetData = result.data;
    } catch (error) {
      console.error('Widget Error:', error);
      this._error = 'Could not load widget data.';
    }
  }

  get _overallStats() {
    if (!this._widgetData || !this._widgetData.reviews || this._widgetData.reviews.length === 0) {
      return {
        overallRating: 0,
        totalReviews: 0,
        distribution: [0, 0, 0, 0, 0],
      };
    }

    const total = this._widgetData.reviews.reduce((acc, review) => acc + review.stars, 0);
    const overall = total / this._widgetData.reviews.length;

    const distribution = Array(5).fill(0);
    for (const review of this._widgetData.reviews) {
      distribution[5 - review.stars]++;
    }

    return {
      overallRating: overall,
      totalReviews: this._widgetData.reviews.length,
      distribution: distribution,
    };
  }

  _renderStarRating(rating, className = '') {
    const fullStars = Math.round(rating);
    const stars = Array(5).fill(null).map((_, i) => html`
      <svg class="${i < fullStars ? '' : 'empty-star'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg>
    `);
    return html`<div class="star-rating ${className}">${stars}</div>`;
  }
  
  _handleModalSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const text = formData.get('text');

    if (this._rating === 0) {
      // Simple validation feedback
      alert('Please select a star rating.');
      return;
    }

    try {
      const response = await fetch(`https://reviews-widgetchris.netlify.app/api/widgets/${this.widgetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          text,
          stars: this._rating,
          source: 'Direct',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review.');
      }
      
      const result = await response.json();
      
      if(result.success) {
        this._widgetData = result.data;
        this._closeModal();
      } else {
        throw new Error(result.error?.message || 'Failed to submit review.');
      }
      
    } catch (error) {
      console.error('Submit review error:', error);
      alert(error.message);
    }
  }

  _openModal() {
    this._isModalOpen = true;
    this._rating = 0;
    this._hoverRating = 0;
  }
  
  _closeModal() {
    this._isModalOpen = false;
  }
  
  _renderModal() {
    if (!this._isModalOpen) return '';

    return html`
      <div class="modal-overlay" @click=${this._closeModal}>
        <div class="modal-content" @click=${e => e.stopPropagation()}>
          <button class="modal-close-btn" @click=${this._closeModal}>&times;</button>
          <div class="modal-header">
            <h2>Write a review</h2>
            <p>Share your experience with ${this._widgetData?.businessName}.</p>
          </div>
          <form @submit=${this._handleModalSubmit}>
            <div class="form-group">
                <label for="rating">Rating</label>
                <div class="star-rating-input">
                    ${[1, 2, 3, 4, 5].map(star => html`
                        <svg 
                            class="${(this._hoverRating >= star || this._rating >= star) ? 'active' : ''}"
                            @click=${() => this._rating = star}
                            @mouseenter=${() => this._hoverRating = star}
                            @mouseleave=${() => this._hoverRating = 0}
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg>
                    `)}
                </div>
            </div>
            <div class="form-group">
              <label for="name">Your Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div class="form-group">
              <label for="text">Review</label>
              <textarea id="text" name="text" rows="4" required></textarea>
            </div>
            <div class="form-footer">
               <button type="button" class="write-review-btn btn-secondary" @click=${this._closeModal}>Cancel</button>
               <button type="submit" class="write-review-btn">Submit Review</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  render() {
    if (this._error) {
      return html`<p style="color:red; text-align:center;">Error: ${this._error}</p>`;
    }

    if (!this._widgetData) {
      return html`<p style="text-align:center;">Loading Widget...</p>`;
    }
    
    const { overallRating, totalReviews, distribution } = this._overallStats;
    const sortedReviews = this._widgetData.reviews ? [...this._widgetData.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

    return html`
      <div class="widget-container">
        <header class="header">
          <h1>${this._widgetData.businessName}</h1>
        </header>

        ${totalReviews > 0 ? html`
          <div class="stats-grid">
            <div class="overall-rating-card">
              <p class="overall-rating-score">${overallRating.toFixed(1)}</p>
              ${this._renderStarRating(overallRating)}
              <p class="total-reviews-text">Based on ${totalReviews} reviews</p>
            </div>
            <div class="distribution-card">
              <h2>Rating distribution</h2>
              <div class="space-y-2">
                ${distribution.map((count, i) => html`
                  <div class="distribution-row">
                    <span class="w-6 text-right">${5 - i}</span>
                    <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${(count / totalReviews) * 100}%"></div>
                    </div>
                    <span class="count">${count}</span>
                  </div>
                `)}
              </div>
            </div>
          </div>
        ` : ''}

        <div class="reviews-section">
          <div class="reviews-header">
            <h2>${totalReviews > 0 ? 'What people are saying' : 'Be the first to leave a review'}</h2>
            <button class="write-review-btn" @click=${this._openModal}>Write a Review</button>
          </div>
          
          ${totalReviews > 0 ? html`
            <div class="reviews-grid">
              ${sortedReviews.map(review => html`
                <div class="review-card">
                  <div class="review-card-header">
                    <div class="review-card-avatar">${review.name.charAt(0).toUpperCase()}</div>
                    <div class="review-card-author-info">
                      <p class="review-card-author">${review.name}</p>
                      <p class="review-card-source">${review.source} review</p>
                    </div>
                  </div>
                  ${this._renderStarRating(review.stars)}
                  <p class="review-card-text">${review.text}</p>
                </div>
              `)}
            </div>
          ` : html`
            <div class="no-reviews">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <h3>No reviews yet</h3>
              <p>Your widget is ready to collect feedback.</p>
            </div>
          `}
        </div>
        

      </div>
      ${this._renderModal()}
    `;
  }
}

if (!window.customElements.get('review-widget')) {
  window.customElements.define('review-widget', ReviewWidget);
}
