# Josef Berman - Data Science Portfolio

A modern, professional portfolio website for data scientists built with HTML, CSS, and JavaScript for GitHub Pages. Inspired by contemporary portfolio designs like jameskle.com.

![Portfolio Preview](img/preview.jpg)

## Features

- **Modern Grid-Based Layout**: Clean, responsive design with card-based project showcase
- **Dark Mode Design**: Professional dark blue theme with vibrant orange accents
- **Interactive Particles**: Dynamic particle animation that responds to mouse movement
- **Staggered Animations**: Subtle fade-in and movement effects as you scroll
- **Optimized Performance**: Fast loading times with efficient code structure
- **Mobile-First Approach**: Perfect experience on all devices
- **SEO Optimized**: Proper meta tags and semantic HTML for better discoverability

## Sections

- **Hero** - Eye-catching introduction with animated particle background
- **Projects** - Card-based showcase of research and portfolio projects
- **About** - Professional bio with your skills and background
- **Publications** - Academic publications and research papers
- **Blog** - Latest insights and articles
- **Contact** - Easy ways to get in touch
- **Newsletter** - Email subscription section

## Customization

### Basic Information

1. Update personal information in `index.html`:
   - Name, title, and bio in the relevant sections
   - Project details and descriptions
   - Publication information
   - Blog post contents
   - Contact details

2. Replace placeholder images in the `img` directory:
   - `profile-placeholder.jpg` - Your profile photo (circular crop recommended)
   - `project1.jpg`, `project2.jpg`, etc. - Project thumbnails
   - `blog1.jpg`, `blog2.jpg` - Blog post thumbnails
   - See `img/README.txt` for detailed image guidelines

### Colors and Styling

To modify the color scheme, edit the CSS variables in `css/style.css`:

```css
:root {
    /* Colors */
    --primary: #ff7043; /* Orange accent color */
    --primary-dark: #e64a19;
    --primary-light: #ffab91;
    --bg-dark: #0c1e2e; /* Dark blue background */
    --bg-darker: #071624;
    /* ... other variables */
}
```

### Layout and Grid

The site uses CSS Grid and Flexbox for modern, responsive layouts:

- Modify grid columns in the projects section:
```css
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--grid-gap);
}
```

- Adjust card sizes and spacing:
```css
.project-card {
    /* Card styling */
}
```

## Adding Content

### Projects

To add more projects, copy and paste this structure in the Projects section:

```html
<div class="project-card">
    <div class="project-image">
        <img src="img/project-name.jpg" alt="Project Name">
    </div>
    <div class="project-content">
        <h3>Project Title</h3>
        <p>
            Detailed project description that explains the work and technologies used.
        </p>
        <div class="project-links">
            <a href="https://github.com/username/repo" target="_blank"><i class="fab fa-github"></i> GitHub</a>
            <a href="#" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>
        </div>
    </div>
</div>
```

### Publications

Add publications with this structure:

```html
<div class="publication-item">
    <div class="publication-meta">
        <span class="publication-year">YYYY</span>
    </div>
    <div class="publication-content">
        <h3>Publication Title</h3>
        <p class="publication-authors">Author1, Author2, & Author3</p>
        <p class="publication-journal">Journal Name, Volume(Issue), Pages</p>
        <div class="publication-links">
            <a href="#" target="_blank"><i class="fas fa-external-link-alt"></i> Paper</a>
            <a href="#" target="_blank"><i class="fas fa-file-pdf"></i> PDF</a>
            <a href="#" target="_blank"><i class="fab fa-github"></i> Code</a>
        </div>
        <span class="doi">DOI: 10.1234/journal.2023.45.2.112</span>
    </div>
</div>
```

### Blog Posts

Add blog posts with this structure:

```html
<div class="blog-card">
    <div class="blog-image">
        <img src="img/blog-image.jpg" alt="Blog Post Title">
    </div>
    <div class="blog-content">
        <div class="blog-date">Month DD, YYYY</div>
        <h3>Blog Post Title</h3>
        <p>
            Blog post excerpt or summary that entices readers to click through.
        </p>
        <a href="blog/post-slug.html" class="read-more">Read Post <i class="fas fa-arrow-right"></i></a>
    </div>
</div>
```

## Deployment with GitHub Pages

1. Push your changes to your GitHub repository.

2. Go to your repository settings on GitHub.

3. Navigate to the "Pages" section under "Code and automation".

4. Select the "main" branch as the source and click "Save".

5. Your site will be published at `https://username.github.io`.

## Local Development

To run the website locally:

1. Clone the repository to your local machine.

2. Open the `index.html` file in your browser.

3. For live previewing changes, use a tool like Live Server in Visual Studio Code.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
