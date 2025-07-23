import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

const API_ENDPOINT = "https://widget-wizard-api.fly.dev/api/widgets";

class ReviewWidget extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol";
      --rw-background: hsl(240 10% 3.9%);
      --rw-foreground: hsl(0 0% 98%);
      --rw-card: hsl(240 4.8% 9.8%);
      --rw-card-foreground: hsl(0 0% 98%);
      --rw-primary: hsl(262.1 83.3% 57.8%);
      --rw-primary-foreground: hsl(0 0% 98%);
      --rw-muted-foreground: hsl(240 5% 64.9%);
      --rw-accent: hsl(333.3 83.3% 57.8%);
      --rw-border: hsl(240 3.7% 15.9%);
      --rw-radius: 0.8rem;
    }
    .font-body {
      font-family: "Inter", sans-serif;
    }
    .antialiased {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .bg-background {
      background-color: var(--rw-background);
    }
    .text-foreground {
      color: var(--rw-foreground);
    }
    .min-h-screen {
      min-height: 100vh;
    }
    .p-4 {
      padding: 1rem;
    }
    .sm\\:p-6 {
      padding: 1.5rem;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .max-w-4xl {
      max-width: 56rem;
    }
    .mb-6 {
      margin-bottom: 1.5rem;
    }
    .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    .font-bold {
      font-weight: 700;
    }
    .text-primary {
      color: var(--rw-primary);
    }
    .hover\\:underline:hover {
      text-decoration: underline;
    }
    .grid {
      display: grid;
    }
    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    .md\\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .gap-6 {
      gap: 1.5rem;
    }
    .mb-8 {
      margin-bottom: 2rem;
    }
    .md\\:col-span-1 {
      grid-column: span 1 / span 1;
    }
    .md\\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    .flex {
      display: flex;
    }
    .flex-col {
      flex-direction: column;
    }
    .items-center {
      align-items: center;
    }
    .justify-center {
      justify-content: center;
    }
    .text-center {
      text-align: center;
    }
    .p-6 {
      padding: 1.5rem;
    }
    .bg-card {
      background-color: var(--rw-card);
    }
    .text-5xl {
      font-size: 3rem;
      line-height: 1;
    }
    .text-muted-foreground {
      color: var(--rw-muted-foreground);
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
    .font-semibold {
      font-weight: 600;
    }
    .mb-3 {
      margin-bottom: 0.75rem;
    }
    .space-y-2 > :not([hidden]) ~ :not([hidden]) {
      --tw-space-y-reverse: 0;
      margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
      margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
    }
    .gap-2 {
      gap: 0.5rem;
    }
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .w-6 {
      width: 1.5rem;
    }
    .text-right {
      text-align: right;
    }
    .w-4 {
      width: 1rem;
    }
    .h-4 {
      height: 1rem;
    }
    .text-accent {
      color: var(--rw-accent);
    }
    .w-full {
      width: 100%;
    }
    .h-2 {
      height: 0.5rem;
    }
    .w-8 {
      width: 2rem;
    }
    .mb-8 {
      margin-bottom: 2rem;
    }
    .text-xl {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .flex-wrap {
      flex-wrap: wrap;
    }
    .gap-4 {
      gap: 1rem;
    }
    .border {
      border-width: 1px;
      border-color: var(--rw-border);
    }
    .rounded-lg {
      border-radius: var(--rw-radius);
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .text-lg {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    .text-xs {
      font-size: 0.75rem;
      line-height: 1rem;
    }
    .justify-between {
      justify-content: space-between;
    }
    .w-full {
      width: 100%;
    }
    .h-full {
      height: 100%;
    }
    .p-1 {
      padding: 0.25rem;
    }
    .space-y-4 > :not([hidden]) ~ :not([hidden]) {
      --tw-space-y-reverse: 0;
      margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
      margin-bottom: calc(1rem * var(--tw-space-y-reverse));
    }
    .gap-3 {
      gap: 0.75rem;
    }
    .flex-1 {
      flex: 1 1 0%;
    }
    .pt-2 {
      padding-top: 0.5rem;
    }
    .text-foreground\\/80 {
      color: rgba(var(--rw-foreground), 0.8);
    }
    .py-20 {
      padding-top: 5rem;
      padding-bottom: 5rem;
    }
    .border-2 {
      border-width: 2px;
    }
    .border-dashed {
      border-style: dashed;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .h-12 {
      height: 3rem;
    }
    .w-12 {
      width: 3rem;
    }
    .mt-12 {
      margin-top: 3rem;
    }
    .text-primary {
      color: var(--rw-primary);
    }
    .hover\\:underline:hover {
      text-decoration: underline;
    }
    .progress-container {
      position: relative;
      overflow: hidden;
      background-color: var(--rw-border);
      border-radius: var(--rw-radius);
    }
    .progress-bar {
      height: 100%;
      background-color: var(--rw-primary);
      transition: width 0.3s ease-in-out;
    }
    .star-rating {
      display: flex;
      align-items: center;
      gap: 0.125rem;
    }
    .star-rating svg {
      fill: currentColor;
    }
    .avatar {
      position: relative;
      display: flex;
      height: 2.5rem;
      width: 2.5rem;
      flex-shrink: 0;
      overflow: hidden;
      border-radius: 9999px;
    }
    .avatar-image {
      aspect-ratio: 1 / 1;
      height: 100%;
      width: 100%;
    }
    .avatar-fallback {
      display: flex;
      height: 100%;
      width: 100%;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      background-color: var(--rw-muted);
    }
    .carousel {
      position: relative;
    }
    .carousel-content {
      display: flex;
    }
    .carousel-item {
      min-width: 0;
      flex-shrink: 0;
      flex-grow: 0;
      flex-basis: 100%;
      padding-left: 0.25rem;
    }
    @media (min-width: 768px) {
      .md\\:basis-1\\/2 {
        flex-basis: 50%;
      }
    }
    @media (min-width: 1024px) {
      .lg\\:basis-1\\/3 {
        flex-basis: 33.333333%;
      }
    }
    .carousel-previous,
    .carousel-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      border: 1px solid var(--rw-border);
      background-color: var(--rw-card);
      width: 2rem;
      height: 2rem;
      cursor: pointer;
    }
    .carousel-previous {
      left: -1rem;
    }
    .carousel-next {
      right: -1rem;
    }
    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--rw-radius);
        background-color: var(--rw-primary);
        color: var(--rw-primary-foreground);
        padding: 0.5rem 1rem;
        cursor: pointer;
        border: none;
        font-weight: 600;
    }
    .dialog-overlay {
        position: fixed;
        inset: 0;
        z-index: 50;
        background-color: rgba(0,0,0,0.8);
    }
    .dialog-content {
        position: fixed;
        left: 50%;
        top: 50%;
        z-index: 50;
        transform: translate(-50%, -50%);
        border: 1px solid var(--rw-border);
        background-color: var(--rw-background);
        padding: 1.5rem;
        border-radius: var(--rw-radius);
        width: 90%;
        max-width: 425px;
    }
    .dialog-header { text-align: left; }
    .dialog-title { font-size: 1.25rem; font-weight: 600; }
    .dialog-description { font-size: 0.875rem; color: var(--rw-muted-foreground); margin-top: 0.5rem; }
    
    .loading-spinner, .error-message {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
        color: var(--rw-muted-foreground);
    }
  `;

  static properties = {
    widgetId: { type: String, reflect: true },
    widget: { type: Object, state: true },
    loading: { type: Boolean, state: true },
    error: { type: String, state: true },
    carouselIndex: { type: Number, state: true },
    showDialog: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.widgetId = "";
    this.widget = null;
    this.loading = true;
    this.error = null;
    this.carouselIndex = 0;
    this.showDialog = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadGoogleFont();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === "widgetid" && newVal && newVal !== oldVal) {
      this.widgetId = newVal;
      this.fetchWidgetData();
    }
  }

  loadGoogleFont() {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  async fetchWidgetData() {
    if (!this.widgetId) {
      this.error = "Widget ID is missing.";
      this.loading = false;
      return;
    }
    this.loading = true;
    this.error = null;
    try {
      const response = await fetch(`${API_ENDPOINT}/${this.widgetId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch widget data.");
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "API returned an error.");
      }
      this.widget = data.data;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  get overallStats() {
    if (!this.widget || !this.widget.reviews || this.widget.reviews.length === 0) {
      return {
        overallRating: 0,
        totalReviews: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
        reviewsBySource: {},
      };
    }
    const { reviews } = this.widget;
    const total = reviews.reduce((acc, review) => acc + review.stars, 0);
    const overall = total / reviews.length;
    const distribution = Array(5).fill(0);
    const sourceCounts = {};
    for (const review of reviews) {
      distribution[5 - review.stars]++;
      if (!sourceCounts[review.source]) {
        sourceCounts[review.source] = { count: 0, totalStars: 0 };
      }
      sourceCounts[review.source].count++;
      sourceCounts[review.source].totalStars += review.stars;
    }
    return {
      overallRating: overall,
      totalReviews: reviews.length,
      ratingDistribution: distribution,
      reviewsBySource: sourceCounts,
    };
  }
  
  get sortedReviews() {
      if (!this.widget || !this.widget.reviews) return [];
      return [...this.widget.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  renderStarRating(rating, iconClassName = "w-5 h-5") {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(html`
        <svg
          class="${iconClassName} ${i < Math.round(rating)
            ? "text-accent"
            : "text-muted-foreground/30"}"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      `);
    }
    return html`<div class="star-rating">${stars}</div>`;
  }
  
  handleCarouselNav(direction) {
    const items = this.sortedReviews;
    const newIndex = this.carouselIndex + direction;
    if (newIndex >= 0 && newIndex < items.length) {
        this.carouselIndex = newIndex;
        const container = this.shadowRoot.querySelector('.carousel-content');
        const itemWidth = container.querySelector('.carousel-item').offsetWidth;
        container.scrollTo({ left: itemWidth * newIndex, behavior: 'smooth' });
    }
  }
  
  renderReviewForm() {
    return html`
      <div class="dialog-overlay" @click=${() => this.showDialog = false}>
        <div class="dialog-content" @click=${e => e.stopPropagation()}>
          <div class="dialog-header">
            <h3 class="dialog-title">Write a review</h3>
            <p class="dialog-description">Share your experience with ${this.widget.businessName}.</p>
          </div>
          <!-- Form will go here -->
        </div>
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html`<div class="loading-spinner">Loading...</div>`;
    }
    if (this.error) {
      return html`<div class="error-message">Error: ${this.error}</div>`;
    }
    if (!this.widget) {
      return html`<div class="error-message">Widget data not available.</div>`;
    }

    const {
      overallRating,
      totalReviews,
      ratingDistribution,
      reviewsBySource,
    } = this.overallStats;
    const reviews = this.sortedReviews;

    return html`
      <div class="p-4 sm:p-6 bg-background text-foreground font-body antialiased">
        <div class="max-w-4xl mx-auto">
          <header class="mb-6">
            <h1 class="text-3xl font-bold">${this.widget.businessName}</h1>
            <a
              href=${this.widget.website}
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              ${this.widget.website}
            </a>
          </header>

          ${totalReviews > 0
            ? html`
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div class="md:col-span-1 flex flex-col items-center justify-center text-center p-6 bg-card rounded-lg border">
                    <p class="text-5xl font-bold">${overallRating.toFixed(1)}</p>
                    ${this.renderStarRating(overallRating)}
                    <p class="text-muted-foreground mt-2">
                      Based on ${totalReviews} reviews
                    </p>
                  </div>
                  <div class="md:col-span-2 p-6 bg-card rounded-lg border">
                    <h2 class="font-semibold mb-3">Rating distribution</h2>
                    <div class="space-y-2">
                      ${ratingDistribution.map(
                        (count, i) => html`
                          <div class="flex items-center gap-2 text-sm">
                            <span class="text-muted-foreground w-6 text-right">${5 - i}</span>
                            <svg class="w-4 h-4 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                            <div class="progress-container w-full h-2">
                               <div class="progress-bar" style="width: ${
                                 (count / totalReviews) * 100
                               }%"></div>
                            </div>
                            <span class="text-muted-foreground w-8 text-right">${count}</span>
                          </div>
                        `
                      )}
                    </div>
                  </div>
                </div>

                ${Object.keys(reviewsBySource).length > 0
                  ? html`
                      <div class="mb-8">
                        <h2 class="text-xl font-bold mb-4 text-center">
                          Reviews from around the web
                        </h2>
                        <div class="flex flex-wrap justify-center gap-4">
                          ${Object.entries(reviewsBySource).map(
                            ([source, data]) => html`
                              <div
                                class="flex items-center gap-3 bg-card border rounded-lg px-4 py-2"
                              >
                                <span class="font-bold text-lg">${source}</span>
                                <div class="text-right">
                                  ${this.renderStarRating(
                                    data.totalStars / data.count,
                                    "w-4 h-4"
                                  )}
                                  <p class="text-xs text-muted-foreground">
                                    ${data.count} reviews
                                  </p>
                                </div>
                              </div>
                            `
                          )}
                        </div>
                      </div>
                    `
                  : ""}
              `
            : ""}

          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">
                ${totalReviews > 0
                  ? "What people are saying"
                  : "Be the first to leave a review"}
              </h2>
              <button class="button" @click=${() => this.showDialog = true}>Write a Review</button>
            </div>
            ${totalReviews > 0
              ? html`
                  <div class="carousel">
                      <div class="carousel-content">
                          ${reviews.map(
                            (review) => html`
                              <div class="carousel-item md:basis-1/2 lg:basis-1/3">
                                <div class="p-1 h-full">
                                  <div
                                    class="flex flex-col h-full bg-card rounded-lg border"
                                  >
                                    <div class="flex-1 p-6 space-y-4">
                                      <div class="flex items-center gap-3">
                                        <div class="avatar">
                                           <span class="avatar-fallback">${review.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                          <p class="font-semibold">${review.name}</p>
                                          <p class="text-xs text-muted-foreground">
                                            ${review.source} review
                                          </p>
                                        </div>
                                      </div>
                                      ${this.renderStarRating(review.stars)}
                                      <p class="text-sm text-foreground/80 pt-2">
                                        ${review.text}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            `
                          )}
                      </div>
                      <button class="carousel-previous" @click=${() => this.handleCarouselNav(-1)}>&#8249;</button>
                      <button class="carousel-next" @click=${() => this.handleCarouselNav(1)}>&#8250;</button>
                  </div>
                `
              : html`
                  <div
                    class="text-center py-20 border-2 border-dashed rounded-lg bg-card text-muted-foreground"
                  >
                    <svg class="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <h3 class="mt-2 text-lg font-semibold">No reviews yet</h3>
                    <p>Your widget is ready to collect feedback.</p>
                  </div>
                `}
          </div>

          <footer class="text-center mt-12">
            <p class="text-sm text-muted-foreground">
              Powered by Widget Wizard
            </p>
          </footer>
        </div>
        ${this.showDialog ? this.renderReviewForm() : ""}
      </div>
    `;
  }
}

customElements.define("review-widget", ReviewWidget);
