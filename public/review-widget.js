
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const widgetContainer = document.querySelector('review-widget');
        if (!widgetContainer) {
            console.error('Widget container <review-widget> not found.');
            return;
        }

        const widgetId = widgetContainer.getAttribute('widgetId');
        const apiBaseUrl = "https://widget-wizard-chris.netlify.app";

        if (!widgetId) {
            console.error('Widget configuration is missing: widgetId is required.');
            widgetContainer.innerHTML = `<p style="color:red;font-family:sans-serif;">Error: Widget ID is missing.</p>`;
            return;
        }

        const shadowRoot = widgetContainer.attachShadow({ mode: 'open' });

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            :host {
                display: block;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            }
            .p-4 { padding: 1rem; }
            .sm\\:p-6 { padding: 1.5rem; }
            .bg-background { background-color: #ffffff; }
            .dark .bg-background { background-color: #0c0a09; }
            .text-foreground { color: #0c0a09; }
            .dark .text-foreground { color: #f2f2f2; }
            .max-w-4xl { max-width: 80rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .mb-6 { margin-bottom: 1.5rem; }
            .text-center { text-align: center; }
            .sm\\:text-left { text-align: left; }
            .text-2xl { font-size: 1.5rem; }
            .sm\\:text-3xl { font-size: 1.875rem; }
            .font-bold { font-weight: 700; }
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .gap-8 { gap: 2rem; }
            .gap-6 { gap: 1.5rem; }
            .card { border: 1px solid #e5e7eb; border-radius: 0.75rem; background-color: #ffffff; }
            .dark .card { border: 1px solid #27272a; background-color: #18181b;}
            .p-6 { padding: 1.5rem; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .text-5xl { font-size: 3rem; }
            .text-muted-foreground { color: #6b7280; }
            .dark .text-muted-foreground { color: #a1a1aa; }
            .mt-2 { margin-top: 0.5rem; }
            .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
            .w-6 { width: 1.5rem; }
            .h-4 { height: 1rem; }
            .w-4 { width: 1rem; }
            .text-accent { color: #f59e0b; }
            .fill-accent { fill: #f59e0b; }
            .w-full { width: 100%; }
            .h-2 { height: 0.5rem; }
            .progress-bar { background-color: #e5e7eb; border-radius: 9999px; overflow: hidden; }
            .progress-bar-inner { background-color: #f59e0b; height: 100%; }
            .mb-4 { margin-bottom: 1rem; }
            .justify-between { justify-content: space-between; }
            .font-semibold { font-weight: 600; }
            .text-xl { font-size: 1.25rem; }
            .button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                font-weight: 500;
                padding: 0.5rem 1rem;
                border: 1px solid transparent;
                cursor: pointer;
                transition: background-color 0.2s;
                background-color: #4f46e5;
                color: #ffffff;
            }
            .button:hover { background-color: #4338ca; }
            .button:disabled { opacity: 0.5; cursor: not-allowed; }
            .card-content { padding: 1.5rem; }
            .items-start { align-items: flex-start; }
            .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
            .gap-3 { gap: 0.75rem; }
            .avatar { width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden; background-color: #d1d5db; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #1f2937; }
            .avatar img { width: 100%; height: 100%; object-fit: cover; }
            .text-xs { font-size: 0.75rem; }
            .pt-2 { padding-top: 0.5rem; }
            .break-words { word-break: break-word; }
            .text-center { text-align: center; }
            .h-full { height: 100%; }
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
            .star-rating { display: flex; align-items: center; gap: 0.125rem; }
            .star-rating svg { width: 1.25rem; height: 1.25rem; }
            .star-rating .filled { color: #f59e0b; fill: #f59e0b; }
            .star-rating .empty { color: #d1d5db; }

            /* Modal Styles */
            .modal-overlay { position: fixed; inset: 0; z-index: 50; background-color: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; }
            .modal-content {
                position: relative;
                background-color: #ffffff;
                color: #0c0a09;
                border-radius: 0.75rem;
                padding: 1.5rem;
                width: 100%;
                max-width: 425px;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            }
            .dark .modal-content { background-color: #18181b; color: #f2f2f2; }
            .modal-header { text-align: left; margin-bottom: 1rem; }
            .modal-title { font-size: 1.25rem; font-weight: 600; }
            .modal-description { font-size: 0.875rem; color: #6b7280; }
            .dark .modal-description { color: #a1a1aa; }
            .modal-close-button { position: absolute; top: 1rem; right: 1rem; cursor: pointer; color: #6b7280; }
            .modal-close-button:hover { color: #111827; }
            .dark .modal-close-button { color: #a1a1aa; }
            .dark .modal-close-button:hover { color: #f9fafb; }

            /* Form Styles */
            .form-group { margin-bottom: 1rem; }
            .form-label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
            .form-input, .form-textarea {
                width: 100%;
                padding: 0.5rem 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                background-color: #ffffff;
                color: #111827;
                font-size: 0.875rem;
            }
            .dark .form-input, .dark .form-textarea {
                 border: 1px solid #3f3f46;
                 background-color: #27272a;
                 color: #f4f4f5;
            }
            .form-textarea { min-height: 80px; }
            .form-footer { display: flex; justify-content: flex-end; margin-top: 1.5rem; }
            .rating-input { display: flex; gap: 0.25rem; }
            .rating-input .star { cursor: pointer; color: #d1d5db; }
            .rating-input .star.filled, .rating-input .star.hovered { color: #f59e0b; }
            .rating-input .star svg { width: 1.5rem; height: 1.5rem; }

        `;
        shadowRoot.appendChild(styleSheet);

        const renderWidget = (data) => {
            const widget = data.data;

            const totalReviews = widget.reviews.length;
            const overallRating = totalReviews > 0 ? widget.reviews.reduce((acc, r) => acc + r.stars, 0) / totalReviews : 0;
            const ratingDistribution = [0, 0, 0, 0, 0];
            if (totalReviews > 0) {
                widget.reviews.forEach(r => {
                    ratingDistribution[5 - r.stars]++;
                });
            }
            const sortedReviews = widget.reviews ? [...widget.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

            const wrapper = document.createElement('div');
            wrapper.className = `p-4 sm:p-6 bg-background text-foreground`;
            
            let reviewsHtml = '';
            if (totalReviews > 0) {
                reviewsHtml = sortedReviews.map(review => `
                    <div class="card h-full">
                        <div class="card-content flex flex-col space-y-4 h-full">
                            <div class="flex items-start gap-3">
                                <div class="avatar">
                                    <span>${review.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <p class="font-semibold">${review.name}</p>
                                    <p class="text-xs text-muted-foreground">${review.source} review</p>
                                </div>
                            </div>
                            <div class="star-rating">
                                ${Array.from({ length: 5 }, (_, i) => `
                                    <svg class="${i < review.stars ? 'filled' : 'empty'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.449l-7.416 4.026 1.48-8.279-6.064-5.828 8.332-1.151z"/></svg>
                                `).join('')}
                            </div>
                            <p class="text-sm pt-2 break-words">${review.text}</p>
                        </div>
                    </div>
                `).join('');
            } else {
                 reviewsHtml = `
                    <div class="text-center py-20 border-2 border-dashed rounded-lg bg-card text-muted-foreground col-span-1 sm:col-span-2 lg:col-span-3">
                      <h3 class="mt-2 text-lg font-semibold">No reviews yet</h3>
                      <p>Your widget is ready to collect feedback.</p>
                    </div>
                 `;
            }

            wrapper.innerHTML = `
                <div class="max-w-4xl mx-auto">
                    <header class="mb-6 text-center sm:text-left">
                        <h1 class="text-2xl sm:text-3xl font-bold">${widget.businessName}</h1>
                    </header>
                    ${totalReviews > 0 ? `
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div class="card md:col-span-1 flex flex-col items-center justify-center text-center p-6">
                            <p class="text-5xl font-bold">${overallRating.toFixed(1)}</p>
                            <div class="star-rating">
                                ${Array.from({ length: 5 }, (_, i) => `
                                    <svg class="${i < Math.round(overallRating) ? 'filled' : 'empty'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.449l-7.416 4.026 1.48-8.279-6.064-5.828 8.332-1.151z"/></svg>
                                `).join('')}
                            </div>
                            <p class="text-muted-foreground mt-2">Based on ${totalReviews} reviews</p>
                          </div>
                          <div class="card md:col-span-2 p-6">
                            <h2 class="font-semibold mb-3">Rating distribution</h2>
                            <div class="space-y-2">
                                ${ratingDistribution.map((count, i) => `
                                    <div class="flex items-center gap-2 text-sm">
                                      <span class="text-muted-foreground w-6 text-right">${5 - i}</span>
                                      <svg class="w-4 h-4 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.449l-7.416 4.026 1.48-8.279-6.064-5.828 8.332-1.151z"/></svg>
                                      <div class="progress-bar w-full h-2">
                                        <div class="progress-bar-inner" style="width: ${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%"></div>
                                      </div>
                                      <span class="text-muted-foreground w-8 text-right">${count}</span>
                                    </div>
                                `).join('')}
                            </div>
                          </div>
                        </div>
                    ` : ''}
                    <div>
                        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                            <h2 class="text-xl font-bold">${totalReviews > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                            <button class="button" id="write-review-btn">Write a Review</button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${reviewsHtml}
                        </div>
                    </div>
                </div>
            `;
            
            shadowRoot.innerHTML = '';
            shadowRoot.appendChild(styleSheet);
            shadowRoot.appendChild(wrapper);

            shadowRoot.getElementById('write-review-btn').addEventListener('click', () => {
                showReviewModal();
            });
        };

        const showReviewModal = () => {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.remove();
                }
            });

            modalOverlay.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Write a review</h3>
                        <p class="modal-description">Share your experience with your business.</p>
                    </div>
                    <form id="review-form">
                        <div class="form-group">
                            <label for="name" class="form-label">Your Name</label>
                            <input type="text" id="name" name="name" class="form-input" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Rating</label>
                            <div id="star-rating-input" class="rating-input">
                                ${[1,2,3,4,5].map(i => `<span class="star" data-value="${i}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.449l-7.416 4.026 1.48-8.279-6.064-5.828 8.332-1.151z"/></svg></span>`).join('')}
                            </div>
                            <input type="hidden" id="stars" name="stars" value="0" />
                        </div>
                        <div class="form-group">
                            <label for="text" class="form-label">Review</label>
                            <textarea id="text" name="text" class="form-textarea" required></textarea>
                        </div>
                        <div class="form-footer">
                            <button type="submit" class="button" id="submit-review-btn">Submit Review</button>
                        </div>
                    </form>
                    <div id="modal-close" class="modal-close-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
            `;
            shadowRoot.appendChild(modalOverlay);

            const starsInput = shadowRoot.getElementById('stars');
            const starElements = shadowRoot.querySelectorAll('#star-rating-input .star');
            let currentRating = 0;

            const updateStars = (rating) => {
                starElements.forEach(star => {
                    const starValue = parseInt(star.getAttribute('data-value'));
                    star.classList.toggle('filled', starValue <= rating);
                    star.classList.remove('hovered');
                });
            };
            
            starElements.forEach(star => {
                star.addEventListener('click', () => {
                    currentRating = parseInt(star.getAttribute('data-value'));
                    starsInput.value = currentRating;
                    updateStars(currentRating);
                });
                star.addEventListener('mouseover', () => {
                    const hoverValue = parseInt(star.getAttribute('data-value'));
                    starElements.forEach(s => {
                         s.classList.toggle('hovered', parseInt(s.getAttribute('data-value')) <= hoverValue);
                    });
                });
                 star.addEventListener('mouseout', () => {
                    updateStars(currentRating);
                });
            });

            shadowRoot.getElementById('modal-close').addEventListener('click', () => {
                modalOverlay.remove();
            });

            shadowRoot.getElementById('review-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = shadowRoot.getElementById('submit-review-btn');
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;

                const formData = new FormData(e.target);
                const data = {
                    name: formData.get('name'),
                    stars: parseInt(formData.get('stars'), 10),
                    text: formData.get('text'),
                    source: 'Direct'
                };

                try {
                    const response = await fetch(`${apiBaseUrl}/api/widgets/${widgetId}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to submit review.');
                    }
                    modalOverlay.remove();
                    fetchAndRender();
                } catch (error) {
                    alert(`Error: ${error.message}`);
                    submitBtn.textContent = 'Submit Review';
                    submitBtn.disabled = false;
                }
            });
        };
        
        const fetchAndRender = () => {
            fetch(`${apiBaseUrl}/api/widgets/${widgetId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    renderWidget(data);
                })
                .catch(error => {
                    console.error('Error fetching widget data:', error);
                    shadowRoot.innerHTML = `<p style="color:red;font-family:sans-serif;">Error: Could not load widget.</p>`;
                });
        };
        
        fetchAndRender();
    });
})();

