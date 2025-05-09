# Josef Berman's Data Science Portfolio

A professional portfolio website built with HTML, CSS, and JavaScript for GitHub Pages.

## Features

- Modern, responsive design with dark blue theme and orange accents
- Interactive orange particle swarm animation
- Smooth scrolling and subtle animations
- Mobile-friendly layout
- SEO-optimized

## Sections

- **Home** - Introduction with interactive particle swarm animation
- **Projects** - Showcase of research and portfolio projects
- **About** - Professional bio and academic background
- **Publications** - Academic publications with citations
- **Blog** - Ready for future blog posts
- **Contact** - Contact information and links

## Customization

### Basic Information

1. Update personal information in `index.html`:
   - Name, title, and bio in the relevant sections
   - Project details
   - Publication information
   - Contact details

2. Replace placeholder images in the `img` directory:
   - `profile-placeholder.jpg` - Your profile photo
   - `project1.jpg`, `project2.jpg`, `project3.jpg` - Project thumbnails
   - `blog1.jpg` - Blog post thumbnail
   - You can also replace `favicon.svg` with your own favicon

### Colors and Styling

To modify the color scheme, edit the CSS variables in `css/style.css`:

```css
:root {
    /* Colors */
    --primary: #ff7043; /* Orange accent color */
    --primary-dark: #e64a19;
    --primary-light: #ffab91;
    --bg-dark: #0c1e2e; /* Dark blue background */
    /* ... other variables */
}
```

### Adding More Content

#### Projects

To add more projects, copy and paste the project card structure in the Projects section:

```html
<div class="project-card">
    <div class="project-image">
        <img src="img/project-name.jpg" alt="Project Name">
    </div>
    <div class="project-content">
        <h3>Project Title</h3>
        <p>Project description goes here...</p>
        <div class="project-links">
            <a href="https://github.com/username/repo" target="_blank">
                <i class="fab fa-github"></i> GitHub
            </a>
            <a href="#" target="_blank">
                <i class="fas fa-external-link-alt"></i> Demo
            </a>
        </div>
    </div>
</div>
```

#### Publications

To add more publications, follow this structure:

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
            <a href="#" target="_blank"><i class="fas fa-external-link-alt"></i> View Paper</a>
            <a href="#" target="_blank"><i class="fas fa-file-pdf"></i> PDF</a>
            <a href="#" target="_blank"><i class="fas fa-code"></i> Code</a>
            <span class="doi">DOI: 10.1234/journal.2023.45.2.112</span>
        </div>
    </div>
</div>
```

#### Blog Posts

To add blog posts, duplicate the blog card structure:

```html
<div class="blog-card">
    <div class="blog-image">
        <img src="img/blog-image.jpg" alt="Blog Post Title">
    </div>
    <div class="blog-content">
        <div class="blog-date">Month DD, YYYY</div>
        <h3>Blog Post Title</h3>
        <p>Blog post excerpt goes here...</p>
        <a href="blog/post-slug.html" class="read-more">Read Post <i class="fas fa-arrow-right"></i></a>
    </div>
</div>
```

## Deployment with GitHub Pages

1. Push your changes to your GitHub repository.

2. Go to your repository settings on GitHub.

3. Scroll down to the "GitHub Pages" section.

4. Select the "main" branch as the source and click "Save".

5. Your site will be published at `https://username.github.io`.

## Local Development

To run the website locally:

1. Clone the repository to your local machine.

2. Open the `index.html` file in your browser.

3. For live previewing changes, you can use the Live Server extension for Visual Studio Code or a similar tool.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
