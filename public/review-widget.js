
(function() {
    'use strict';

    // This is the main entry point for the widget.
    // It finds the <review-widget> element on the page and initializes the widget.
    document.addEventListener('DOMContentLoaded', () => {
        const widgetEl = document.querySelector('review-widget');
        if (widgetEl) {
            const widgetId = widgetEl.getAttribute('widgetId');
            const apiBase = widgetEl.getAttribute('data-api-base');
            if (widgetId && apiBase) {
                initWidget(widgetEl, widgetId, apiBase);
            } else {
                console.error('Widget ID or API base URL is missing.');
                widgetEl.innerHTML = `<p style="color: red; font-family: sans-serif;">Error: Widget configuration is missing.</p>`;
            }
        }
    });

    // Fetches widget data from the API and renders the widget.
    async function initWidget(element, widgetId, apiBase) {
        try {
            const response = await fetch(`${apiBase}/api/widgets/${widgetId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const { success, data } = await response.json();
            if (success) {
                renderWidget(element, data, apiBase);
            } else {
                throw new Error('Failed to fetch widget data.');
            }
        } catch (error) {
            console.error('Failed to initialize widget:', error);
            element.innerHTML = `<p style="color: red; font-family: sans-serif;">Error: Could not load widget.</p>`;
        }
    }

    // Renders the entire widget's HTML content into the target element.
    function renderWidget(element, widget, apiBase) {
        const { overallRating, totalReviews } = calculateStats(widget.reviews);
        const sortedReviews = widget.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        element.innerHTML = `
            <style>${getWidgetStyles()}</style>
            <div class="rw-container">
                <header class="rw-header">
                    <h1>${widget.businessName}</h1>
                    <a href="${widget.website}" target="_blank" rel="noopener noreferrer">${widget.website}</a>
                </header>

                <div class="rw-summary">
                     <p class="rw-overall-rating">
                        ${overallRating.toFixed(1)} <span>out of 5</span>
                    </p>
                    <div class="rw-star-rating">${renderStars(overallRating)}</div>
                    <p class="rw-total-reviews">${totalReviews} reviews</p>
                </div>

                <div class="rw-actions">
                    <button id="rw-write-review-btn" class="rw-button">Write a Review</button>
                </div>
                
                <div class="rw-reviews-list">
                    ${sortedReviews.length > 0 ? sortedReviews.map(review => renderReviewCard(review)).join('') : '<p class="rw-no-reviews">No reviews yet. Be the first!</p>'}
                </div>

                <footer class="rw-footer">
                    <p>Powered by Widget Wizard</p>
                </footer>
            </div>
            ${renderModal(widget, apiBase)}
        `;

        setupEventListeners(element, widget, apiBase);
    }
    
    // --- Helper functions for rendering parts of the widget ---
    
    function calculateStats(reviews) {
        if (!reviews || reviews.length === 0) {
            return { overallRating: 0, totalReviews: 0 };
        }
        const total = reviews.reduce((acc, review) => acc + review.stars, 0);
        return {
            overallRating: total / reviews.length,
            totalReviews: reviews.length,
        };
    }

    function renderStars(rating, size = 20) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= Math.round(rating);
            starsHtml += `
                <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${isFilled ? '#ffc107' : 'none'}" stroke="${isFilled ? '#ffc107' : '#cccccc'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `;
        }
        return `<div class="rw-star-rating">${starsHtml}</div>`;
    }

    function renderReviewCard(review) {
        return `
            <div class="rw-review-card">
                <div class="rw-card-header">
                    <p class="rw-reviewer-name">${review.name}</p>
                    ${renderStars(review.stars, 16)}
                </div>
                <p class="rw-review-text">${review.text}</p>
                 <p class="rw-review-source">Source: ${review.source}</p>
            </div>
        `;
    }

    function renderModal(widget, apiBase) {
         return `
            <div id="rw-modal" class="rw-modal-overlay" style="display: none;">
                <div class="rw-modal-content">
                    <button id="rw-close-modal-btn" class="rw-modal-close">&times;</button>
                    <h2>Write a review for ${widget.businessName}</h2>
                    <form id="rw-review-form">
                        <div class="rw-form-group">
                            <label for="rw-name">Your Name</label>
                            <input type="text" id="rw-name" name="name" required>
                        </div>
                        <div class="rw-form-group">
                            <label>Rating</label>
                            <div id="rw-form-stars" class="rw-form-stars">
                                ${[1,2,3,4,5].map(i => `<span class="rw-star" data-value="${i}">&#9733;</span>`).join('')}
                            </div>
                            <input type="hidden" id="rw-stars-input" name="stars" required>
                        </div>
                        <div class="rw-form-group">
                            <label for="rw-text">Review</label>
                            <textarea id="rw-text" name="text" rows="4" required></textarea>
                        </div>
                        <div id="rw-form-error" class="rw-form-error" style="display: none;"></div>
                        <button type="submit" class="rw-button">Submit Review</button>
                    </form>
                </div>
            </div>
        `;
    }

    // --- Event Listeners ---
    
    function setupEventListeners(element, widget, apiBase) {
        const modal = element.querySelector('#rw-modal');
        const openBtn = element.querySelector('#rw-write-review-btn');
        const closeBtn = element.querySelector('#rw-close-modal-btn');
        const form = element.querySelector('#rw-review-form');
        
        openBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
        closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Star rating in form
        const stars = element.querySelectorAll('.rw-form-stars .rw-star');
        const starInput = element.querySelector('#rw-stars-input');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                starInput.value = value;
                stars.forEach(s => {
                    s.classList.toggle('selected', s.getAttribute('data-value') <= value);
                });
            });
        });
        
        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const errorDiv = element.querySelector('#rw-form-error');
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                stars: parseInt(formData.get('stars'), 10),
                text: formData.get('text'),
                source: 'Direct'
            };

            if (!data.stars || data.stars < 1) {
                errorDiv.textContent = 'Please select a star rating.';
                errorDiv.style.display = 'block';
                return;
            }
            
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            try {
                const response = await fetch(`${apiBase}/api/widgets/${widget._id}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                if (!response.ok) {
                    let errorMessage = 'An unknown error occurred.';
                    if (result.error) {
                       errorMessage = result.error;
                    }
                    if (result.details) {
                        errorMessage = Object.values(result.details).flat().join(' ');
                    }
                    throw new Error(errorMessage);
                }
                
                modal.style.display = 'none';
                form.reset();
                stars.forEach(s => s.classList.remove('selected'));
                initWidget(element, widget._id, apiBase); // Re-render widget to show new review

            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Review';
            }
        });
    }

    // --- Styles for the widget ---
    
    function getWidgetStyles() {
        return `
            :root {
                --rw-primary: #6D28D9;
                --rw-background: #ffffff;
                --rw-card-bg: #f9fafb;
                --rw-text: #1f2937;
                --rw-text-muted: #6b7280;
                --rw-border: #e5e7eb;
                --rw-star-color: #ffc107;
                --rw-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            .rw-container {
                font-family: var(--rw-font-family);
                background-color: var(--rw-background);
                color: var(--rw-text);
                border: 1px solid var(--rw-border);
                border-radius: 8px;
                padding: 24px;
                max-width: 700px;
                margin: auto;
            }
            .rw-header { text-align: center; margin-bottom: 24px; }
            .rw-header h1 { font-size: 2em; margin: 0 0 4px 0; }
            .rw-header a { color: var(--rw-primary); text-decoration: none; }
            .rw-header a:hover { text-decoration: underline; }
            
            .rw-summary { text-align: center; margin-bottom: 24px; }
            .rw-overall-rating { font-size: 2.5em; font-weight: bold; margin: 0; }
            .rw-overall-rating span { font-size: 0.5em; color: var(--rw-text-muted); }
            .rw-star-rating { display: flex; justify-content: center; align-items: center; gap: 2px; margin: 8px 0; }
            .rw-total-reviews { color: var(--rw-text-muted); margin: 0; }

            .rw-actions { text-align: center; margin-bottom: 24px; }
            .rw-button {
                background-color: var(--rw-primary);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 1em;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .rw-button:hover { background-color: #5b21b6; }
            .rw-button:disabled { background-color: #cccccc; cursor: not-allowed; }

            .rw-reviews-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
            .rw-review-card {
                background-color: var(--rw-card-bg);
                border: 1px solid var(--rw-border);
                border-radius: 8px;
                padding: 16px;
            }
            .rw-no-reviews { text-align: center; color: var(--rw-text-muted); grid-column: 1 / -1; }
            .rw-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .rw-reviewer-name { font-weight: 600; margin: 0; }
            .rw-review-text { margin: 0; line-height: 1.6; }
            .rw-review-source { font-size: 0.8em; color: var(--rw-text-muted); margin-top: 12px; }

            .rw-footer { text-align: center; margin-top: 24px; font-size: 0.8em; color: #9ca3af; }

            /* Modal Styles */
            .rw-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
            .rw-modal-content { background-color: white; padding: 24px; border-radius: 8px; max-width: 500px; width: 90%; position: relative; }
            .rw-modal-close { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5em; cursor: pointer; }
            .rw-form-group { margin-bottom: 16px; }
            .rw-form-group label { display: block; margin-bottom: 4px; font-weight: 500; }
            .rw-form-group input, .rw-form-group textarea { width: 100%; padding: 10px; border: 1px solid var(--rw-border); border-radius: 4px; box-sizing: border-box; }
            .rw-form-stars { display: flex; gap: 4px; cursor: pointer; }
            .rw-form-stars .rw-star { font-size: 2em; color: #cccccc; }
            .rw-form-stars .rw-star.selected { color: var(--rw-star-color); }
            .rw-form-error { color: #dc2626; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 10px; margin-bottom: 16px; font-size: 0.9em; }
        `;
    }
})();
