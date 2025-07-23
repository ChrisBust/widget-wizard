
'use strict';

(function() {
  const API_ENDPOINT = "https://reviews-widgetchris.netlify.app/api/widgets";

  class ReviewWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.widgetData = null;
      this.showModal = false;
      this.rating = 0;
      this.hoverRating = 0;
    }

    static get styles() {
      return `
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          --rw-primary: #7c3aed;
          --rw-accent: #f59e0b;
          --rw-background: #111827;
          --rw-card-bg: #1f2937;
          --rw-text: #f9fafb;
          --rw-muted-text: #9ca3af;
          --rw-border: #374151;
          --rw-input-bg: #374151;
        }

        .container {
          background-color: var(--rw-background);
          color: var(--rw-text);
          padding: 1.5rem;
          border-radius: 0.75rem;
          width: 100%;
          box-sizing: border-box;
        }

        .header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 1.875rem;
          font-weight: bold;
          margin: 0;
        }
        .header a {
            color: var(--rw-primary);
            text-decoration: none;
        }
        .header a:hover {
            text-decoration: underline;
        }
        
        .summary {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .summary-card, .dist-card {
            background-color: var(--rw-card-bg);
            border-radius: 0.75rem;
            padding: 1.5rem;
            border: 1px solid var(--rw-border);
        }

        .overall-rating {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .overall-rating-value {
            font-size: 3rem;
            font-weight: bold;
        }
        .overall-rating-stars {
            display: flex;
        }
        .overall-rating-count {
            color: var(--rw-muted-text);
            margin-top: 0.5rem;
        }
        
        .dist-card h2 {
            font-weight: 600;
            margin: 0 0 0.75rem 0;
        }

        .dist-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }

        .dist-row .star-icon {
            color: var(--rw-accent);
        }
        
        .progress-bar {
            width: 100%;
            background-color: var(--rw-input-bg);
            height: 0.5rem;
            border-radius: 999px;
            overflow: hidden;
        }
        .progress-fill {
            background-color: var(--rw-accent);
            height: 100%;
            border-radius: 999px;
        }
        
        .reviews-header {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .reviews-header h2 {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0;
        }
        
        .btn {
            background-color: var(--rw-primary);
            color: var(--rw-text);
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .btn:hover {
            background-color: #6d28d9;
        }
        
        .reviews-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .review-card {
            background-color: var(--rw-card-bg);
            border-radius: 0.75rem;
            padding: 1.5rem;
            border: 1px solid var(--rw-border);
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .review-author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background-color: var(--rw-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .review-author-name {
          font-weight: 600;
        }
        .review-author-source {
          font-size: 0.75rem;
          color: var(--rw-muted-text);
        }

        .star-rating {
            display: flex;
        }

        .star-icon {
            width: 1.25rem;
            height: 1.25rem;
            color: var(--rw-muted-text);
        }

        .star-icon.filled {
            color: var(--rw-accent);
        }

        .review-text {
            color: var(--rw-muted-text);
            line-height: 1.6;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .modal-overlay.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background-color: var(--rw-card-bg);
            color: var(--rw-text);
            padding: 2rem;
            border-radius: 0.75rem;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            border: 1px solid var(--rw-border);
            transform: scale(0.95);
            transition: transform 0.3s ease;
        }
        
        .modal-overlay.visible .modal-content {
            transform: scale(1);
        }

        .modal-header {
            margin-bottom: 1.5rem;
        }
        .modal-header h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0;
        }
        .modal-header p {
            color: var(--rw-muted-text);
            margin: 0.25rem 0 0 0;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            background-color: var(--rw-input-bg);
            border: 1px solid var(--rw-border);
            color: var(--rw-text);
            padding: 0.75rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: var(--rw-primary);
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3);
        }

        .form-group textarea {
            min-height: 120px;
            resize: vertical;
        }

        .star-input-group {
            display: flex;
            gap: 0.25rem;
        }
        .star-input-group .star-icon {
            cursor: pointer;
            transition: color 0.2s;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
            margin-top: 2rem;
        }
        .btn-secondary {
            background-color: var(--rw-input-bg);
            color: var(--rw-text);
        }
        .btn-secondary:hover {
            background-color: #4b5563;
        }
        .footer {
            text-align: center;
            margin-top: 3rem;
            font-size: 0.875rem;
            color: var(--rw-muted-text);
        }
        
        @media (min-width: 768px) {
            .header {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
            .summary {
                flex-direction: row;
            }
            .summary-card {
                flex: 1;
            }
            .dist-card {
                flex: 2;
            }
            .reviews-header {
                flex-direction: row;
            }
        }
      `;
    }

    connectedCallback() {
      this.widgetId = this.getAttribute('widgetId');
      if (!this.widgetId) {
        console.error('Widget Wizard: widgetId attribute is missing.');
        this.shadowRoot.innerHTML = '<p style="color:red;">Error: widgetId is missing.</p>';
        return;
      }
      this.fetchWidgetData();
    }

    async fetchWidgetData() {
      try {
        const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch widget data.');
        }
        const data = await response.json();
        this.widgetData = data.data;
        this.render();
      } catch (error) {
        console.error('Widget Wizard Error:', error);
        this.shadowRoot.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
      }
    }
    
    get summary() {
      if (!this.widgetData || !this.widgetData.reviews || this.widgetData.reviews.length === 0) {
        return {
          overallRating: 0,
          totalReviews: 0,
          distribution: [0, 0, 0, 0, 0],
        };
      }
      const totalReviews = this.widgetData.reviews.length;
      const totalStars = this.widgetData.reviews.reduce((acc, review) => acc + review.stars, 0);
      const overallRating = totalStars / totalReviews;
      const distribution = [0,0,0,0,0];
      this.widgetData.reviews.forEach(review => {
        distribution[5 - review.stars]++;
      });

      return {
        overallRating,
        totalReviews,
        distribution
      };
    }

    renderStars(rating) {
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += `
          <svg class="star-icon ${i <= rating ? 'filled' : ''}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        `;
      }
      return starsHtml;
    }
    
    renderModalStars(rating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `
            <svg data-value="${i}" class="star-icon ${i <= this.hoverRating || i <= this.rating ? 'filled' : ''}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            `;
        }
        return starsHtml;
    }

    render() {
      if (!this.widgetData) {
        this.shadowRoot.innerHTML = '<p>Loading widget...</p>';
        return;
      }
      
      const { overallRating, totalReviews, distribution } = this.summary;
      const sortedReviews = this.widgetData.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      this.shadowRoot.innerHTML = `
        <style>${ReviewWidget.styles}</style>
        <div class="container">
          <div class="header">
            <div>
              <h1>${this.widgetData.businessName}</h1>
              <a href="${this.widgetData.website}" target="_blank" rel="noopener noreferrer">${this.widgetData.website}</a>
            </div>
          </div>
          
          ${totalReviews > 0 ? `
            <div class="summary">
                <div class="summary-card overall-rating">
                    <div class="overall-rating-value">${overallRating.toFixed(1)}</div>
                    <div class="overall-rating-stars">${this.renderStars(overallRating)}</div>
                    <p class="overall-rating-count">Based on ${totalReviews} reviews</p>
                </div>
                <div class="dist-card">
                    <h2>Rating distribution</h2>
                    ${distribution.map((count, i) => `
                        <div class="dist-row">
                            <span>${5-i}</span>
                            <svg class="star-icon filled" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(count/totalReviews)*100}%"></div>
                            </div>
                            <span class="dist-count">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>` 
          : ''}

          <div class="reviews-header">
            <h2>${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
            <button class="btn" id="write-review-btn">Write a Review</button>
          </div>

          <div class="reviews-grid">
            ${sortedReviews.length > 0 ? sortedReviews.map(review => `
              <div class="review-card">
                <div class="review-author">
                  <div class="review-author-avatar">${review.name.charAt(0)}</div>
                  <div>
                    <div class="review-author-name">${review.name}</div>
                    <div class="review-author-source">${review.source} review</div>
                  </div>
                </div>
                <div class="star-rating">${this.renderStars(review.stars)}</div>
                <p class="review-text">${review.text}</p>
              </div>
            `).join('') : '<p>No reviews yet. Be the first to share your experience!</p>'}
          </div>
          <div class="footer">
            <p>Powered by Widget Wizard</p>
          </div>
        </div>

        <div class="modal-overlay ${this.showModal ? 'visible' : ''}" id="review-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Write a review</h2>
                    <p>Share your experience with ${this.widgetData.businessName}.</p>
                </div>
                <form id="review-form">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div class="form-group">
                        <label for="stars">Rating</label>
                        <div class="star-input-group" id="star-rating-input">
                            ${this.renderModalStars()}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="text">Review</label>
                        <textarea id="text" name="text" required></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancel-review-btn">Cancel</button>
                        <button type="submit" class="btn">Submit Review</button>
                    </div>
                </form>
            </div>
        </div>
      `;
      this.addEventListeners();
    }
    
    addEventListeners() {
      this.shadowRoot.getElementById('write-review-btn').addEventListener('click', () => {
        this.toggleModal(true);
      });

      this.shadowRoot.getElementById('review-modal').addEventListener('click', (e) => {
        if (e.target.id === 'review-modal') {
          this.toggleModal(false);
        }
      });
      
      this.shadowRoot.getElementById('cancel-review-btn').addEventListener('click', () => {
          this.toggleModal(false);
      });

      this.shadowRoot.getElementById('review-form').addEventListener('submit', (e) => this.handleFormSubmit(e));
      
      const starRatingInput = this.shadowRoot.getElementById('star-rating-input');
      starRatingInput.addEventListener('click', e => {
        if(e.target.dataset.value) {
            this.rating = parseInt(e.target.dataset.value);
            this.updateModalStars();
        }
      });
      starRatingInput.addEventListener('mouseover', e => {
        if(e.target.dataset.value) {
            this.hoverRating = parseInt(e.target.dataset.value);
            this.updateModalStars();
        }
      });
      starRatingInput.addEventListener('mouseleave', () => {
        this.hoverRating = 0;
        this.updateModalStars();
      });
    }

    toggleModal(show) {
      this.showModal = show;
      const modal = this.shadowRoot.getElementById('review-modal');
      if (this.showModal) {
        modal.classList.add('visible');
      } else {
        modal.classList.remove('visible');
      }
    }
    
    updateModalStars() {
      const starContainer = this.shadowRoot.getElementById('star-rating-input');
      starContainer.innerHTML = this.renderModalStars();
    }
    
    async handleFormSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const reviewData = {
          name: formData.get('name'),
          stars: this.rating,
          text: formData.get('text'),
          source: 'Direct'
      };
      
      if(this.rating === 0) {
          alert("Please select a star rating.");
          return;
      }

      try {
        const response = await fetch(`${API_ENDPOINT}/${this.widgetId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit review.');
        }
        this.toggleModal(false);
        await this.fetchWidgetData();
        // Reset form
        form.reset();
        this.rating = 0;

      } catch (error) {
          console.error('Widget Wizard Error:', error);
          alert(`Error: ${error.message}`);
      }
    }
  }
  
  // Need to add the /reviews endpoint on the server side
  const originalGet = window.customElements.get;
  window.customElements.get = function(name) {
    if (name === 'review-widget') {
      const existing = originalGet.call(this, name);
      if (existing) {
        // In some dev environments (like HMR), the element might already be defined.
        return existing;
      }
    }
    return originalGet.apply(this, arguments);
  };


  if (!window.customElements.get('review-widget')) {
    window.customElements.define('review-widget', ReviewWidget);
  }
})();
