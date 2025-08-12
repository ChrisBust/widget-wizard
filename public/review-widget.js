
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
            console.error('Widget ID is missing. Please add the widgetId attribute to your <review-widget> tag.');
            widgetContainer.innerHTML = `<div style="padding: 20px; border: 1px solid #f00; color: #f00; background-color: #fdd;">Error: Widget configuration is missing. (ID: ${widgetId})</div>`;
            return;
        }
        
        const shadowRoot = widgetContainer.attachShadow({ mode: 'open' });

        async function fetchWidgetData() {
            try {
                const response = await fetch(`${apiBaseUrl}/api/widgets/${widgetId}`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.error || 'Failed to fetch widget data.');
                }
                renderWidget(result.data);
            } catch (error) {
                console.error('Error fetching widget data:', error);
                shadowRoot.innerHTML = `<div style="padding: 20px; border: 1px solid #f00; color: #f00; background-color: #fdd;">Error: Could not load widget. ${error.message}</div>`;
            }
        }

        function renderWidget(widget) {
            const overallRating = widget.reviews.length > 0 ? (widget.reviews.reduce((acc, review) => acc + review.stars, 0) / widget.reviews.length) : 0;
            const totalReviews = widget.reviews.length;
            
            const ratingDistribution = Array(5).fill(0);
            if (totalReviews > 0) {
              widget.reviews.forEach(review => {
                  ratingDistribution[5 - review.stars]++;
              });
            }

            const sortedReviews = widget.reviews ? [...widget.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

            const styles = `
                :host {
                    --background: 0 0% 100%;
                    --foreground: 222.2 84% 4.9%;
                    --card: 0 0% 100%;
                    --card-foreground: 222.2 84% 4.9%;
                    --primary: 263 60% 58%;
                    --primary-foreground: 0 0% 98%;
                    --muted: 240 4.8% 95.9%;
                    --muted-foreground: 240 3.8% 46.1%;
                    --accent: 43 96% 56%;
                    --border: 240 5.9% 90%;
                    --radius: 0.8rem;
                }
                .widget-container {
                    font-family: 'Inter', sans-serif;
                    background-color: hsl(var(--background));
                    color: hsl(var(--foreground));
                    padding: 1rem;
                    max-w-7xl;
                    margin: auto;
                }
                .widget-header {
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                @media (min-width: 640px) {
                    .widget-header {
                        text-align: left;
                    }
                }
                .widget-header h1 {
                    font-size: 1.875rem;
                    font-weight: bold;
                    margin: 0;
                }
                .widget-header a {
                    color: hsl(var(--primary));
                    text-decoration: none;
                }
                .widget-header a:hover {
                    text-decoration: underline;
                }
                .grid {
                    display: grid;
                    gap: 1.5rem;
                }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                @media (min-width: 768px) {
                    .md-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                .card {
                    border: 1px solid hsl(var(--border));
                    border-radius: var(--radius);
                    background-color: hsl(var(--card));
                    color: hsl(var(--card-foreground));
                    padding: 1.5rem;
                }
                .summary-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .summary-card .rating-value {
                    font-size: 3rem;
                    font-weight: bold;
                }
                .star-rating {
                    display: flex;
                    align-items: center;
                    gap: 0.125rem;
                }
                .star-rating svg {
                    width: 1.25rem;
                    height: 1.25rem;
                    color: hsl(var(--muted-foreground));
                    fill: transparent;
                }
                .star-rating svg.filled {
                    color: hsl(var(--accent));
                    fill: hsl(var(--accent));
                }
                .rating-distribution-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .rating-distribution-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }
                .progress-bar {
                    flex-grow: 1;
                    height: 0.5rem;
                    background-color: hsl(var(--muted));
                    border-radius: 9999px;
                    overflow: hidden;
                }
                .progress-bar-inner {
                    height: 100%;
                    background-color: hsl(var(--primary));
                }
                .reviews-header {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    gap: 1rem;
                }
                @media (min-width: 640px) {
                  .reviews-header {
                    flex-direction: row;
                  }
                }
                .reviews-header h2 {
                  font-size: 1.25rem;
                  font-weight: bold;
                }
                .write-review-btn {
                    background-color: hsl(var(--primary));
                    color: hsl(var(--primary-foreground));
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: calc(var(--radius) - 4px);
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .write-review-btn:hover { opacity: 0.9; }

                .reviews-grid {
                    display: grid;
                    gap: 1.5rem;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                }
                @media (min-width: 640px) {
                  .reviews-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                  }
                }
                 @media (min-width: 1024px) {
                  .reviews-grid {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                  }
                }
                .review-card {
                  border: 1px solid hsl(var(--border));
                  border-radius: var(--radius);
                  background-color: hsl(var(--card));
                  color: hsl(var(--card-foreground));
                  padding: 1.5rem;
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                  height: 100%;
                }
                .review-card-header {
                  display: flex;
                  align-items: center;
                  gap: 0.75rem;
                }
                .avatar {
                  width: 40px;
                  height: 40px;
                  border-radius: 9999px;
                  background-color: hsl(var(--muted));
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                }
                .review-card-author-info {
                  flex: 1;
                }
                .review-card-author-info p { margin: 0; }
                .review-card-author-info .author-name { font-weight: 600; }
                .review-card-author-info .review-source { font-size: 0.75rem; color: hsl(var(--muted-foreground)); }
                .review-card .review-text {
                  font-size: 0.875rem;
                  color: hsl(var(--foreground));
                  opacity: 0.8;
                  line-height: 1.5;
                  word-wrap: break-word;
                }
                .no-reviews-placeholder {
                  text-align: center;
                  padding: 3rem 1rem;
                  border: 2px dashed hsl(var(--border));
                  border-radius: var(--radius);
                  color: hsl(var(--muted-foreground));
                }
                .no-reviews-placeholder svg {
                  margin: 0 auto 0.5rem;
                  width: 3rem;
                  height: 3rem;
                }
                .widget-footer {
                    text-align: center;
                    margin-top: 3rem;
                    font-size: 0.875rem;
                    color: hsl(var(--muted-foreground));
                }

                /* Dialog Styles */
                .dialog-overlay {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0,0,0,0.8);
                    z-index: 50;
                }
                .dialog-content {
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 50;
                    width: 90%;
                    max-width: 425px;
                    background-color: hsl(var(--card));
                    padding: 1.5rem;
                    border-radius: var(--radius);
                    border: 1px solid hsl(var(--border));
                }
                .dialog-header { text-align: left; }
                .dialog-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; }
                .dialog-description { color: hsl(var(--muted-foreground)); margin: 0 0 1rem; }
                .dialog-form { display: flex; flex-direction: column; gap: 1rem; }
                .dialog-form label { font-size: 0.875rem; font-weight: 500; }
                .dialog-form input, .dialog-form textarea {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid hsl(var(--border));
                    border-radius: calc(var(--radius) - 4px);
                    background-color: hsl(var(--background));
                    color: hsl(var(--foreground));
                }
                 .dialog-form textarea { min-height: 80px; }
                .dialog-footer {
                  margin-top: 1.5rem;
                  display: flex;
                  justify-content: flex-end;
                  gap: 0.5rem;
                }
                .dialog-footer .cancel-btn {
                  background-color: hsl(var(--muted));
                  color: hsl(var(--muted-foreground));
                  border: 1px solid hsl(var(--border));
                }
            `;
            const html = `
                <div class="widget-container">
                    <header class="widget-header">
                        <h1>${widget.businessName}</h1>
                        <a href="${widget.website}" target="_blank" rel="noopener noreferrer">${widget.website}</a>
                    </header>
                    
                    ${totalReviews > 0 ? `
                    <div class="grid md-grid-cols-3" style="margin-bottom: 2rem;">
                        <div class="card summary-card">
                            <p class="rating-value">${overallRating.toFixed(1)}</p>
                            <div class="star-rating">
                                ${Array.from({ length: 5 }, (_, i) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${i < Math.round(overallRating) ? 'filled' : ''}"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`).join('')}
                            </div>
                            <p style="color: hsl(var(--muted-foreground)); margin-top: 0.5rem;">Based on ${totalReviews} reviews</p>
                        </div>
                        <div class="card" style="grid-column: span 2 / span 2;">
                            <h2 style="font-weight: 600; margin-bottom: 0.75rem;">Rating distribution</h2>
                            <div class="rating-distribution-list">
                                ${ratingDistribution.map((count, i) => `
                                <div class="rating-distribution-item">
                                    <span style="color: hsl(var(--muted-foreground)); width: 1.5rem; text-align: right;">${5 - i}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1rem; height: 1rem; color: hsl(var(--accent));"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/></svg>
                                    <div class="progress-bar"><div class="progress-bar-inner" style="width: ${(count / totalReviews) * 100}%;"></div></div>
                                    <span style="color: hsl(var(--muted-foreground)); width: 2rem; text-align: right;">${count}</span>
                                </div>`).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <div>
                        <div class="reviews-header">
                            <h2>${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                            <button class="write-review-btn">Write a Review</button>
                        </div>

                        ${totalReviews > 0 ? `
                        <div class="reviews-grid">
                            ${sortedReviews.map(review => `
                            <div class="review-card">
                                <div class="review-card-header">
                                    <div class="avatar">${review.name.charAt(0)}</div>
                                    <div class="review-card-author-info">
                                        <p class="author-name">${review.name}</p>
                                        <p class="review-source">${review.source} review</p>
                                    </div>
                                </div>
                                <div class="star-rating">
                                    ${Array.from({ length: 5 }, (_, i) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${i < review.stars ? 'filled' : ''}"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`).join('')}
                                </div>
                                <p class="review-text">${review.text}</p>
                            </div>
                            `).join('')}
                        </div>
                        ` : `
                        <div class="no-reviews-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            <h3 style="margin-top: 0.5rem; font-size: 1.125rem; font-weight: 600;">No reviews yet</h3>
                            <p>Your widget is ready to collect feedback.</p>
                        </div>
                        `}
                    </div>

                    <footer class="widget-footer">
                        <p>Powered by Widget Wizard</p>
                    </footer>
                </div>
            `;
            
            shadowRoot.innerHTML = `<style>${styles}</style>${html}`;
            attachEventListeners(widget);
        }
        
        function attachEventListeners(widget) {
            shadowRoot.querySelector('.write-review-btn').addEventListener('click', () => {
                showAddReviewDialog(widget);
            });
        }

        function showAddReviewDialog(widget) {
            const dialogOverlay = document.createElement('div');
            dialogOverlay.className = 'dialog-overlay';
            
            const dialogContent = document.createElement('div');
            dialogContent.className = 'dialog-content';
            
            let rating = 0;

            dialogContent.innerHTML = `
                <div class="dialog-header">
                    <h3 class="dialog-title">Write a review</h3>
                    <p class="dialog-description">Share your experience with ${widget.businessName}.</p>
                </div>
                <form class="dialog-form">
                    <div>
                        <label for="name">Your Name</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div>
                        <label>Rating</label>
                        <div class="star-rating" id="form-star-rating">
                            ${Array.from({ length: 5 }, (_, i) => `<svg data-star-value="${i+1}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`).join('')}
                        </div>
                    </div>
                    <div>
                        <label for="text">Review</label>
                        <textarea id="text" name="text" required></textarea>
                    </div>
                    <div class="dialog-footer">
                        <button type="button" class="write-review-btn cancel-btn">Cancel</button>
                        <button type="submit" class="write-review-btn">Submit Review</button>
                    </div>
                </form>
            `;

            shadowRoot.appendChild(dialogOverlay);
            shadowRoot.appendChild(dialogContent);

            const starContainer = dialogContent.querySelector('#form-star-rating');
            const stars = starContainer.querySelectorAll('svg');

            function updateStars(newRating) {
                rating = newRating;
                stars.forEach((star, index) => {
                    if (index < newRating) {
                        star.classList.add('filled');
                    } else {
                        star.classList.remove('filled');
                    }
                });
            }

            starContainer.addEventListener('click', (e) => {
                const starValue = e.target.closest('svg')?.dataset.starValue;
                if (starValue) {
                    updateStars(parseInt(starValue, 10));
                }
            });

            dialogOverlay.addEventListener('click', () => {
                shadowRoot.removeChild(dialogOverlay);
                shadowRoot.removeChild(dialogContent);
            });
            dialogContent.querySelector('.cancel-btn').addEventListener('click', () => {
                shadowRoot.removeChild(dialogOverlay);
                shadowRoot.removeChild(dialogContent);
            });

            dialogContent.querySelector('form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    stars: rating,
                    text: formData.get('text'),
                };

                if (data.stars === 0) {
                    alert('Please select a star rating.');
                    return;
                }

                try {
                    const response = await fetch(`${apiBaseUrl}/api/widgets/${widget.id || widget._id}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.error || 'Failed to submit review');
                    }
                    shadowRoot.removeChild(dialogOverlay);
                    shadowRoot.removeChild(dialogContent);
                    fetchWidgetData(); // Refresh widget data
                } catch(error) {
                    console.error('Error submitting review:', error);
                    alert(`Error: ${error.message}`);
                }
            });
        }
        
        fetchWidgetData();
    });
})();
