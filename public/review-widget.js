
class ReviewWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.widgetId = this.getAttribute('widgetId');
        // The API base URL is now hardcoded for simplicity and reliability.
        this.apiBase = 'https://widget-wizard-chris.netlify.app'; 
    }

    connectedCallback() {
        this.fetchWidgetData();
    }

    async fetchWidgetData() {
        if (!this.widgetId) {
            this.shadowRoot.innerHTML = '<p>Error: widgetId is required.</p>';
            return;
        }
        try {
            const response = await fetch(`${this.apiBase}/api/widgets/${this.widgetId}`);
            if (!response.ok) throw new Error('Network response was not ok.');
            const { data: widget } = await response.json();
            this.render(widget);
        } catch (error) {
            console.error('Failed to fetch widget data:', error);
            this.shadowRoot.innerHTML = `<p>Error loading widget: ${error.message}</p>`;
        }
    }

    render(widget) {
        const sortedReviews = widget.reviews ? [...widget.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

        this.shadowRoot.innerHTML = `
            <style>
                /* Tailwind CSS Directives */
                :host {
                    --background: 0 0% 100%;
                    --foreground: 222.2 84% 4.9%;
                    --card: 0 0% 100%;
                    --card-foreground: 222.2 84% 4.9%;
                    --popover: 0 0% 100%;
                    --popover-foreground: 222.2 84% 4.9%;
                    --primary: 263 60% 58%;
                    --primary-foreground: 0 0% 98%;
                    --secondary: 293 43% 25%;
                    --secondary-foreground: 0 0% 98%;
                    --muted: 240 4.8% 95.9%;
                    --muted-foreground: 240 3.8% 46.1%;
                    --accent: 43 96% 56%;
                    --accent-foreground: 0 0% 98%;
                    --destructive: 0 84.2% 60.2%;
                    --destructive-foreground: 0 0% 98%;
                    --border: 240 5.9% 90%;
                    --input: 240 5.9% 90%;
                    --ring: 263 60% 58%;
                    --radius: 0.8rem;
                }
                .dark {
                    --background: 220 18% 12%;
                    --foreground: 210 40% 98%;
                    --card: 220 18% 18%;
                    --card-foreground: 210 40% 98%;
                    --popover: 220 18% 12%;
                    --popover-foreground: 210 40% 98%;
                    --primary: 190 85% 55%;
                    --primary-foreground: 220 18% 12%;
                    --secondary: 220 18% 22%;
                    --secondary-foreground: 210 40% 98%;
                    --muted: 220 18% 22%;
                    --muted-foreground: 210 40% 75%;
                    --accent: 38 92% 50%;
                    --accent-foreground: 220 18% 12%;
                    --destructive: 0 63% 31%;
                    --destructive-foreground: 210 40% 98%;
                    --border: 220 18% 25%;
                    --input: 220 18% 25%;
                    --ring: 190 85% 55%;
                }
                * {
                    box-sizing: border-box;
                    border-color: hsl(var(--border));
                }
                :host {
                    display: block;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                    background-color: hsl(var(--background));
                    color: hsl(var(--foreground));
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                .container { max-width: 80rem; margin-left: auto; margin-right: auto; padding: 1.5rem; }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .font-bold { font-weight: 700; }
                .text-primary { color: hsl(var(--primary)); }
                .hover\\:underline:hover { text-decoration: underline; }
                .grid { display: grid; }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .md\\:grid-cols-3 { @media (min-width: 768px) { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
                .gap-6 { gap: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .card { background-color: hsl(var(--card)); color: hsl(var(--card-foreground)); border: 1px solid hsl(var(--border)); border-radius: var(--radius); box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06); }
                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .items-center { align-items: center; }
                .justify-center { justify-content: center; }
                .p-6 { padding: 1.5rem; }
                .text-5xl { font-size: 3rem; line-height: 1; }
                .text-muted-foreground { color: hsl(var(--muted-foreground)); }
                .mt-2 { margin-top: 0.5rem; }
                .md\\:col-span-1 { @media (min-width: 768px) { grid-column: span 1 / span 1; } }
                .md\\:col-span-2 { @media (min-width: 768px) { grid-column: span 2 / span 2; } }
                .font-semibold { font-weight: 600; }
                .mb-3 { margin-bottom: 0.75rem; }
                .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
                .w-6 { width: 1.5rem; }
                .h-4 { height: 1rem; }
                .w-4 { width: 1rem; }
                .text-right { text-align: right; }
                .text-accent { color: hsl(var(--accent)); }
                .fill-accent { fill: hsl(var(--accent)); }
                .progress-bar { width: 100%; height: 0.5rem; background-color: hsl(var(--secondary)); border-radius: 9999px; overflow: hidden; }
                .progress-indicator { height: 100%; background-color: hsl(var(--primary)); transition: width 0.3s; }
                .w-full { width: 100%; }
                .flex-wrap { flex-wrap: wrap; }
                .gap-4 { gap: 1rem; }
                .rounded-lg { border-radius: var(--radius); }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .text-lg { font-size: 1.125rem; }
                .text-xs { font-size: 0.75rem; }
                .text-xl { font-size: 1.25rem; }
                .mb-4 { margin-bottom: 1rem; }
                .justify-between { justify-content: space-between; }
                .text-center { text-align: center; }
                .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
                .border-2 { border-width: 2px; }
                .border-dashed { border-style: dashed; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .h-12 { height: 3rem; }
                .w-12 { width: 3rem; }
                .mt-12 { margin-top: 3rem; }
                .star-rating { display: flex; align-items: center; gap: 0.125rem; }
                .star { width: 1.25rem; height: 1.25rem; color: hsl(var(--muted-foreground)); opacity: 0.3; }
                .star.filled { color: hsl(var(--accent)); fill: hsl(var(--accent)); opacity: 1; }
                .carousel { position: relative; width: 100%; }
                .carousel-content { display: flex; overflow-x: auto; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
                .carousel-content::-webkit-scrollbar { display: none; }
                .carousel-item { flex: 0 0 100%; padding: 0.25rem; }
                @media (min-width: 768px) { .carousel-item { flex-basis: 50%; } }
                @media (min-width: 1024px) { .carousel-item { flex-basis: 33.3333%; } }
                .carousel-button { position: absolute; top: 50%; transform: translateY(-50%); background-color: hsla(var(--card), 0.8); border: 1px solid hsl(var(--border)); border-radius: 9999px; width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .carousel-button:hover { background-color: hsl(var(--card)); }
                .carousel-button.prev { left: -1rem; }
                .carousel-button.next { right: -1rem; }
                .avatar { position: relative; display: flex; height: 2.5rem; width: 2.5rem; shrink: 0; overflow: hidden; border-radius: 9999px; }
                .avatar-image { aspect-ratio: 1/1; width: 100%; height: 100%; }
                .avatar-fallback { display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; rounded-full; background-color: hsl(var(--muted));}
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .pt-2 { padding-top: 0.5rem; }
                .text-foreground\\/80 { color: hsla(var(--foreground), 0.8); }
                .card-content { flex: 1; padding: 1.5rem; }
                .card-content .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
                button, .button { display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; border-radius: var(--radius); font-size: 0.875rem; font-weight: 500; padding: 0.5rem 1rem; transition: background-color 0.2s; cursor: pointer; background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border: none;}
                button:hover, .button:hover { background-color: hsl(var(--primary), 0.9); }
                button:disabled { opacity: 0.5; cursor: not-allowed; }
                a { color: hsl(var(--primary)); text-decoration: none; }
                a:hover { text-decoration: underline; }
                h1 { margin: 0; font-size: 2rem; font-weight: 700; }
                h2 { margin: 0; font-size: 1.5rem; font-weight: 600; }
                h3 { margin: 0; font-size: 1.25rem; font-weight: 600; }
                p { margin: 0; }
                .dialog-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.8); z-index: 50; }
                .dialog-content { position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 425px; background-color: hsl(var(--background)); border-radius: var(--radius); padding: 1.5rem; z-index: 50; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
                .dialog-header { margin-bottom: 1rem; text-align: left;}
                .dialog-title { font-size: 1.125rem; font-weight: 600; }
                .dialog-description { font-size: 0.875rem; color: hsl(var(--muted-foreground)); }
                .dialog-close-button { position: absolute; right: 1rem; top: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: hsl(var(--muted-foreground)); }
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
                .form-group input, .form-group textarea { width: 100%; padding: 0.5rem 0.75rem; border-radius: var(--radius); border: 1px solid hsl(var(--input)); background-color: hsl(var(--background)); font-size: 0.875rem; }
                .form-group textarea { min-height: 80px; }
                .form-footer { display: flex; justify-content: flex-end; margin-top: 1.5rem; }
            </style>
            <div class="container">
                <header class="mb-6">
                    <h1 class="text-3xl font-bold">${widget.businessName}</h1>
                    <a href="${widget.website}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${widget.website}</a>
                </header>
                
                ${this.renderSummary(widget)}
                
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">${widget.reviews.length > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                        <button id="write-review-btn">Write a Review</button>
                    </div>
                    ${widget.reviews.length > 0 ? this.renderCarousel(sortedReviews) : this.renderEmptyState()}
                </div>

                <footer class="text-center mt-12">
                    <p class="text-sm text-muted-foreground">Powered by Widget Wizard</p>
                </footer>
            </div>
            ${this.renderReviewDialog(widget)}
        `;

        this.attachEventListeners(widget);
    }
    
    renderStarRating(rating, totalStars = 5) {
        let stars = '';
        for (let i = 0; i < totalStars; i++) {
            stars += `<svg class="star ${i < Math.round(rating) ? 'filled' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"></path></svg>`;
        }
        return `<div class="star-rating">${stars}</div>`;
    }

    renderSummary(widget) {
        if (!widget.reviews || widget.reviews.length === 0) return '';

        const totalReviews = widget.reviews.length;
        const overallRating = widget.reviews.reduce((acc, r) => acc + r.stars, 0) / totalReviews;
        const ratingDistribution = Array(5).fill(0);
        widget.reviews.forEach(r => ratingDistribution[5 - r.stars]++);
        
        return `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="card md:col-span-1 flex flex-col items-center justify-center text-center p-6">
                    <p class="text-5xl font-bold">${overallRating.toFixed(1)}</p>
                    ${this.renderStarRating(overallRating)}
                    <p class="text-muted-foreground mt-2">Based on ${totalReviews} reviews</p>
                </div>
                <div class="card md:col-span-2 p-6">
                    <h3 class="font-semibold mb-3">Rating distribution</h3>
                    <div class="space-y-2">
                        ${ratingDistribution.map((count, i) => `
                            <div class="flex items-center gap-2 text-sm">
                                <span class="text-muted-foreground w-6 text-right">${5 - i}</span>
                                <svg class="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"></path></svg>
                                <div class="progress-bar"><div class="progress-indicator" style="width: ${(count / totalReviews) * 100}%"></div></div>
                                <span class="text-muted-foreground w-8 text-right">${count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderCarousel(reviews) {
        return `
            <div class="carousel">
                <div class="carousel-content">
                    ${reviews.map(review => `
                        <div class="carousel-item">
                            <div class="card flex flex-col h-full">
                                <div class="card-content space-y-4">
                                    <div class="flex items-center gap-3">
                                        <div class="avatar">
                                            <img class="avatar-image" src="https://placehold.co/40x40.png?text=${review.name.charAt(0)}" alt="avatar">
                                        </div>
                                        <div>
                                            <p class="font-semibold">${review.name}</p>
                                            <p class="text-xs text-muted-foreground">${review.source} review</p>
                                        </div>
                                    </div>
                                    ${this.renderStarRating(review.stars)}
                                    <p class="text-sm text-foreground/80 pt-2">${review.text}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="text-center py-20 border-2 border-dashed rounded-lg text-muted-foreground">
                <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3 class="mt-2 text-lg font-semibold">No reviews yet</h3>
                <p>Your widget is ready to collect feedback.</p>
            </div>
        `;
    }

    renderReviewDialog(widget) {
        return `
            <div id="review-dialog" class="dialog-overlay" style="display: none;">
                <div class="dialog-content">
                    <button id="close-dialog-btn" class="dialog-close-button">&times;</button>
                    <div class="dialog-header">
                        <h2 class="dialog-title">Write a review</h2>
                        <p class="dialog-description">Share your experience with ${widget.businessName}.</p>
                    </div>
                    <form id="review-form">
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div class="form-group">
                            <label>Rating</label>
                            <div id="form-star-rating" class="star-rating" data-rating="0">
                                ${[1, 2, 3, 4, 5].map(star => `<svg class="star" data-value="${star}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"></path></svg>`).join('')}
                            </div>
                            <input type="hidden" id="stars" name="stars" value="0" />
                        </div>
                        <div class="form-group">
                            <label for="text">Review</label>
                            <textarea id="text" name="text" required></textarea>
                        </div>
                         <p id="form-error" class="text-sm" style="color: hsl(var(--destructive)); display: none; margin-bottom: 1rem;"></p>
                        <div class="form-footer">
                            <button type="submit" id="submit-review-btn">Submit Review</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    attachEventListeners(widget) {
        const dialog = this.shadowRoot.querySelector('#review-dialog');
        const writeReviewBtn = this.shadowRoot.querySelector('#write-review-btn');
        const closeDialogBtn = this.shadowRoot.querySelector('#close-dialog-btn');
        const form = this.shadowRoot.querySelector('#review-form');
        const starsContainer = this.shadowRoot.querySelector('#form-star-rating');
        const starsInput = this.shadowRoot.querySelector('#stars');

        writeReviewBtn.addEventListener('click', () => dialog.style.display = 'flex');
        closeDialogBtn.addEventListener('click', () => dialog.style.display = 'none');
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.style.display = 'none';
            }
        });

        const allStars = starsContainer.querySelectorAll('.star');
        starsContainer.addEventListener('click', (e) => {
            const rating = e.target.closest('.star')?.dataset.value;
            if (rating) {
                starsInput.value = rating;
                starsContainer.dataset.rating = rating;
                allStars.forEach(s => s.classList.toggle('filled', s.dataset.value <= rating));
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = this.shadowRoot.querySelector('#submit-review-btn');
            const errorP = this.shadowRoot.querySelector('#form-error');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            errorP.style.display = 'none';

            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                stars: parseInt(formData.get('stars'), 10),
                text: formData.get('text'),
                source: 'Direct'
            };

            if (data.stars === 0) {
                 errorP.textContent = 'Please select a star rating.';
                 errorP.style.display = 'block';
                 submitButton.disabled = false;
                 submitButton.textContent = 'Submit Review';
                 return;
            }

            try {
                const response = await fetch(`${this.apiBase}/api/widgets/${this.widgetId}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Failed to submit review');
                }
                dialog.style.display = 'none';
                form.reset();
                starsContainer.dataset.rating = 0;
                allStars.forEach(s => s.classList.remove('filled'));
                this.fetchWidgetData(); // Refresh data
            } catch (error) {
                errorP.textContent = `Error: ${error.message}`;
                errorP.style.display = 'block';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Review';
            }
        });
    }
}

// Only define the custom element if it doesn't already exist.
if (!customElements.get('review-widget')) {
    customElements.define('review-widget', ReviewWidget);
}
