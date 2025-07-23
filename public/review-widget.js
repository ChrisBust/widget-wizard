
import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

const API_ENDPOINT = "https://reviews-widgetchris.netlify.app/api/widgets";

class ReviewWidget extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      line-height: 1.5;
      color: #333;
    }

    /* Estilos base */
    .container {
      padding: 12px;
      background-color: #f9fafb;
      border-radius: 12px;
      max-width: 100%;
      margin: 0 auto;
    }

    .header {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      margin-bottom: 24px;
      gap: 16px;
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
      justify-content: center;
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
      color: #f59e0b;
    }

    .reviews-count {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .button {
      display: inline-flex;
      align-items: center;
      padding: 12px 24px;
      background-color: #2563eb;
      color: white;
      font-weight: 600;
      border-radius: 8px;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .button:hover {
      background-color: #1d4ed8;
    }

    .button svg {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    /* Tabs */
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
      justify-content: center;
    }

    .tab {
      padding: 8px 16px;
      font-weight: 500;
      font-size: 0.875rem;
      border-radius: 9999px;
      background-color: white;
      color: #374151;
      border: 1px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab:hover {
      background-color: #f3f4f6;
    }

    .tab.active {
      color: white;
      border: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .tab.active.all {
      background-color: #4f46e5;
    }
    .tab.active.website {
      background-color: #4b5563;
    }
    .tab.active.gmb {
      background-color: #2563eb;
    }
    .tab.active.yelp {
      background-color: #ff2121;
    }
    .tab.active.homeadvisor {
      background-color: #f69325;
    }
    .tab.active.angi {
      background-color: #ff6658;
    }
    .tab.active.thumbtack {
      background-color: #08a2d9;
    }
    .tab.active.bbb {
      background-color: #086998;
    }
    .tab.active.chamberofcommerce {
      background-color: #234875;
    }
    /* Reviews grid */
    .reviews-grid {
      display: grid;
      gap: 20px;
      grid-template-columns: 1fr;
      padding: 0;
    }

    .review-card {
      background-color: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 20px;
      padding-top: 32px;
      transition: transform 0.3s ease-in-out;
      position: relative;
    }

    .review-card:hover {
      transform: translateY(-5px);
    }

    .review-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .avatar-container {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
      background-color: #4b5563; /* Color por defecto */
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .review-info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: left !important;
    }

    .author {
      font-weight: 600;
      font-size: 16px;
      color: #111827;
    }

    .date,
    .location {
      font-size: 14px;
      color: #6b7280;
    }

    .source {
      position: absolute !important;
      top: 8px;
      right: 8px;
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-top: 0;
      font-weight: 500;
      text-transform: capitalize;
      width: auto;
      min-width: 60px;
      text-align: center;
    }

    .source.website {
      background-color: #4b5563;
      color: white;
    }
    .source.gmb {
      background-color: #2563eb;
      color: white;
    }
    .source.yelp {
      background-color: #ff2121;
      color: white;
    }
    .source.homeadvisor {
      background-color: #f69325;
      color: white;
    }
    .source.angi {
      background-color: #ff6658;
      color: white;
    }
    .source.thumbtack {
      background-color: #08a2d9;
      color: white;
    }
    .source.bbb {
      background-color: #086998;
      color: white;
    }
    .source.chamberofcommerce {
      background-color: #234875;
      color: white;
    }

    .review-rating {
      font-size: 22px;
      color: #f59e0b;
      margin: 8px 0;
      line-height: 1;
    }

    .review-text {
      font-size: 15px;
      color: #374151;
      line-height: 1.5;
      text-align: left !important;
      word-wrap: break-word;
    }

    .read-more {
      margin-top: 8px;
      font-size: 14px;
      color: #1d4ed8;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      text-align: left;
    }

    .read-more:hover {
      text-decoration: underline;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

    /* Load more button */
    .load-more {
      margin-top: 32px;
      text-align: center;
    }

    .load-more-button {
      padding: 12px 24px;
      background-color: white;
      border: 1px solid #d1d5db;
      color: #374151;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .load-more-button:hover {
      background-color: #f9fafb;
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

    /* Modals */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
      padding: 16px;
      backdrop-filter: blur(4px);
    }

    .modal {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        width: 95%;
        max-width: 448px;
        padding: 24px;
        transform: scale(1);
        transition: transform 0.3s;
        color: #1f2937;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin: 0 auto;
      padding-right: 24px;
    }

    .close-button {
      color: #6b7280;
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.2s;
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .close-button:hover {
      color: #4b5563;
    }

    .close-button svg {
      width: 24px;
      height: 24px;
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
      box-sizing: border-box;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      background-color: #fff;
      color: #1f2937;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .form-textarea {
      min-height: 120px;
      resize: vertical;
    }

    .rating-stars {
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .star-button {
      font-size: 2.25rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      transition: transform 0.2s;
    }

    .star-button:hover {
      transform: scale(1.1);
    }

    .star-button:disabled {
      cursor: not-allowed;
    }

    .star-filled {
      color: #f59e0b;
    }

    .star-empty {
      color: #d1d5db;
    }

    .submit-button {
      width: 100%;
      padding: 12px 16px;
      background-color: #2563eb;
      color: white;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .submit-button:hover {
      background-color: #1d4ed8;
    }

    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-left-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 12px;
    }

    .form-footer {
      margin-top: 16px;
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .form-link {
      color: #2563eb;
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .form-link:hover {
      color: #1e40af;
    }

    /* Alert messages */
    .alert {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.875rem;
    }

    .alert-error {
      background-color: #fef2f2;
      color: #b91c1c;
    }

    .alert-success {
      background-color: #f0fdf4;
      color: #166534;
    }
    
    /* Responsive Media Queries */
    @media (min-width: 640px) {
      .container {
        padding: 24px;
      }
      .header {
        flex-direction: row;
        text-align: left;
      }
      .rating-container {
        justify-content: flex-start;
      }
      .tabs {
        justify-content: flex-start;
      }
      .reviews-grid {
        grid-template-columns: repeat(2, 1fr);
        padding: 16px 0;
      }
       .modal-title {
        font-size: 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .reviews-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `;

  static properties = {
    widgetId: { type: String, reflect: true },
    activeTab: { type: String, reflect: true },
    reviews: { type: Object },
    displayedReviewsCount: { type: Number },
    loading: { type: Boolean },
    overallRating: { type: String },
    totalReviews: { type: Number },
    expandedReview: { type: Number },
    platforms: { type: Array },
    showReviewModal: { type: Boolean },
    reviewStars: { type: Number },
    reviewText: { type: String },
    errorMessage: { type: String },
    successMessage: { type: String },
    formLoading: { type: Boolean },
  };

  constructor() {
    super();
    this.widgetId = "";
    this.activeTab = "all";
    this.reviews = {};
    this.displayedReviewsCount = 9;
    this.loading = true;
    this.overallRating = "0.0";
    this.totalReviews = 0;
    this.expandedReview = null;
    this.platforms = [
      { name: "All", key: "all", color: "#4f46e5", reviews: [] },
      { name: "Website", key: "website", color: "#4b5563", reviews: [] },
    ];
    this.showReviewModal = false;
    this.reviewStars = 5;
    this.reviewText = "";
    this.errorMessage = "";
    this.successMessage = "";
    this.formLoading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.widgetId) {
      this.fetchReviews();
    }
  }

  async fetchReviews() {
    if (!this.widgetId) return;
    this.loading = true;
    try {
      const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      
      this.reviews = {
          businessName: data.data.businessName,
          reviews: data.data.reviews || [],
      };
      
      this.preparePlatformsData();
      this.calculateOverallRating();
      this.setDefaultTab();

    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      this.loading = false;
    }
  }
  
  preparePlatformsData() {
    const allReviews = (this.reviews.reviews || []).map(review => ({
        author: review.name,
        date: new Date(review.createdAt).toLocaleDateString(),
        source: review.source || 'Website',
        rating: review.stars,
        review: review.text,
    })).sort((a, b) => new Date(b.date) - new Date(a.date));

    this.platforms = [
        { name: "All", key: "all", color: "#4f46e5", reviews: allReviews },
        { name: "Website", key: "website", color: "#4b5563", reviews: allReviews },
    ];
    this.requestUpdate();
  }

  calculateOverallRating() {
    const allReviews = this.platforms.find(p => p.key === "all")?.reviews || [];
    if (allReviews.length === 0) {
        this.totalReviews = 0;
        this.overallRating = "0.0";
        return;
    }
    const sum = allReviews.reduce((acc, review) => acc + review.rating, 0);
    this.totalReviews = allReviews.length;
    this.overallRating = (sum / this.totalReviews).toFixed(1);
  }

  setDefaultTab() {
    this.activeTab = "all";
  }

  handleTabClick(tab) {
    this.activeTab = tab;
    this.displayedReviewsCount = 9;
    this.expandedReview = null;
  }

  truncateReview(text, wordLimit) {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
  }
  
  openReviewModal() {
    this.showReviewModal = true;
    this.errorMessage = "";
    this.successMessage = "";
  }
  
  closeAllModals() {
    this.showReviewModal = false;
    this.errorMessage = "";
    this.successMessage = "";
  }

  async handleReviewSubmit(e) {
    e.preventDefault();
    if (this.formLoading) return;

    this.formLoading = true;
    this.errorMessage = "";

    const nameInput = this.shadowRoot.querySelector('#reviewName');
    const authorName = nameInput ? nameInput.value : 'Anonymous';

    try {
        const response = await fetch(`${API_ENDPOINT}/${this.widgetId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: authorName,
                stars: this.reviewStars,
                text: this.reviewText,
                source: 'Direct'
            })
        });
        const data = await response.json();

        if (response.ok) {
            this.successMessage = "Thank you for your review!";
            this.reviewText = "";
            this.reviewStars = 5;
            if(nameInput) nameInput.value = '';
            await this.fetchReviews();
            setTimeout(() => this.closeAllModals(), 2000);
        } else {
            this.errorMessage = data.error || "Failed to submit review";
        }
    } catch (error) {
        this.errorMessage = "Network error. Please try again.";
    } finally {
        this.formLoading = false;
    }
  }


  render() {
    const ratingValue = parseFloat(this.overallRating);
    const totalReviewsCount = this.totalReviews;
    const activePlatform = this.platforms.find(p => p.key === this.activeTab);

    return html`
      <div class="container">
        ${this.loading
          ? html`<div class="loading"><div class="spinner"></div></div>`
          : html`
              <div class="header">
                <div>
                  <h2 class="title">${this.reviews.businessName} Reviews</h2>
                  <div class="rating-container">
                    <div class="rating-value">${ratingValue.toFixed(1)}</div>
                    <div class="stars">
                      ${"★".repeat(Math.round(ratingValue))}${"☆".repeat(5 - Math.round(ratingValue))}
                    </div>
                    <div class="reviews-count">
                      ${totalReviewsCount} review${totalReviewsCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div>
                    <button @click=${this.openReviewModal} class="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" /></svg>
                        Write a Review
                    </button>
                </div>
              </div>

              <div class="tabs">
                  <button
                    class="tab ${this.activeTab === 'all' ? 'active all' : ''}"
                    @click=${() => this.handleTabClick('all')}>
                    All (${this.totalReviews})
                  </button>
              </div>

              ${activePlatform?.reviews.length === 0
                ? html`
                    <div class="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 class="empty-title">No reviews available</h3>
                        <p class="empty-text">
                            There are no reviews yet.
                        </p>
                        <button @click=${this.openReviewModal} class="button" style="margin-top: 16px;">
                            Be the first to review
                        </button>
                    </div>`
                : html`
                    <div class="reviews-grid">
                        ${activePlatform?.reviews.slice(0, this.displayedReviewsCount).map((review, index) => html`
                            <div class="review-card">
                                <span class="source website">Website</span>
                                <div class="review-content">
                                    <div class="review-header">
                                        <div class="avatar-container">
                                            <div class="avatar">${review.author.charAt(0).toUpperCase()}</div>
                                        </div>
                                        <div class="review-info">
                                            <span class="author">${review.author}</span>
                                            <span class="date">${review.date}</span>
                                        </div>
                                    </div>
                                    <div class="review-rating">
                                        ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
                                    </div>
                                    <div class="review-text">
                                        ${this.expandedReview === index ? review.review : this.truncateReview(review.review, 30)}
                                    </div>
                                    ${review.review && review.review.split(" ").length > 30
                                        ? html`<button @click=${() => this.expandedReview = this.expandedReview === index ? null : index} class="read-more">
                                                ${this.expandedReview === index ? "Show less" : "Read more"}
                                            </button>`
                                        : ""}
                                </div>
                            </div>
                        `)}
                    </div>
                    ${activePlatform?.reviews.length > this.displayedReviewsCount
                        ? html`
                            <div class="load-more">
                                <button @click=${() => this.displayedReviewsCount += 9} class="load-more-button">
                                    Load More Reviews
                                </button>
                            </div>`
                        : ""}
                `}
        `}
        ${this.showReviewModal ? this.renderReviewModal() : ""}
      </div>
    `;
  }
  
  renderReviewModal() {
    return html`
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Write a Review</h3>
            <button @click=${this.closeAllModals} class="close-button" ?disabled=${this.formLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit=${this.handleReviewSubmit}>
            ${this.errorMessage ? html`<div class="alert alert-error">${this.errorMessage}</div>` : ""}
            ${this.successMessage ? html`<div class="alert alert-success">${this.successMessage}</div>` : ""}

            <div class="form-group">
                <label class="form-label">Your Name</label>
                <input id="reviewName" type="text" required class="form-input" ?disabled=${this.formLoading} />
            </div>

            <div class="form-group">
              <label class="form-label">Your Rating</label>
              <div class="rating-stars">
                ${[1, 2, 3, 4, 5].map(star => html`
                  <button type="button" class="star-button ${this.reviewStars >= star ? 'star-filled' : 'star-empty'}" @click=${() => this.reviewStars = star} ?disabled=${this.formLoading}>
                    ★
                  </button>
                `)}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Your Review</label>
              <textarea .value=${this.reviewText} @input=${e => this.reviewText = e.target.value} rows="5" required class="form-textarea" ?disabled=${this.formLoading} placeholder="Share your experience..."></textarea>
            </div>

            <button type="submit" ?disabled=${this.formLoading} class="submit-button">
              ${this.formLoading ? html`<span class="spinner-small"></span> Submitting...` : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define("review-widget", ReviewWidget);
