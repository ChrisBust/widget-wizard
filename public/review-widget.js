
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const widgetContainer = document.querySelector('review-widget');
        if (!widgetContainer) {
            console.error('Widget container <review-widget> not found.');
            return;
        }

        const widgetId = widgetContainer.getAttribute('widgetId');
        const apiBaseUrl = 'https://widget-wizard-chris.netlify.app';

        if (!widgetId) {
            widgetContainer.innerHTML = '<p style="color:red;font-family:sans-serif;">Error: widgetId attribute is missing.</p>';
            return;
        }

        async function fetchWidgetData() {
            try {
                const response = await fetch(`${apiBaseUrl}/api/widgets/${widgetId}`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success) {
                    renderWidget(result.data);
                } else {
                    throw new Error(result.error || 'Failed to fetch widget data.');
                }
            } catch (error) {
                console.error('Error fetching widget data:', error);
                widgetContainer.innerHTML = `<p style="color:red;font-family:sans-serif;">Error: Could not load widget. ${error.message}</p>`;
            }
        }

        function renderWidget(widget) {
            const overallRating = (() => {
                if (!widget.reviews || widget.reviews.length === 0) return 0;
                const total = widget.reviews.reduce((acc, review) => acc + review.stars, 0);
                return total / widget.reviews.length;
            })();
            const totalReviews = widget.reviews ? widget.reviews.length : 0;
            const ratingDistribution = Array(5).fill(0);
            if (totalReviews > 0) {
                for (const review of widget.reviews) {
                    ratingDistribution[5 - review.stars]++;
                }
            }
             const sortedReviews = widget.reviews ? [...widget.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];


            const styles = `
                :root {
                    --rw-primary: #6a44ff;
                    --rw-accent: #ffb400;
                    --rw-background: #ffffff;
                    --rw-foreground: #111827;
                    --rw-card: #f9fafb;
                    --rw-muted-foreground: #6b7280;
                    --rw-border: #e5e7eb;
                    --rw-font-body: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                }
                .dark {
                    --rw-primary: #818cf8;
                    --rw-accent: #facc15;
                    --rw-background: #111827;
                    --rw-foreground: #f9fafb;
                    --rw-card: #1f2937;
                    --rw-muted-foreground: #9ca3af;
                    --rw-border: #374151;
                }
                .rw-container { font-family: var(--rw-font-body); background-color: var(--rw-background); color: var(--rw-foreground); padding: 1.5rem; max-w: 7xl; margin: auto; }
                .rw-header { margin-bottom: 1.5rem; text-align: center; }
                @media (min-width: 640px) { .rw-header { text-align: left; } }
                .rw-header h1 { font-size: 1.875rem; font-weight: bold; }
                .rw-header a { color: var(--rw-primary); text-decoration: none; word-break: break-word; }
                .rw-header a:hover { text-decoration: underline; }
                .rw-summary-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem; }
                @media (min-width: 768px) { .rw-summary-grid { grid-template-columns: repeat(3, 1fr); } }
                .rw-card { background-color: var(--rw-card); border: 1px solid var(--rw-border); border-radius: 0.75rem; padding: 1.5rem; }
                .rw-overall-rating { display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .rw-overall-rating p:first-child { font-size: 3rem; font-weight: bold; }
                .rw-overall-rating p:last-child { color: var(--rw-muted-foreground); margin-top: 0.5rem; }
                .rw-dist-grid { grid-column: span 1 / span 1; }
                @media (min-width: 768px) { .rw-dist-grid { grid-column: span 2 / span 2; } }
                .rw-dist-grid h2 { font-weight: 600; margin-bottom: 0.75rem; }
                .rw-dist-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
                .rw-dist-row .rw-star-icon { color: var(--rw-accent); }
                .rw-progress-bar { width: 100%; height: 0.5rem; background-color: #e5e7eb; border-radius: 9999px; overflow: hidden; }
                .rw-progress { height: 100%; background-color: var(--rw-primary); }
                .rw-reviews-header { display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 1rem; }
                @media (min-width: 640px) { .rw-reviews-header { flex-direction: row; } }
                .rw-reviews-header h2 { font-size: 1.25rem; font-weight: bold; }
                .rw-button { background-color: var(--rw-primary); color: white; border: none; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
                .rw-button:hover { background-color: #5a3eeb; }
                .rw-reviews-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
                @media (min-width: 640px) { .rw-reviews-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1024px) { .rw-reviews-grid { grid-template-columns: repeat(3, 1fr); } }
                .rw-review-card { display: flex; flex-direction: column; height: 100%; }
                .rw-review-card .rw-card { flex: 1; display: flex; flex-direction: column; }
                .rw-review-card-content { flex: 1; space-y: 1rem; }
                .rw-review-card-header { display: flex; align-items: center; gap: 0.75rem; }
                .rw-avatar { width: 2.5rem; height: 2.5rem; border-radius: 9999px; background-color: var(--rw-muted-foreground); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; }
                .rw-avatar img { width: 100%; height: 100%; border-radius: 9999px; object-fit: cover; }
                .rw-reviewer-name { font-weight: 600; }
                .rw-reviewer-source { font-size: 0.75rem; color: var(--rw-muted-foreground); }
                .rw-review-text { font-size: 0.875rem; color: var(--rw-foreground); opacity: 0.8; padding-top: 0.5rem; word-break: break-word; }
                .rw-star-rating { display: flex; align-items: center; gap: 0.125rem; }
                .rw-star-icon { width: 1.25rem; height: 1.25rem; }
                .rw-star-filled { color: var(--rw-accent); fill: var(--rw-accent); }
                .rw-star-empty { color: var(--rw-muted-foreground); opacity: 0.3; }
                .rw-empty-state { text-align: center; padding: 5rem 0; border: 2px dashed var(--rw-border); border-radius: 0.75rem; background-color: var(--rw-card); color: var(--rw-muted-foreground); }
                .rw-empty-state-icon { margin: auto; width: 3rem; height: 3rem; }
                .rw-empty-state h3 { margin-top: 0.5rem; font-size: 1.125rem; font-weight: 600; }
                .rw-modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.75); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; }
                .rw-modal-content { background-color: var(--rw-background); color: var(--rw-foreground); border-radius: 0.75rem; padding: 1.5rem; position: relative; width: 100%; max-width: 425px; max-height: 90vh; overflow-y: auto; }
                .rw-modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; cursor: pointer; color: var(--rw-muted-foreground); }
                .rw-modal-close:hover { color: var(--rw-foreground); }
                .rw-modal-header h2 { font-size: 1.5rem; font-weight: bold; }
                .rw-modal-header p { color: var(--rw-muted-foreground); margin-top: 0.25rem; }
                .rw-form { margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem; }
                .rw-form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .rw-form-group label { font-weight: 500; font-size: 0.875rem; }
                .rw-form-group input, .rw-form-group textarea { width: 100%; box-sizing: border-box; border: 1px solid var(--rw-border); background-color: var(--rw-background); border-radius: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
                .rw-form-group input:focus, .rw-form-group textarea:focus { outline: 2px solid var(--rw-primary); outline-offset: 2px; }
                .rw-form-group textarea { min-height: 80px; resize: vertical; }
                .rw-star-rating-input { display: flex; gap: 0.25rem; }
                .rw-star-rating-input .rw-star-icon { cursor: pointer; transition: color 0.2s; }
            `;

            function createStarRating(rating, iconClassName = 'rw-star-icon') {
                let stars = '';
                for (let i = 0; i < 5; i++) {
                    const isFilled = i < Math.round(rating);
                    stars += `<svg class="${iconClassName} ${isFilled ? 'rw-star-filled' : 'rw-star-empty'}" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
                }
                return `<div class="rw-star-rating">${stars}</div>`;
            }
            
            let reviewCards = '';
            if (totalReviews > 0) {
                 reviewCards = sortedReviews.map(review => `
                    <div class="rw-review-card">
                        <div class="rw-card">
                            <div class="rw-review-card-content">
                                <div class="rw-review-card-header">
                                    <div class="rw-avatar"><span>${review.name.charAt(0)}</span></div>
                                    <div>
                                        <p class="rw-reviewer-name">${review.name}</p>
                                        <p class="rw-reviewer-source">${review.source} review</p>
                                    </div>
                                </div>
                                ${createStarRating(review.stars)}
                                <p class="rw-review-text">${review.text}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            const summarySection = totalReviews > 0 ? `
                <div class="rw-summary-grid">
                    <div class="rw-card rw-overall-rating">
                        <p>${overallRating.toFixed(1)}</p>
                        ${createStarRating(overallRating)}
                        <p>Based on ${totalReviews} reviews</p>
                    </div>
                    <div class="rw-card rw-dist-grid">
                        <h2 class="font-semibold mb-3">Rating distribution</h2>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${ratingDistribution.map((count, i) => `
                                <div class="rw-dist-row">
                                    <span style="width: 1.5rem; text-align: right;">${5 - i}</span>
                                    <svg class="rw-star-icon rw-star-filled" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <div class="rw-progress-bar"><div class="rw-progress" style="width: ${(count / totalReviews) * 100}%"></div></div>
                                    <span style="width: 2rem; text-align: right;">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : '';

            const reviewsSection = totalReviews > 0 ? `
                <div class="rw-reviews-grid">${reviewCards}</div>
            ` : `
                <div class="rw-empty-state">
                    <svg class="rw-empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z"></path></svg>
                    <h3>No reviews yet</h3>
                    <p>Your widget is ready to collect feedback.</p>
                </div>
            `;
            
            widgetContainer.innerHTML = `
                <style>${styles}</style>
                <div class="rw-container">
                    <header class="rw-header">
                        <h1>${widget.businessName}</h1>
                    </header>
                    ${summarySection}
                    <div>
                        <div class="rw-reviews-header">
                            <h2>${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                            <button id="rw-add-review-btn" class="rw-button">Write a Review</button>
                        </div>
                        ${reviewsSection}
                    </div>
                </div>
            `;

            document.getElementById('rw-add-review-btn').addEventListener('click', showAddReviewModal);
        }

        function showAddReviewModal() {
            const modal = document.createElement('div');
            modal.className = 'rw-modal-overlay';
            modal.id = 'rw-review-modal';
            modal.innerHTML = `
                <div class="rw-modal-content">
                    <button id="rw-modal-close-btn" class="rw-modal-close">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <div class="rw-modal-header">
                        <h2>Write a review</h2>
                        <p>Share your experience with your business.</p>
                    </div>
                    <form id="rw-review-form" class="rw-form">
                        <div class="rw-form-group">
                            <label for="rw-name">Your Name</label>
                            <input type="text" id="rw-name" name="name" required />
                        </div>
                        <div class="rw-form-group">
                            <label>Rating</label>
                            <div id="rw-star-rating-input" class="rw-star-rating-input">
                                ${Array(5).fill(0).map((_, i) => `
                                    <svg data-rating-value="${i + 1}" class="rw-star-icon rw-star-empty" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                `).join('')}
                            </div>
                            <input type="hidden" id="rw-stars" name="stars" value="0" />
                        </div>
                        <div class="rw-form-group">
                            <label for="rw-text">Review</label>
                            <textarea id="rw-text" name="text" required></textarea>
                        </div>
                        <div style="display:flex; justify-content:flex-end;">
                           <button type="submit" class="rw-button">Submit Review</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById('rw-modal-close-btn').addEventListener('click', () => modal.remove());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            let currentRating = 0;
            const starRatingInput = document.getElementById('rw-star-rating-input');
            const starsInput = document.getElementById('rw-stars');
            const starIcons = starRatingInput.querySelectorAll('.rw-star-icon');

            starIcons.forEach(star => {
                star.addEventListener('mouseenter', () => {
                    const rating = parseInt(star.getAttribute('data-rating-value'));
                    starIcons.forEach(s => {
                        const s_rating = parseInt(s.getAttribute('data-rating-value'));
                        s.classList.toggle('rw-star-filled', s_rating <= rating);
                        s.classList.toggle('rw-star-empty', s_rating > rating);
                    });
                });

                star.addEventListener('mouseleave', () => {
                    starIcons.forEach(s => {
                        const s_rating = parseInt(s.getAttribute('data-rating-value'));
                        s.classList.toggle('rw-star-filled', s_rating <= currentRating);
                        s.classList.toggle('rw-star-empty', s_rating > currentRating);
                    });
                });

                star.addEventListener('click', () => {
                    currentRating = parseInt(star.getAttribute('data-rating-value'));
                    starsInput.value = currentRating;
                });
            });

            document.getElementById('rw-review-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                const form = e.target;
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;

                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    stars: parseInt(formData.get('stars'), 10),
                    text: formData.get('text'),
                    source: 'Direct'
                };

                if(data.stars === 0) {
                   alert('Please select a star rating.');
                   submitButton.textContent = 'Submit Review';
                   submitButton.disabled = false;
                   return;
                }

                try {
                    const response = await fetch(`${apiBaseUrl}/api/widgets/${widgetId}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                    const result = await response.json();
                    if (result.success) {
                        modal.remove();
                        fetchWidgetData(); // Refresh widget data
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Failed to submit review:', error);
                    alert('An error occurred while submitting your review.');
                } finally {
                   submitButton.textContent = 'Submit Review';
                   submitButton.disabled = false;
                }
            });
        }
        fetchWidgetData();
    });
})();
