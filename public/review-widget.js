
class ReviewWidget {
    constructor(widgetId, apiBaseUrl) {
        if (!widgetId) throw new Error('Widget ID is missing.');
        this.widgetId = widgetId;
        this.apiBaseUrl = apiBaseUrl;
        this.widgetElement = document.querySelector(`review-widget[widgetId="${this.widgetId}"]`);
        if (!this.widgetElement) {
             console.error(`Element with selector 'review-widget[widgetId="${this.widgetId}"]' not found.`);
            return;
        }
        this.injectStyles();
        this.render();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --rw-primary: #6c47ff;
                --rw-accent: #f5a623;
                --rw-background: #ffffff;
                --rw-card-background: #ffffff;
                --rw-foreground: #111827;
                --rw-muted-foreground: #6b7280;
                --rw-border: #e5e7eb;
                --rw-font-body: 'Inter', sans-serif;
            }
            .dark {
                --rw-primary: #8a7ffc;
                --rw-accent: #f5a623;
                --rw-background: #111827;
                --rw-card-background: #1f2937;
                --rw-foreground: #f9fafb;
                --rw-muted-foreground: #9ca3af;
                --rw-border: #374151;
            }
            .rw-container {
                font-family: var(--rw-font-body);
                background-color: var(--rw-background);
                color: var(--rw-foreground);
                padding: 1.5rem;
                max-width: 100%;
                margin: 0 auto;
                box-sizing: border-box;
            }
            .rw-header { margin-bottom: 1.5rem; text-align: center; }
            .rw-header h1 { font-size: 1.875rem; font-weight: bold; }
            .rw-stats-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem; }
            @media (min-width: 768px) { .rw-stats-grid { grid-template-columns: 1fr 2fr; } }
            .rw-card { border: 1px solid var(--rw-border); border-radius: 0.75rem; background-color: var(--rw-card-background); padding: 1.5rem; }
            .rw-overall-rating { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
            .rw-overall-rating p:first-child { font-size: 3rem; font-weight: bold; }
            .rw-overall-rating p:last-child { color: var(--rw-muted-foreground); margin-top: 0.5rem; }
            .rw-star-rating { display: flex; align-items: center; gap: 0.125rem; }
            .rw-star { width: 1.25rem; height: 1.25rem; }
            .rw-star.filled { color: var(--rw-accent); fill: var(--rw-accent); }
            .rw-star.empty { color: var(--rw-muted-foreground); opacity: 0.3; }
            .rw-distribution h2 { font-weight: 600; margin-bottom: 0.75rem; }
            .rw-distribution-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
            .rw-distribution-row .rw-star { width: 1rem; height: 1rem; }
            .rw-progress-bar { flex-grow: 1; height: 0.5rem; background-color: #e5e7eb; border-radius: 9999px; overflow: hidden; }
            .rw-progress { height: 100%; background-color: var(--rw-accent); border-radius: 9999px; }
            .rw-reviews-header { display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 1rem; }
            @media (min-width: 640px) { .rw-reviews-header { flex-direction: row; } }
            .rw-reviews-header h2 { font-size: 1.25rem; font-weight: bold; }
            .rw-button { background-color: var(--rw-primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
            .rw-reviews-grid { 
                display: grid;
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
             @media (min-width: 640px) {
                .rw-reviews-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (min-width: 1024px) {
                .rw-reviews-grid { grid-template-columns: repeat(3, 1fr); }
            }
            .rw-review-card { display: flex; flex-direction: column; height: 100%; word-wrap: break-word; }
            .rw-review-card-content { flex-grow: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
            .rw-review-author { display: flex; align-items: center; gap: 0.75rem; }
            .rw-avatar { width: 2.5rem; height: 2.5rem; border-radius: 9999px; background-color: var(--rw-muted-foreground); color: var(--rw-background); display: flex; align-items: center; justify-content: center; font-weight: bold; }
            .rw-author-info p:first-child { font-weight: 600; }
            .rw-author-info p:last-child { font-size: 0.75rem; color: var(--rw-muted-foreground); }
            .rw-review-text { font-size: 0.875rem; color: var(--rw-foreground); opacity: 0.9; padding-top: 0.5rem; }
            .rw-no-reviews { text-align: center; padding: 4rem 0; border: 2px dashed var(--rw-border); border-radius: 0.75rem; color: var(--rw-muted-foreground); }
            .rw-modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
            .rw-modal-content { background: var(--rw-card-background); padding: 2rem; border-radius: 0.75rem; max-width: 500px; width: 100%; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-height: 90vh; overflow-y: auto; }
            .rw-modal-header h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; }
            .rw-modal-header p { color: var(--rw-muted-foreground); margin-bottom: 1.5rem; }
            .rw-modal-form { display: flex; flex-direction: column; gap: 1rem; }
            .rw-modal-form label { font-weight: 500; font-size: 0.875rem; }
            .rw-modal-form input, .rw-modal-form textarea { 
                width: 100%; 
                padding: 0.75rem; 
                border-radius: 0.5rem; 
                border: 1px solid var(--rw-border); 
                background-color: var(--rw-background); 
                color: var(--rw-foreground); 
                font-size: 1rem;
                box-sizing: border-box;
            }
            .rw-modal-stars .rw-star { width: 1.75rem; height: 1.75rem; cursor: pointer; }
            .rw-modal-footer { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }
            .rw-button-secondary { background-color: transparent; border: 1px solid var(--rw-border); color: var(--rw-foreground); }
        `;
        document.head.appendChild(style);
        const fontLink = document.createElement('link');
        fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
    }
    
    async fetchData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/widgets/${this.widgetId}`);
            if (!response.ok) throw new Error('Failed to fetch widget data');
            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    renderStarRating(rating, className = '', iconClassName = '') {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<svg class="rw-star ${iconClassName} ${i < Math.round(rating) ? 'filled' : 'empty'}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"></path></svg>`;
        }
        return `<div class="rw-star-rating ${className}">${stars}</div>`;
    }

    render() {
        this.fetchData().then(widget => {
            if (!widget) {
                this.widgetElement.innerHTML = '<p>Error loading widget.</p>';
                return;
            }

            const totalReviews = widget.reviews.length;
            const overallRating = totalReviews > 0 ? widget.reviews.reduce((acc, r) => acc + r.stars, 0) / totalReviews : 0;
            const ratingDistribution = Array(5).fill(0);
            if (totalReviews > 0) {
                 widget.reviews.forEach(r => ratingDistribution[5 - r.stars]++);
            }
             const sortedReviews = widget.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


            let content = `<div class="rw-container">`;
            content += `<header class="rw-header"><h1>${widget.businessName}</h1></header>`;

            if (totalReviews > 0) {
                content += `
                <div class="rw-stats-grid">
                    <div class="rw-card rw-overall-rating">
                        <p>${overallRating.toFixed(1)}</p>
                        ${this.renderStarRating(overallRating)}
                        <p>Based on ${totalReviews} reviews</p>
                    </div>
                    <div class="rw-card rw-distribution">
                        <h2>Rating distribution</h2>
                        ${ratingDistribution.map((count, i) => `
                            <div class="rw-distribution-row">
                                <span>${5 - i}</span>
                                ${this.renderStarRating(1, '', 'filled')}
                                <div class="rw-progress-bar"><div class="rw-progress" style="width: ${(count / totalReviews) * 100}%"></div></div>
                                <span style="width: 2rem; text-align: right;">${count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            content += `
                <div class="rw-reviews-section">
                    <div class="rw-reviews-header">
                        <h2>${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                        <button class="rw-button" id="rw-write-review-btn">Write a Review</button>
                    </div>
                    ${totalReviews > 0 ? `
                        <div class="rw-reviews-grid">
                            ${sortedReviews.map(review => `
                                <div class="rw-card rw-review-card">
                                    <div class="rw-review-card-content">
                                        <div class="rw-review-author">
                                            <div class="rw-avatar">${review.name.charAt(0)}</div>
                                            <div class="rw-author-info">
                                                <p>${review.name}</p>
                                                <p>${review.source} review</p>
                                            </div>
                                        </div>
                                        ${this.renderStarRating(review.stars)}
                                        <p class="rw-review-text">${review.text}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="rw-no-reviews">
                             <p>No reviews yet. Your widget is ready to collect feedback.</p>
                        </div>
                    `}
                </div>
            `;
            
            content += '</div>';
            this.widgetElement.innerHTML = content;

            document.getElementById('rw-write-review-btn').addEventListener('click', () => this.showReviewModal(widget));
        });
    }

    showReviewModal(widget) {
        const modal = document.createElement('div');
        modal.className = 'rw-modal-overlay';
        modal.innerHTML = `
            <div class="rw-modal-content">
                <div class="rw-modal-header">
                    <h2>Write a review</h2>
                    <p>Share your experience with ${widget.businessName}.</p>
                </div>
                <form id="rw-review-form" class="rw-modal-form">
                    <div>
                        <label for="rw-name">Your Name</label>
                        <input type="text" id="rw-name" name="name" required />
                    </div>
                    <div>
                        <label>Rating</label>
                        <div class="rw-modal-stars" id="rw-modal-stars">
                            ${[1,2,3,4,5].map(i => `<svg data-value="${i}" class="rw-star empty" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"></path></svg>`).join('')}
                        </div>
                        <input type="hidden" id="rw-stars-input" name="stars" value="0" />
                    </div>
                    <div>
                        <label for="rw-text">Review</label>
                        <textarea id="rw-text" name="text" rows="4" required></textarea>
                    </div>
                    <div class="rw-modal-footer">
                        <button type="button" class="rw-button rw-button-secondary" id="rw-cancel-review-btn">Cancel</button>
                        <button type="submit" class="rw-button">Submit Review</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        let currentRating = 0;
        const starsContainer = modal.querySelector('#rw-modal-stars');
        const starIcons = starsContainer.querySelectorAll('.rw-star');
        const ratingInput = modal.querySelector('#rw-stars-input');

        const updateStars = (rating) => {
            starIcons.forEach(star => {
                const starValue = parseInt(star.dataset.value, 10);
                if (starValue <= rating) {
                    star.classList.add('filled');
                    star.classList.remove('empty');
                } else {
                    star.classList.remove('filled');
                    star.classList.add('empty');
                }
            });
        };

        starsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.rw-star')) {
                const star = e.target.closest('.rw-star');
                currentRating = parseInt(star.dataset.value, 10);
                ratingInput.value = currentRating;
                updateStars(currentRating);
            }
        });
        
        starsContainer.addEventListener('mouseover', (e) => {
             if (e.target.closest('.rw-star')) {
                const star = e.target.closest('.rw-star');
                updateStars(parseInt(star.dataset.value, 10));
            }
        });

        starsContainer.addEventListener('mouseout', () => {
            updateStars(currentRating);
        });


        modal.querySelector('#rw-cancel-review-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.rw-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });

        modal.querySelector('#rw-review-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                stars: parseInt(formData.get('stars'), 10),
                text: formData.get('text'),
                source: 'Direct'
            };

            if (data.stars === 0) {
                alert('Please select a star rating.');
                return;
            }

            try {
                const response = await fetch(`${this.apiBaseUrl}/api/widgets/${this.widgetId}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to submit review');
                }
                modal.remove();
                this.render(); // Re-render the widget to show the new review
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }
}

// Initialize widgets
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initializeWidgets);
} else {
    initializeWidgets();
}

function initializeWidgets() {
    const widgetConfigs = document.querySelectorAll('review-widget');
    if (widgetConfigs.length === 0) {
        console.warn("No 'review-widget' elements found on this page.");
        return;
    }
    widgetConfigs.forEach(configElement => {
        const widgetId = configElement.getAttribute('widgetId');
        // The API base URL is now hardcoded for simplicity and reliability.
        const apiBaseUrl = 'https://widget-wizard-chris.netlify.app'; 
        if (widgetId && apiBaseUrl) {
            new ReviewWidget(widgetId, apiBaseUrl);
        } else {
            console.error('Widget configuration is missing widgetId.', configElement);
        }
    });
}
