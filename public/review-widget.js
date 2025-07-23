
(function () {
  'use strict';

  const API_ENDPOINT = 'https://reviews-widgetchris.netlify.app/api/widgets';
  
  class ReviewWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.widgetId = this.getAttribute('widgetId');
      this.state = {
        widget: null,
        loading: true,
        error: null,
        showForm: false,
        rating: 0,
        hoverRating: 0
      };
    }

    connectedCallback() {
      if (!this.widgetId) {
        this.state.error = "Error: widgetId attribute is missing.";
        this.state.loading = false;
        this.render();
        return;
      }
      this.render();
      this.fetchWidgetData();
    }
    
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.render();
    }

    async fetchWidgetData() {
      this.setState({ loading: true });
      try {
        const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to load widget data.');
        }

        // Sort reviews by creation date, newest first
        const sortedReviews = data.data.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        data.data.reviews = sortedReviews;
        
        this.setState({ widget: data.data, loading: false, error: null });
      } catch (error) {
        this.setState({ error: error.message, loading: false });
      }
    }

    get overallRating() {
      if (!this.state.widget?.reviews || this.state.widget.reviews.length === 0) return 0;
      const total = this.state.widget.reviews.reduce((acc, r) => acc + r.stars, 0);
      return total / this.state.widget.reviews.length;
    }

    get ratingDistribution() {
      const distribution = [0, 0, 0, 0, 0];
      if (!this.state.widget?.reviews) return distribution;
      for (const review of this.state.widget.reviews) {
        distribution[5 - review.stars]++;
      }
      return distribution;
    }

    renderStarRating(rating, iconClassName = '') {
      let stars = '';
      for (let i = 0; i < 5; i++) {
        const isFilled = i < Math.round(rating);
        stars += `
          <svg class="star ${iconClassName} ${isFilled ? 'filled' : ''}" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        `;
      }
      return `<div class="star-rating">${stars}</div>`;
    }

    handleShowForm() {
      this.setState({ showForm: true, rating: 0 });
    }

    handleCloseForm() {
      this.setState({ showForm: false });
    }
    
    handleRating(star) {
        this.setState({ rating: star });
    }
    
    handleHoverRating(star) {
        this.shadowRoot.querySelectorAll('.star-btn svg').forEach((svg, i) => {
            svg.classList.toggle('hover', i < star);
        });
    }

    async handleAddReviewSuccess() {
      this.setState({ showForm: false });
      await this.fetchWidgetData();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const name = e.target.name.value;
        const text = e.target.text.value;
        const stars = this.state.rating;

        if (stars === 0) {
            alert('Please select a star rating.');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Review';
            return;
        }

        try {
            const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, stars, text, source: 'Direct' }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit review.');
            }
            
            await this.handleAddReviewSuccess();

        } catch (error) {
            alert(`Error: ${error.message}`);
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Review';
        }
    }

    render() {
      const { widget, loading, error, showForm } = this.state;

      const styles = `
        :host {
            --w-font-family: Arial, Helvetica, sans-serif;
            --w-background: hsl(240 10% 3.9%);
            --w-foreground: hsl(0 0% 98%);
            --w-card: hsl(240 4.8% 9.8%);
            --w-card-foreground: hsl(0 0% 98%);
            --w-primary: hsl(262.1 83.3% 57.8%);
            --w-primary-foreground: hsl(0 0% 98%);
            --w-muted-foreground: hsl(240 5% 64.9%);
            --w-accent: hsl(333.3 83.3% 57.8%);
            --w-border: hsl(240 3.7% 15.9%);
            --w-input: hsl(240 3.7% 15.9%);
            --w-ring: hsl(262.1 83.3% 57.8%);
            --w-radius: 0.8rem;
            display: block;
            font-family: var(--w-font-family);
            box-sizing: border-box;
        }
        *, *:before, *:after { box-sizing: inherit; }

        .widget-container {
            background-color: var(--w-background);
            color: var(--w-foreground);
            padding: 1rem;
            width: 100%;
        }
        @media (min-width: 640px) {
            .widget-container { padding: 1.5rem; }
        }

        .widget-header {
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        @media (min-width: 768px) {
            .widget-header {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
        }

        .header-title {
            font-size: 1.875rem;
            font-weight: 700;
        }
        .header-link {
            color: var(--w-primary);
            text-decoration: none;
        }
        .header-link:hover { text-decoration: underline; }

        .stats-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
            .stats-grid { grid-template-columns: 1fr 2fr; }
        }
        
        .card {
            border: 1px solid var(--w-border);
            background-color: var(--w-card);
            color: var(--w-card-foreground);
            border-radius: var(--w-radius);
            padding: 1.5rem;
        }

        .overall-rating-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .overall-rating-score {
            font-size: 3rem;
            font-weight: 700;
            line-height: 1;
        }
        .based-on-text { color: var(--w-muted-foreground); margin-top: 0.5rem; }

        .distribution-title { font-weight: 600; margin-bottom: 0.75rem; }
        .distribution-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
        .distribution-row:not(:last-child) { margin-bottom: 0.5rem; }
        .distribution-label { color: var(--w-muted-foreground); width: 1.5rem; text-align: right; }
        .distribution-bar { flex-grow: 1; height: 0.5rem; background-color: var(--w-input); border-radius: 999px; overflow: hidden; }
        .distribution-bar-inner { height: 100%; background-color: var(--w-primary); }
        .distribution-count { color: var(--w-muted-foreground); width: 2rem; text-align: right; }

        .reviews-header { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
        @media (min-width: 768px) {
            .reviews-header { flex-direction: row; align-items: center; justify-content: space-between; }
        }
        .reviews-title { font-size: 1.25rem; font-weight: 700; }
        
        .reviews-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 768px) {
            .reviews-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
            .reviews-grid { grid-template-columns: repeat(3, 1fr); }
        }
        
        .review-card { display: flex; flex-direction: column; height: 100%; }
        .review-card-content { flex-grow: 1; }
        .review-author { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .review-author-avatar { height: 2.5rem; width: 2.5rem; border-radius: 9999px; background-color: var(--w-muted-foreground); color: var(--w-background); display: flex; align-items: center; justify-content: center; font-weight: 600; }
        .review-author-name { font-weight: 600; }
        .review-author-source { font-size: 0.75rem; color: var(--w-muted-foreground); }
        .review-text { font-size: 0.875rem; color: hsla(var(--w-foreground), 0.8); padding-top: 0.5rem; }

        .star-rating { display: flex; gap: 0.125rem; }
        .star { height: 1.25rem; width: 1.25rem; color: var(--w-muted-foreground); fill: transparent; }
        .star.filled { color: var(--w-accent); fill: var(--w-accent); }

        .empty-state { text-align: center; padding: 5rem 0; border: 2px dashed var(--w-border); border-radius: var(--w-radius); background-color: var(--w-card); color: var(--w-muted-foreground); }
        .empty-state-icon { margin: 0 auto 1rem; height: 3rem; width: 3rem; }
        .empty-state-title { font-size: 1.25rem; font-weight: 600; }
        
        .footer { text-align: center; margin-top: 3rem; font-size: 0.875rem; color: var(--w-muted-foreground); }

        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; z-index: 50; background-color: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; }
        .modal-content {
            background-color: var(--w-card);
            color: var(--w-card-foreground);
            padding: 1.5rem;
            border-radius: var(--w-radius);
            max-width: 90%;
            width: 425px;
            position: relative;
            border: 1px solid var(--w-border);
        }
        @media (max-width: 480px) {
            .modal-content { max-width: calc(100% - 2rem); }
        }

        .modal-header { text-align: center; margin-bottom: 1rem; }
        .modal-title { font-size: 1.25rem; font-weight: 600; }
        .modal-description { font-size: 0.875rem; color: var(--w-muted-foreground); }
        .modal-close-btn { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--w-muted-foreground); font-size: 1.5rem; cursor: pointer; line-height: 1; padding: 0; }
        
        .form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-label { font-size: 0.875rem; font-weight: 500; }
        .form-input, .form-textarea {
            width: 100%;
            background-color: var(--w-input);
            border: 1px solid var(--w-border);
            color: var(--w-foreground);
            border-radius: calc(var(--w-radius) - 4px);
            padding: 0.75rem;
            font-size: 0.875rem;
        }
        .form-input:focus, .form-textarea:focus {
            outline: none;
            border-color: var(--w-primary);
            box-shadow: 0 0 0 2px var(--w-ring);
        }
        .form-textarea { min-height: 80px; resize: vertical; }

        .rating-stars { display: flex; gap: 0.25rem; }
        .star-btn { background: none; border: none; padding: 0; cursor: pointer; color: var(--w-muted-foreground); }
        .star-btn svg { width: 1.5rem; height: 1.5rem; transition: color 0.2s ease-in-out; }
        .star-btn.rated svg, .star-btn.hover svg { color: var(--w-accent); }
        
        .form-footer { display: flex; justify-content: flex-end; }
        .button {
            display: inline-flex; align-items: center; justify-content: center; border-radius: calc(var(--w-radius) - 4px);
            font-size: 0.875rem; font-weight: 500; height: 2.5rem; padding: 0 1rem;
            background-color: var(--w-primary); color: var(--w-primary-foreground);
            cursor: pointer; border: none; transition: background-color 0.2s;
        }
        .button:hover { background-color: hsl(var(--w-primary) / 0.9); }
        .button:disabled { background-color: var(--w-secondary); cursor: not-allowed; }
      `;

      if (loading) {
        this.shadowRoot.innerHTML = `<style>${styles}</style><div class="widget-container">Loading...</div>`;
        return;
      }

      if (error) {
        this.shadowRoot.innerHTML = `<style>${styles}</style><div class="widget-container">Error: ${error}</div>`;
        return;
      }
      
      const totalReviews = widget.reviews.length;
      const overallRating = this.overallRating;
      const ratingDistribution = this.ratingDistribution;
      
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="widget-container">
            <header class="widget-header">
                <div>
                    <h1 class="header-title">${widget.businessName}</h1>
                    <a href="${widget.website}" target="_blank" rel="noopener noreferrer" class="header-link">${widget.website}</a>
                </div>
                <button class="button write-review-btn">Write a Review</button>
            </header>

            ${totalReviews > 0 ? `
                <div class="stats-grid">
                    <div class="card overall-rating-card">
                        <p class="overall-rating-score">${overallRating.toFixed(1)}</p>
                        ${this.renderStarRating(overallRating)}
                        <p class="based-on-text">Based on ${totalReviews} reviews</p>
                    </div>
                    <div class="card">
                        <h2 class="distribution-title">Rating distribution</h2>
                        ${ratingDistribution.map((count, i) => `
                            <div class="distribution-row">
                                <span class="distribution-label">${5 - i}</span>
                                ${this.renderStarRating(1, 'small')}
                                <div class="distribution-bar">
                                    <div class="distribution-bar-inner" style="width: ${(count / totalReviews) * 100}%"></div>
                                </div>
                                <span class="distribution-count">${count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `: ''}

            <div class="reviews-header">
                <h2 class="reviews-title">${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                ${totalReviews > 0 ? '' : `<button class="button write-review-btn">Write a Review</button>`}
            </div>

            ${totalReviews > 0 ? `
                <div class="reviews-grid">
                    ${widget.reviews.map(review => `
                        <div class="card review-card">
                            <div class="review-card-content">
                                <div class="review-author">
                                    <div class="review-author-avatar">${review.name.charAt(0)}</div>
                                    <div>
                                        <p class="review-author-name">${review.name}</p>
                                        <p class="review-author-source">${review.source} review</p>
                                    </div>
                                </div>
                                ${this.renderStarRating(review.stars)}
                                <p class="review-text">${review.text}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="empty-state">
                    <svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    <h3 class="empty-state-title">No reviews yet</h3>
                    <p>Your widget is ready to collect feedback.</p>
                </div>
            `}

            <footer class="footer">
                <p>Powered by Widget Wizard</p>
            </footer>
        </div>
        
        ${showForm ? `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close-btn">&times;</button>
                    <div class="modal-header">
                        <h3 class="modal-title">Write a review</h3>
                        <p class="modal-description">Share your experience with ${widget.businessName}.</p>
                    </div>
                    <form class="form add-review-form">
                        <div class="form-group">
                            <label for="name" class="form-label">Your Name</label>
                            <input id="name" name="name" required class="form-input" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Rating</label>
                            <div class="rating-stars">
                                ${[1, 2, 3, 4, 5].map(star => `
                                    <button type="button" class="star-btn ${this.state.rating >= star ? 'rated' : ''}" data-star="${star}">
                                        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="text" class="form-label">Review</label>
                            <textarea id="text" name="text" required class="form-textarea"></textarea>
                        </div>
                        <div class="form-footer">
                            <button type="submit" class="button">Submit Review</button>
                        </div>
                    </form>
                </div>
            </div>
        ` : ''}
      `;

      this.shadowRoot.querySelectorAll('.write-review-btn').forEach(btn => btn.addEventListener('click', () => this.handleShowForm()));
      if(showForm) {
          this.shadowRoot.querySelector('.modal-overlay').addEventListener('click', (e) => {
              if(e.target === this.shadowRoot.querySelector('.modal-overlay')) {
                  this.handleCloseForm();
              }
          });
          this.shadowRoot.querySelector('.modal-close-btn').addEventListener('click', () => this.handleCloseForm());
          this.shadowRoot.querySelector('.add-review-form').addEventListener('submit', (e) => this.handleSubmit(e));
          
          const starButtons = this.shadowRoot.querySelectorAll('.star-btn');
          starButtons.forEach(btn => {
              btn.addEventListener('click', () => this.handleRating(parseInt(btn.dataset.star)));
              btn.addEventListener('mouseenter', () => this.handleHoverRating(parseInt(btn.dataset.star)));
              btn.addEventListener('mouseleave', () => this.handleHoverRating(this.state.rating));
          });
      }
    }
  }

  if (!window.customElements.get('review-widget')) {
    window.customElements.define('review-widget', ReviewWidget);
  }

})();
