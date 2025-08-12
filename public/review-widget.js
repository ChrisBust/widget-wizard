(function() {
    class ReviewWidget extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.apiBaseUrl = 'https://widget-wizard-chris.netlify.app'; // Hardcoded API base URL
        }

        connectedCallback() {
            const widgetId = this.getAttribute('widgetId');
            
            if (!widgetId) {
                console.error('Widget ID is missing.');
                this.shadowRoot.innerHTML = `<div style="color: red; font-family: sans-serif;">Error: Widget ID is missing.</div>`;
                return;
            }

            this.widgetId = widgetId;
            this.render();
            this.fetchWidgetData();
        }

        static get observedAttributes() {
            return ['widgetId'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'widgetId' && oldValue !== newValue) {
                this.widgetId = newValue;
                this.fetchWidgetData();
            }
        }

        render() {
            this.shadowRoot.innerHTML = `
                <style>
                    /* Tailwind-like reset and base styles */
                    :host {
                        display: block;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        --rw-primary: #6d28d9;
                        --rw-background: #ffffff;
                        --rw-card: #f9fafb;
                        --rw-text: #1f2937;
                        --rw-muted-text: #6b7280;
                        --rw-border: #e5e7eb;
                        --rw-accent: #f59e0b;
                    }
                    * {
                        box-sizing: border-box;
                    }
                    /* Component specific styles */
                    .rw-container {
                        background-color: var(--rw-background);
                        color: var(--rw-text);
                        padding: 1.5rem;
                        border-radius: 0.5rem;
                        border: 1px solid var(--rw-border);
                        max-width: 800px;
                        margin: auto;
                    }
                    .rw-header {
                        margin-bottom: 1.5rem;
                    }
                    .rw-business-name {
                        font-size: 1.875rem;
                        font-weight: bold;
                    }
                    .rw-website {
                        color: var(--rw-primary);
                        text-decoration: none;
                    }
                    .rw-website:hover {
                        text-decoration: underline;
                    }
                    .rw-summary {
                        display: grid;
                        grid-template-columns: 1fr 2fr;
                        gap: 1.5rem;
                        margin-bottom: 2rem;
                    }
                    .rw-summary-card {
                        background-color: var(--rw-card);
                        border: 1px solid var(--rw-border);
                        border-radius: 0.5rem;
                        padding: 1.5rem;
                    }
                    .rw-overall-rating {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .rw-overall-rating .rating-value {
                        font-size: 3rem;
                        font-weight: bold;
                    }
                    .rw-overall-rating .rating-text {
                        color: var(--rw-muted-text);
                        margin-top: 0.5rem;
                    }
                    .rw-star-rating {
                        display: flex;
                        gap: 0.125rem;
                    }
                    .rw-star {
                        width: 1.25rem;
                        height: 1.25rem;
                        fill: var(--rw-accent);
                        color: var(--rw-accent);
                    }
                     .rw-star.empty {
                        fill: var(--rw-border);
                        color: var(--rw-border);
                    }
                    .rw-distribution .dist-row {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    .rw-distribution .dist-row .progress-bar {
                        width: 100%;
                        background-color: #e5e7eb;
                        height: 0.5rem;
                        border-radius: 9999px;
                        overflow: hidden;
                    }
                    .rw-distribution .dist-row .progress {
                        background-color: var(--rw-accent);
                        height: 100%;
                    }
                    .rw-reviews-section .section-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1rem;
                    }
                     .rw-reviews-section .section-header h2 {
                        font-size: 1.25rem;
                        font-weight: bold;
                        margin: 0;
                    }
                    .rw-button {
                        background-color: var(--rw-primary);
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 0.375rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .rw-button:hover {
                        background-color: #5b21b6;
                    }
                    .rw-carousel {
                        position: relative;
                    }
                    .rw-carousel-content {
                        display: flex;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none; /* Firefox */
                    }
                    .rw-carousel-content::-webkit-scrollbar {
                        display: none; /* Safari and Chrome */
                    }
                    .rw-carousel-item {
                        flex: 0 0 100%;
                        padding: 0.25rem;
                        scroll-snap-align: start;
                    }
                    @media (min-width: 768px) {
                        .rw-carousel-item {
                            flex-basis: 50%;
                        }
                    }
                    @media (min-width: 1024px) {
                        .rw-carousel-item {
                            flex-basis: 33.3333%;
                        }
                    }
                    .rw-review-card {
                        background-color: var(--rw-card);
                        border: 1px solid var(--rw-border);
                        border-radius: 0.5rem;
                        padding: 1.5rem;
                        height: 100%;
                    }
                    .rw-review-card .card-header {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        margin-bottom: 1rem;
                    }
                     .rw-review-card .card-header .avatar {
                        width: 2.5rem;
                        height: 2.5rem;
                        border-radius: 9999px;
                        background-color: var(--rw-muted-text);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    }
                     .rw-review-card .card-header .author-info .name {
                        font-weight: 600;
                    }
                     .rw-review-card .card-header .author-info .source {
                        font-size: 0.75rem;
                        color: var(--rw-muted-text);
                    }
                    .rw-dialog-overlay {
                        position: fixed;
                        inset: 0;
                        background-color: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                    }
                    .rw-dialog-content {
                        background-color: white;
                        padding: 1.5rem;
                        border-radius: 0.5rem;
                        max-width: 400px;
                        width: 90%;
                    }
                    .rw-form-group {
                        margin-bottom: 1rem;
                    }
                    .rw-form-group label {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-weight: 500;
                    }
                    .rw-form-group input, .rw-form-group textarea {
                        width: 100%;
                        padding: 0.5rem;
                        border: 1px solid var(--rw-border);
                        border-radius: 0.375rem;
                    }
                    .rw-dialog-footer {
                        text-align: right;
                        margin-top: 1.5rem;
                    }
                    .rw-carousel-nav {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background-color: white;
                        border: 1px solid var(--rw-border);
                        border-radius: 9999px;
                        width: 2rem;
                        height: 2rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .rw-carousel-nav.prev { left: -1rem; }
                    .rw-carousel-nav.next { right: -1rem; }
                </style>
                <div id="rw-loader">Loading widget...</div>
                <div id="rw-container" class="rw-container" style="display: none;"></div>
            `;
        }
        
        async fetchWidgetData() {
            const container = this.shadowRoot.querySelector('#rw-container');
            const loader = this.shadowRoot.querySelector('#rw-loader');
            
            try {
                const response = await fetch(`${this.apiBaseUrl}/api/widgets/${this.widgetId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const result = await response.json();
                if (!result.success) throw new Error(result.error || 'Failed to fetch widget data');
                
                this.widgetData = result.data;
                this.renderWidgetContent();
                
                loader.style.display = 'none';
                container.style.display = 'block';

            } catch(error) {
                console.error('Failed to load widget:', error);
                loader.innerHTML = `<div style="color: red; font-family: sans-serif;">Error: Could not load widget.</div>`;
            }
        }
        
        renderWidgetContent() {
            const container = this.shadowRoot.querySelector('#rw-container');
            if (!this.widgetData) return;

            const { businessName, website, reviews } = this.widgetData;

            const totalReviews = reviews.length;
            const overallRating = totalReviews > 0 ? reviews.reduce((acc, r) => acc + r.stars, 0) / totalReviews : 0;
            const ratingDistribution = [0, 0, 0, 0, 0];
            if (totalReviews > 0) {
              reviews.forEach(r => ratingDistribution[5 - r.stars]++);
            }
            
            const sortedReviews = reviews ? [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];


            container.innerHTML = `
                <header class="rw-header">
                    <h1 class="rw-business-name">${businessName}</h1>
                    <a href="${website}" target="_blank" rel="noopener noreferrer" class="rw-website">${website}</a>
                </header>

                ${totalReviews > 0 ? `
                <div class="rw-summary">
                    <div class="rw-summary-card rw-overall-rating">
                        <p class="rating-value">${overallRating.toFixed(1)}</p>
                        ${this.renderStars(overallRating)}
                        <p class="rating-text">Based on ${totalReviews} reviews</p>
                    </div>
                    <div class="rw-summary-card rw-distribution">
                        ${ratingDistribution.map((count, i) => `
                            <div class="dist-row">
                                <span class="dist-label">${5 - i}</span>
                                ${this.renderStars(1, 1, 'rw-star-sm')}
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${(count / totalReviews) * 100}%"></div>
                                </div>
                                <span class="dist-count">${count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}

                <div class="rw-reviews-section">
                    <div class="section-header">
                        <h2>${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                        <button class="rw-button" id="rw-write-review-btn">Write a Review</button>
                    </div>

                    ${totalReviews > 0 ? `
                    <div class="rw-carousel">
                        <div class="rw-carousel-content">
                            ${sortedReviews.map(review => `
                                <div class="rw-carousel-item">
                                    <div class="rw-review-card">
                                        <div class="card-header">
                                            <div class="avatar">${review.name.charAt(0)}</div>
                                            <div class="author-info">
                                                <p class="name">${review.name}</p>
                                                <p class="source">${review.source} review</p>
                                            </div>
                                        </div>
                                        ${this.renderStars(review.stars)}
                                        <p class="card-text">${review.text}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="rw-carousel-nav prev">&lt;</button>
                        <button class="rw-carousel-nav next">&gt;</button>
                    </div>
                    ` : `
                    <div style="text-align: center; padding: 2rem; border: 2px dashed #e5e7eb; border-radius: 0.5rem; color: #6b7280;">
                        <p>No reviews yet.</p>
                    </div>
                    `}
                </div>
            `;
            
            this.setupEventListeners();
        }
        
        renderStars(rating, totalStars = 5, className = '') {
            let starsHtml = '<div class="rw-star-rating">';
            for (let i = 0; i < totalStars; i++) {
                starsHtml += `<svg class="rw-star ${i < Math.round(rating) ? '' : 'empty'} ${className}" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.958c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.958a1 1 0 00-.364-1.118L2.25 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>`;
            }
            starsHtml += '</div>';
            return starsHtml;
        }
        
        setupEventListeners() {
            const writeReviewBtn = this.shadowRoot.querySelector('#rw-write-review-btn');
            writeReviewBtn.addEventListener('click', () => this.showAddReviewDialog());

            const carouselContent = this.shadowRoot.querySelector('.rw-carousel-content');
            if (carouselContent) {
                const prevBtn = this.shadowRoot.querySelector('.rw-carousel-nav.prev');
                const nextBtn = this.shadowRoot.querySelector('.rw-carousel-nav.next');
                const itemWidth = carouselContent.querySelector('.rw-carousel-item').clientWidth;

                prevBtn.addEventListener('click', () => {
                    carouselContent.scrollBy({ left: -itemWidth, behavior: 'smooth' });
                });
                nextBtn.addEventListener('click', () => {
                    carouselContent.scrollBy({ left: itemWidth, behavior: 'smooth' });
                });
            }
        }
        
        showAddReviewDialog() {
            const dialog = document.createElement('div');
            dialog.className = 'rw-dialog-overlay';
            dialog.innerHTML = `
                <div class="rw-dialog-content">
                    <h3>Write a review</h3>
                    <p style="color: var(--rw-muted-text); margin-top: -0.5rem; margin-bottom: 1rem;">Share your experience with ${this.widgetData.businessName}.</p>
                    <form id="rw-review-form">
                        <div class="rw-form-group">
                            <label for="rw-name">Your Name</label>
                            <input type="text" id="rw-name" name="name" required>
                        </div>
                        <div class="rw-form-group">
                            <label>Rating</label>
                            <div class="rw-star-rating" id="rw-form-stars">
                                ${[1, 2, 3, 4, 5].map(i => `<svg data-value="${i}" class="rw-star empty" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.958c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.958a1 1 0 00-.364-1.118L2.25 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path></svg>`).join('')}
                            </div>
                            <input type="hidden" name="stars" id="rw-stars-input" value="0">
                        </div>
                        <div class="rw-form-group">
                            <label for="rw-text">Review</label>
                            <textarea id="rw-text" name="text" required></textarea>
                        </div>
                        <div class="rw-dialog-footer">
                            <button type="button" class="rw-button" id="rw-cancel-btn" style="background: #9ca3af; margin-right: 0.5rem;">Cancel</button>
                            <button type="submit" class="rw-button">Submit Review</button>
                        </div>
                        <div id="rw-form-message" style="margin-top: 1rem; text-align: center;"></div>
                    </form>
                </div>
            `;
            this.shadowRoot.appendChild(dialog);

            const starContainer = dialog.querySelector('#rw-form-stars');
            let currentRating = 0;

            starContainer.addEventListener('mouseover', e => {
                if (e.target.tagName !== 'svg') return;
                const rating = e.target.dataset.value;
                this.updateStars(starContainer, rating);
            });
            starContainer.addEventListener('mouseout', () => {
                 this.updateStars(starContainer, currentRating);
            });
            starContainer.addEventListener('click', e => {
                if (e.target.tagName !== 'svg') return;
                currentRating = e.target.dataset.value;
                dialog.querySelector('#rw-stars-input').value = currentRating;
                this.updateStars(starContainer, currentRating);
            });

            dialog.querySelector('#rw-cancel-btn').addEventListener('click', () => dialog.remove());
            dialog.querySelector('.rw-dialog-overlay').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    dialog.remove();
                }
            });
            dialog.querySelector('#rw-review-form').addEventListener('submit', (e) => this.handleReviewSubmit(e, dialog));
        }

        updateStars(container, rating) {
            const stars = container.querySelectorAll('.rw-star');
            stars.forEach(star => {
                star.classList.toggle('empty', star.dataset.value > rating);
            });
        }

        async handleReviewSubmit(event, dialog) {
            event.preventDefault();
            const form = event.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const messageEl = dialog.querySelector('#rw-form-message');
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                stars: parseInt(formData.get('stars'), 10),
                text: formData.get('text'),
            };

            if (data.stars === 0) {
                messageEl.textContent = 'Please select a star rating.';
                messageEl.style.color = 'red';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            messageEl.textContent = '';

            try {
                const response = await fetch(`${this.apiBaseUrl}/api/widgets/${this.widgetId}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to submit review.');
                }
                
                messageEl.textContent = 'Thank you for your review!';
                messageEl.style.color = 'green';

                setTimeout(() => {
                    dialog.remove();
                    this.fetchWidgetData(); // Refresh widget data
                }, 1500);

            } catch (error) {
                messageEl.textContent = error.message;
                messageEl.style.color = 'red';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
            }
        }
    }

    customElements.define('review-widget', ReviewWidget);
})();
