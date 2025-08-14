
class ReviewWidget {
    constructor(widgetId) {
        this.widgetId = widgetId;
        this.container = document.querySelector(`review-widget[widgetId="${widgetId}"]`);
        if (!this.container) {
            console.error('Widget container not found.');
            return;
        }
        this.container.innerHTML = '<div class="ww-loading">Loading Reviews...</div>';
        this.apiBaseUrl = this.getApiBaseUrl();
        this.fetchAndRender();
    }

    getApiBaseUrl() {
        const scriptTag = document.querySelector('script[src*="review-widget.js"]');
        if (scriptTag) {
            try {
                const url = new URL(scriptTag.src);
                return url.origin;
            } catch (e) {
                // Fallback for environments where script src might not be a full URL
            }
        }
        // Fallback for older browsers or if script tag isn't found
        return window.location.origin;
    }

    fetchAndRender() {
        fetch(`${this.apiBaseUrl}/api/widgets/${this.widgetId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    this.render(data.data);
                } else {
                    this.container.innerHTML = `<div class="ww-error">${data.error || 'Could not load widget data.'}</div>`;
                }
            })
            .catch(error => {
                console.error('Error fetching widget data:', error);
                this.container.innerHTML = '<div class="ww-error">Error loading widget.</div>';
            });
    }

    render(widget) {
        const { overallRating, totalReviews, ratingDistribution } = this.calculateStats(widget.reviews);
        const sortedReviews = widget.reviews ? [...widget.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const themeClass = isDark ? 'dark' : '';

        const styles = `
            .ww-container {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: ${isDark ? '#1a202c' : '#ffffff'};
                color: ${isDark ? '#e2e8f0' : '#2d3748'};
                padding: 1.5rem;
                max-width: 1200px;
                margin: auto;
                box-sizing: border-box;
            }
            .ww-container *, .ww-container *::before, .ww-container *::after {
                box-sizing: border-box;
            }
            .ww-header { margin-bottom: 1.5rem; text-align: center; }
            .ww-header h1 { font-size: 1.875rem; font-weight: bold; margin: 0 0 0.25rem 0; }
            .ww-summary-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
            @media (min-width: 768px) { .ww-summary-grid { grid-template-columns: repeat(3, 1fr); } }
            .ww-card { 
                border: 1px solid ${isDark ? '#4a5568' : '#e2e8f0'}; 
                border-radius: 0.5rem; 
                padding: 1.5rem; 
                background-color: ${isDark ? '#2d3748' : '#ffffff'};
            }
            .ww-rating-summary { display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .ww-rating-summary p:first-child { font-size: 3rem; font-weight: bold; }
            .ww-rating-summary p:last-child { color: ${isDark ? '#a0aec0' : '#718096'}; margin-top: 0.5rem; }
            .ww-rating-dist { grid-column: span 1; }
            @media (min-width: 768px) { .ww-rating-dist { grid-column: span 2; } }
            .ww-rating-dist h2 { font-weight: 600; margin-bottom: 0.75rem; }
            .ww-dist-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
            .ww-dist-row .ww-star-icon { color: #f59e0b; }
            .ww-dist-row span:first-child { width: 1.5rem; text-align: right; color: ${isDark ? '#a0aec0' : '#718096'};}
            .ww-reviews-header { display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 1rem; }
            @media (min-width: 640px) { .ww-reviews-header { flex-direction: row; } }
            .ww-reviews-header h2 { font-size: 1.25rem; font-weight: bold; }
            .ww-write-review-btn {
                background-color: #6B46C1; color: white; border: none; padding: 0.75rem 1.5rem;
                border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s;
            }
            .ww-write-review-btn:hover { background-color: #553c9a; }
            .ww-reviews-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
            @media (min-width: 640px) { .ww-reviews-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
            @media (min-width: 1024px) { .ww-reviews-grid { grid-template-columns: repeat(3, 1fr); } }
            .ww-review-card { height: 100%; display: flex; flex-direction: column; }
            .ww-review-card-content { flex-grow: 1; padding: 1.5rem; }
            .ww-review-author { display: flex; align-items: center; gap: 0.75rem; }
            .ww-review-author-avatar { width: 40px; height: 40px; border-radius: 9999px; background-color: #cbd5e0; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #4a5568; }
            .ww-review-author-info p:first-child { font-weight: 600; }
            .ww-review-author-info p:last-child { font-size: 0.75rem; color: ${isDark ? '#a0aec0' : '#718096'}; }
            .ww-review-card-content p { color: ${isDark ? '#cbd5e0' : '#4a5568'}; margin-top: 1rem; line-height: 1.5; }
            .ww-star-rating { display: flex; align-items: center; gap: 2px; }
            .ww-star-icon { width: 1.25rem; height: 1.25rem; }
            .ww-star-icon.filled { color: #f59e0b; }
            .ww-star-icon.empty { color: ${isDark ? '#4a5568' : '#cbd5e0'}; }
            .ww-no-reviews { text-align: center; padding: 5rem 0; border: 2px dashed ${isDark ? '#4a5568' : '#e2e8f0'}; border-radius: 0.5rem; }
            .ww-no-reviews h3 { font-size: 1.125rem; font-weight: 600; }
            
            .ww-modal {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .ww-modal.ww-show {
                opacity: 1;
                visibility: visible;
            }
            .ww-modal-content {
                background-color: ${isDark ? '#2d3748' : '#fff'};
                color: ${isDark ? '#e2e8f0' : '#2d3748'};
                padding: 2rem;
                border-radius: 0.5rem;
                width: 90%;
                max-width: 500px;
                box-sizing: border-box;
                transform: scale(0.95);
                transition: transform 0.3s ease;
            }
            .ww-modal.ww-show .ww-modal-content {
                 transform: scale(1);
            }
            .ww-modal-header { margin-bottom: 1.5rem; }
            .ww-modal-header h2 { font-size: 1.5rem; font-weight: bold; }
            .ww-modal-header p { color: ${isDark ? '#a0aec0' : '#718096'}; }
            .ww-form-group { margin-bottom: 1rem; }
            .ww-form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
            .ww-form-group input, .ww-form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border-radius: 0.375rem;
                border: 1px solid ${isDark ? '#4a5568' : '#cbd5e0'};
                background-color: ${isDark ? '#1a202c' : '#fff'};
                color: ${isDark ? '#e2e8f0' : '#2d3748'};
                box-sizing: border-box;
            }
            .ww-modal-stars { display: flex; gap: 0.25rem; }
            .ww-modal-stars .ww-star-icon { cursor: pointer; transition: color 0.2s; color: ${isDark ? '#4a5568' : '#cbd5e0'}; }
            .ww-modal-stars .ww-star-icon.hover, .ww-modal-stars .ww-star-icon.selected { color: #f59e0b; }
            .ww-modal-footer { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }
            .ww-modal-btn { padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; border: 1px solid transparent; font-weight: 600; }
            .ww-modal-btn.ww-cancel { background-color: transparent; border-color: ${isDark ? '#4a5568' : '#cbd5e0'}; color: ${isDark ? '#e2e8f0' : '#2d3748'}; }
            .ww-modal-btn.ww-submit { background-color: #6B46C1; color: white; }
        `;

        this.container.innerHTML = `
            <style>${styles}</style>
            <div class="ww-container ${themeClass}">
                <header class="ww-header">
                    <h1>${widget.businessName}</h1>
                </header>

                ${totalReviews > 0 ? `
                    <div class="ww-summary-grid">
                        <div class="ww-card ww-rating-summary">
                            <p>${overallRating.toFixed(1)}</p>
                            ${this.renderStars(overallRating)}
                            <p>Based on ${totalReviews} reviews</p>
                        </div>
                        <div class="ww-card ww-rating-dist">
                            <h2>Rating distribution</h2>
                            <div style="space-y: 0.5rem;">
                                ${ratingDistribution.map((count, i) => `
                                    <div class="ww-dist-row">
                                        <span>${5 - i}</span>
                                        <svg class="ww-star-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div>
                    <div class="ww-reviews-header">
                        <h2>${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                        <button class="ww-write-review-btn">Write a Review</button>
                    </div>
                    ${totalReviews > 0 ? `
                        <div class="ww-reviews-grid">
                            ${sortedReviews.map(review => `
                                <div class="ww-card ww-review-card">
                                    <div class="ww-review-card-content">
                                        <div class="ww-review-author">
                                            <div class="ww-review-author-avatar">${review.name.charAt(0)}</div>
                                            <div class="ww-review-author-info">
                                                <p>${review.name}</p>
                                                <p>${review.source} review</p>
                                            </div>
                                        </div>
                                        ${this.renderStars(review.stars)}
                                        <p>${review.text}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="ww-no-reviews">
                            <h3>No reviews yet</h3>
                            <p>Your widget is ready to collect feedback.</p>
                        </div>
                    `}
                </div>
            </div>
        `;

        this.attachEventListeners(widget._id.toString(), widget.businessName);
    }
    
    calculateStats(reviews) {
        if (!reviews || reviews.length === 0) {
            return { overallRating: 0, totalReviews: 0, ratingDistribution: [0, 0, 0, 0, 0] };
        }
        const total = reviews.reduce((acc, review) => acc + review.stars, 0);
        const overall = total / reviews.length;
        const distribution = Array(5).fill(0);
        reviews.forEach(r => distribution[5 - r.stars]++);
        return { overallRating: overall, totalReviews: reviews.length, ratingDistribution: distribution };
    }
    
    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= Math.round(rating);
            stars += `<svg class="ww-star-icon ${filled ? 'filled' : 'empty'}" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>`;
        }
        return `<div class="ww-star-rating" style="margin-top: 0.5rem;">${stars}</div>`;
    }

    renderModal(widgetId, businessName) {
        const existingModal = document.querySelector('.ww-modal');
        if (existingModal) existingModal.remove();

        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const modalHTML = `
            <div class="ww-modal" role="dialog" aria-modal="true">
                <div class="ww-modal-content">
                    <div class="ww-modal-header">
                        <h2>Write a review</h2>
                        <p>Share your experience with ${businessName}.</p>
                    </div>
                    <form class="ww-review-form">
                        <div class="ww-form-group">
                            <label for="ww-name">Your Name</label>
                            <input type="text" id="ww-name" name="name" required>
                        </div>
                        <div class="ww-form-group">
                            <label>Rating</label>
                            <div class="ww-modal-stars" data-rating="0">
                                ${[1,2,3,4,5].map(i => `<svg data-value="${i}" class="ww-star-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>`).join('')}
                            </div>
                        </div>
                        <div class="ww-form-group">
                            <label for="ww-text">Review</label>
                            <textarea id="ww-text" name="text" rows="4" required></textarea>
                        </div>
                        <div class="ww-modal-footer">
                            <button type="button" class="ww-modal-btn ww-cancel">Cancel</button>
                            <button type="submit" class="ww-modal-btn ww-submit">Submit Review</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Use a short delay to allow the element to be in the DOM for the transition to work
        setTimeout(() => {
            const modal = document.querySelector('.ww-modal');
            if (modal) {
                modal.classList.add('ww-show');
            }
        }, 10);
        
        this.attachModalEventListeners(widgetId);
    }
    
    closeModal() {
        const modal = document.querySelector('.ww-modal');
        if (modal) {
            modal.classList.remove('ww-show');
            // Remove the modal from the DOM after the transition ends
            modal.addEventListener('transitionend', () => {
                modal.remove();
            }, { once: true });
        }
    }

    attachEventListeners(widgetId, businessName) {
        const writeReviewBtn = this.container.querySelector('.ww-write-review-btn');
        if (writeReviewBtn) {
            writeReviewBtn.addEventListener('click', () => {
                this.renderModal(widgetId, businessName);
            });
        }
    }

    attachModalEventListeners(widgetId) {
        const modal = document.querySelector('.ww-modal');
        if (!modal) return;
        
        const form = modal.querySelector('.ww-review-form');
        const starsContainer = modal.querySelector('.ww-modal-stars');
        const stars = starsContainer.querySelectorAll('.ww-star-icon');
        const cancelButton = modal.querySelector('.ww-cancel');
        
        // Close modal listeners
        cancelButton.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Star rating interactivity
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = star.dataset.value;
                stars.forEach(s => {
                    s.classList.toggle('hover', s.dataset.value <= rating);
                });
            });
            star.addEventListener('mouseout', () => {
                stars.forEach(s => s.classList.remove('hover'));
            });
            star.addEventListener('click', () => {
                const rating = star.dataset.value;
                starsContainer.dataset.rating = rating;
                stars.forEach(s => {
                    s.classList.toggle('selected', s.dataset.value <= rating);
                });
            });
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.ww-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const rating = parseInt(starsContainer.dataset.rating, 10);
            if (rating === 0) {
                alert('Please select a star rating.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
                return;
            }

            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                stars: rating,
                text: formData.get('text'),
                source: 'Direct'
            };

            fetch(`${this.apiBaseUrl}/api/widgets/${this.widgetId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    this.closeModal();
                    this.fetchAndRender(); // Refresh widget on success
                } else {
                    alert('Error submitting review: ' + (result.error || 'Unknown error'));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Review';
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                alert('An error occurred. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
            });
        });
    }
}

function initWidgets() {
    const widgetElements = document.querySelectorAll('review-widget');
    widgetElements.forEach(el => {
        const widgetId = el.getAttribute('widgetId');
        if (widgetId) {
            new ReviewWidget(widgetId);
        } else {
            console.error('Review widget is missing widgetId attribute.');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
} else {
    initWidgets();
}
