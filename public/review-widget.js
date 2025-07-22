
(function() {
    function getWidgetData(widgetId, callback) {
        // Use a publicly accessible URL for the API
        const apiUrl = `https://widget-wizard.app-prototyper.com/api/widgets/${widgetId}`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    callback(data.data);
                } else {
                    console.error('Failed to get widget data:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching widget data:', error);
            });
    }

    function renderWidget(widgetEl, widgetData) {
        const shadowRoot = widgetEl.attachShadow({ mode: 'open' });

        const { overallRating, totalReviews, ratingDistribution, sortedReviews } = processReviews(widgetData.reviews);

        const widgetContainer = document.createElement('div');
        widgetContainer.innerHTML = `
            <style>
                :host {
                    all: initial;
                    font-family: Arial, Helvetica, sans-serif;
                }
                .widget-container {
                    --background: 240 10% 3.9%;
                    --foreground: 0 0% 98%;
                    --card: 240 4.8% 9.8%;
                    --card-foreground: 0 0% 98%;
                    --primary: 262.1 83.3% 57.8%;
                    --primary-foreground: 0 0% 98%;
                    --muted: 240 3.7% 15.9%;
                    --muted-foreground: 240 5% 64.9%;
                    --accent: 333.3 83.3% 57.8%;
                    --border: 240 3.7% 15.9%;
                    
                    background-color: hsl(var(--background));
                    color: hsl(var(--foreground));
                    padding: 1.5rem;
                    border-radius: 0.8rem;
                    max-width: 64rem;
                    margin: auto;
                    border: 1px solid hsl(var(--border));
                }
                .grid { display: grid; }
                .flex { display: flex; }
                .gap-6 { gap: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .md-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .md-col-span-1 { grid-column: span 1 / span 1; }
                .md-col-span-2 { grid-column: span 2 / span 2; }
                .items-center { align-items: center; }
                .justify-center { justify-content: center; }
                .flex-col { flex-direction: column; }
                .text-center { text-align: center; }
                .p-6 { padding: 1.5rem; }
                .text-5xl { font-size: 3rem; line-height: 1; }
                .font-bold { font-weight: 700; }
                .mt-2 { margin-top: 0.5rem; }
                .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
                .font-semibold { font-weight: 600; }
                .mb-3 { margin-bottom: 0.75rem; }
                .w-full { width: 100%; }
                .h-2 { height: 0.5rem; }
                .text-right { text-align: right; }
                .w-6 { width: 1.5rem; }
                .w-8 { width: 2rem; }
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .text-muted-foreground { color: hsl(var(--muted-foreground)); }
                .bg-card { background-color: hsl(var(--card)); border-radius: 0.8rem; border: 1px solid hsl(var(--border)); }
                
                h1 { font-size: 1.875rem; font-weight: 700; margin: 0 0 0.5rem 0;}
                a { color: hsl(var(--primary)); text-decoration: none; }
                a:hover { text-decoration: underline; }

                .star-rating { display: flex; gap: 0.125rem; }
                .star {
                    width: 1.25rem; height: 1.25rem;
                    fill: transparent;
                    stroke: hsl(var(--muted-foreground));
                    stroke-width: 1.5;
                }
                .star.filled {
                    fill: hsl(var(--accent));
                    stroke: hsl(var(--accent));
                }

                .progress-bar {
                    background-color: hsl(var(--muted));
                    border-radius: 9999px;
                    overflow: hidden;
                    flex-grow: 1;
                }
                .progress {
                    background-color: hsl(var(--primary));
                    height: 100%;
                }
                .carousel-container {
                    overflow: hidden;
                    position: relative;
                }
                .carousel-content {
                    display: flex;
                    transition: transform 0.5s ease-in-out;
                }
                .carousel-item {
                    flex: 0 0 100%;
                    padding: 0 0.5rem;
                }
                @media (min-width: 768px) {
                    .carousel-item { flex-basis: 50%; }
                }
                @media (min-width: 1024px) {
                    .carousel-item { flex-basis: 33.333%; }
                }
                .carousel-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .carousel-card-content {
                    flex-grow: 1;
                }
                .avatar {
                    width: 2.5rem; height: 2.5rem; border-radius: 9999px; background-color: hsl(var(--muted));
                    display: flex; items-center; justify-content: center;
                    font-weight: 600;
                    border: 1px solid hsl(var(--border));
                }

                .carousel-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: hsl(var(--card));
                    border: 1px solid hsl(var(--border));
                    border-radius: 9999px;
                    width: 2.5rem;
                    height: 2.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .carousel-button:hover {
                    background-color: hsl(var(--muted));
                }
                .carousel-button.prev { left: -1rem; }
                .carousel-button.next { right: -1rem; }
            </style>
            
            <div class="widget-container">
                <header class="mb-6">
                    <h1>${widgetData.businessName}</h1>
                    <a href="${widgetData.website}" target="_blank" rel="noopener noreferrer">${widgetData.website}</a>
                </header>
                
                ${totalReviews > 0 ? `
                <div class="grid md-grid-cols-3 gap-6 mb-8">
                    <div class="md-col-span-1 flex flex-col items-center justify-center text-center p-6 bg-card">
                        <p class="text-5xl font-bold">${overallRating.toFixed(1)}</p>
                        ${createStarRating(overallRating)}
                        <p class="text-muted-foreground mt-2">Based on ${totalReviews} reviews</p>
                    </div>
                    <div class="md-col-span-2 p-6 bg-card">
                        <h2 class="font-semibold mb-3">Rating distribution</h2>
                        <div class="space-y-2">
                            ${ratingDistribution.map((count, i) => `
                                <div class="flex items-center gap-2 text-sm">
                                    <span class="text-muted-foreground w-6 text-right">${5 - i}</span>
                                    <svg class="star filled" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.88 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"></path></svg>
                                    <div class="progress-bar h-2 w-full"><div class="progress" style="width: ${(count / totalReviews) * 100}%"></div></div>
                                    <span class="text-muted-foreground w-8 text-right">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 class="font-semibold" style="font-size: 1.25rem; margin-bottom: 1rem;">What people are saying</h2>
                    <div class="carousel-container">
                        <div class="carousel-content">
                            ${sortedReviews.map(review => `
                                <div class="carousel-item">
                                    <div class="p-1 h-full">
                                        <div class="bg-card flex flex-col h-full p-6 carousel-card">
                                            <div class="flex-1 space-y-4 carousel-card-content">
                                                <div class="flex items-center gap-3">
                                                    <div class="avatar">
                                                        ${review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p class="font-semibold">${review.name}</p>
                                                        <p class="text-xs text-muted-foreground">${review.source} review</p>
                                                    </div>
                                                </div>
                                                ${createStarRating(review.stars)}
                                                <p class="text-sm text-foreground/80 pt-2">${review.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        ${sortedReviews.length > 3 ? `
                            <button class="carousel-button prev">&lt;</button>
                            <button class="carousel-button next">&gt;</button>
                        ` : ''}
                    </div>
                </div>
                ` : `
                <div class="text-center py-20 border-2 border-dashed rounded-lg bg-card text-muted-foreground">
                    <h3 class="mt-2 text-lg font-semibold">No reviews yet</h3>
                    <p>Your widget is ready to collect feedback.</p>
                </div>
                `}
                 <footer class="text-center mt-12">
                    <p class="text-sm text-muted-foreground">Powered by Widget Wizard</p>
                </footer>
            </div>
        `;
        shadowRoot.appendChild(widgetContainer);
        
        // Add carousel functionality if needed
        if (totalReviews > 0 && sortedReviews.length > 3) {
            const content = shadowRoot.querySelector('.carousel-content');
            const prevButton = shadowRoot.querySelector('.carousel-button.prev');
            const nextButton = shadowRoot.querySelector('.carousel-button.next');
            let currentIndex = 0;
            const totalItems = shadowRoot.querySelectorAll('.carousel-item').length;
            const itemsToShow = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);


            function updateCarousel() {
                const itemWidth = content.querySelector('.carousel-item').clientWidth;
                content.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            }

            prevButton.addEventListener('click', () => {
                currentIndex = Math.max(currentIndex - 1, 0);
                updateCarousel();
            });

            nextButton.addEventListener('click', () => {
                currentIndex = Math.min(currentIndex + 1, totalItems - itemsToShow);
                updateCarousel();
            });

            window.addEventListener('resize', updateCarousel);
        }
    }

    function processReviews(reviews) {
        if (!reviews || reviews.length === 0) {
            return {
                overallRating: 0,
                totalReviews: 0,
                ratingDistribution: [0, 0, 0, 0, 0],
                reviewsBySource: {},
                sortedReviews: [],
            };
        }

        const total = reviews.reduce((acc, review) => acc + review.stars, 0);
        const overall = total / reviews.length;

        const distribution = Array(5).fill(0);
        const sourceCounts = {};

        for (const review of reviews) {
            distribution[5 - review.stars]++;
        }
        
        const sorted = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return {
            overallRating: overall,
            totalReviews: reviews.length,
            ratingDistribution: distribution,
            sortedReviews: sorted,
        };
    }
    
    function createStarRating(rating, totalStars = 5) {
        let starsHtml = '<div class="star-rating">';
        for (let i = 0; i < totalStars; i++) {
            const isFilled = i < Math.round(rating);
            starsHtml += `<svg class="star ${isFilled ? 'filled' : ''}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.88 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"></path></svg>`;
        }
        starsHtml += '</div>';
        return starsHtml;
    }


    function init() {
        const widgetTags = document.querySelectorAll('review-widget');
        widgetTags.forEach(tag => {
            const widgetId = tag.getAttribute('widgetId');
            if (widgetId) {
                getWidgetData(widgetId, (data) => renderWidget(tag, data));
            } else {
                console.error('widgetId attribute is missing from <review-widget> tag.');
            }
        });
    }

    // Wait for the DOM to be fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
