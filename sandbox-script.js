// Get DOM elements for the sandbox (only if they exist on the page)
const htmlEditor = document.getElementById('code-editor');
const livePreview = document.getElementById('live-preview');
const codeTabs = document.querySelectorAll('.code-tab');
const codeLibraryContent = document.getElementById('code-library-content');

// Global state for sandbox
let activeEditorLang = 'html'; // Tracks the currently active language editor (html, css, js)
let activeTabType = 'editor'; // Tracks the type of active tab ('editor' or 'library')

// Store code for each language. Initialize CSS and JS as empty by default.
let htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Sandbox Page</title>
    <style>
        /* Your CSS will be injected here. */
        body { font-family: 'Inter', sans-serif; margin: 20px; background-color: #f0f0f0; color: #333; }
        .container { max-width: 800px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        h1 { color: #007bff; text-align: center; }
        button { background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; }
        button:hover { background-color: #218838; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to UltraWeb Sandbox!</h1>
        <p>Start typing HTML, CSS, or JavaScript code above to see instant results here.</p>
        <button id="myButton">Click Me</button>
    </div>

    <script>
        /* Your JavaScript will be injected here. */
        const myButton = document.getElementById('myButton');
        if (myButton) {
            myButton.addEventListener('click', () => {
                const paragraph = document.querySelector('.container p');
                if (paragraph) {
                    paragraph.textContent = 'Button was clicked! JS is working.';
                }
            });
        }
    </script>
</body>
</html>`;
let cssCode = `/* Type your CSS code here. It will automatically apply to your HTML. */

body {
    background-color: #e6e6fa; /* Light lavender background */
    color: #333;
}

.container {
    border: 2px solid #5d3fd3; /* Purple border */
    background-color: #f8f8ff; /* Ghost white background */
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

h1 {
    color: #5d3fd3; /* Matching purple for heading */
}

button {
    background-color: #ff9933; /* Orange button */
    box-shadow: 0 4px 8px rgba(255,153,51,0.4);
}

button:hover {
    background-color: #e68a00; /* Darker orange on hover */
    transform: translateY(-3px);
}
`;
let jsCode = `// Type your JavaScript code here to add interactivity.

// Example: Change button text on click and then disable it
const myButton = document.getElementById('myButton');

if (myButton) {
    myButton.addEventListener('click', () => {
        myButton.textContent = 'Clicked!';
        myButton.disabled = true; // Disable the button after click
        myButton.style.opacity = '0.7';
        myButton.style.cursor = 'not-allowed';
    });
}

// Example: Log mouse coordinates when clicking anywhere on the document
document.addEventListener('click', (event) => {
    console.log(\`Mouse clicked at X: \${event.clientX}, Y: \${event.clientY}\`);
});
`;

// --- Code Library Snippets ---
// This object holds all the code snippets categorized by language.
// The 'title' will be displayed, and 'code' is the actual snippet.
const codeLibrary = {
    html: [
        {
            title: "HTML Boilerplate",
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My New Page</title>
</head>
<body>
    <header>
        <h1>My Website</h1>
    </header>
    <main>
        <section>
            <h2>Welcome!</h2>
            <p>This is a starting point for your web project.</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2025</p>
    </footer>
</body>
</html>`
        },
        {
            title: "Basic Image Tag",
            code: `<img src="https://placehold.co/400x250?text=Your+Image" alt="A descriptive image text for accessibility" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">`
        },
        {
            title: "Hyperlink Button",
            code: `<a href="https://www.example.com" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Example</a>`
        },
        {
            title: "Unordered List",
            code: `<ul>
    <li>List Item 1</li>
    <li>List Item 2</li>
    <li>List Item 3</li>
</ul>`
        },
        {
            title: "HTML Form (Simple)",
            code: `<form action="/submit-form" method="POST">
    <label for="name">Name:</label><br>
    <input type="text" id="name" name="name" required><br><br>

    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" required><br><br>

    <label for="message">Message:</label><br>
    <textarea id="message" name="message" rows="4"></textarea><br><br>

    <button type="submit">Send Message</button>
</form>`
        },
        {
            title: "Table Structure",
            code: `<table>
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
        <tr>
            <td>Data 3</td>
            <td>Data 4</td>
        </tr>
    </tbody>
</table>`
        },
        {
            title: "Video Embed",
            code: `<video controls width="320" height="240">
    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>`
        }
    ],
    css: [
        {
            title: "Center a Div (Flexbox)",
            code: `.container {
    display: flex;
    justify-content: center; /* Centers horizontally */
    align-items: center;   /* Centers vertically */
    height: 300px; /* Required height for vertical centering */
    border: 2px dashed #ccc;
    background-color: #f9f9f9;
}
.centered-item {
    padding: 20px;
    background-color: #007bff;
    color: white;
    border-radius: 8px;
}`
        },
        {
            title: "Responsive Image",
            code: `img.responsive {
    max-width: 100%; /* Image will scale down to fit container */
    height: auto;    /* Maintains aspect ratio */
    display: block;  /* Removes extra space below image */
}`
        },
        {
            title: "Basic Button Style",
            code: `button {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
}
button:hover {
    background-color: #218838;
}`
        },
        {
            title: "CSS Grid Layout (2 Columns)",
            code: `.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two equal columns */
    gap: 20px; /* Space between grid items */
    padding: 20px;
    background-color: #eee;
}
.grid-item {
    background-color: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}`
        },
        {
            title: "Hover Effect (Grow & Shadow)",
            code: `.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background-color: white;
    padding: 20px;
    border-radius: 10px;
}
.card:hover {
    transform: translateY(-5px) scale(1.02); /* Lifts and slightly grows */
    box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Stronger shadow */
}`
        },
        {
            title: "Sticky Navbar",
            code: `header {
    position: sticky;
    top: 0;
    z-index: 1000; /* Ensures it stays on top */
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    padding: 15px 0;
}`
        },
        {
            title: "Custom Scrollbar (WebKit)",
            code: `/* For WebKit browsers (Chrome, Safari) */
::-webkit-scrollbar {
    width: 10px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: #555;
}`
        },
        {
            title: "CSS Transition Example",
            code: `/* HTML for context */
/* <button class="animated-btn">Hover Me</button> */

/* CSS */
.animated-btn {
    background-color: #3498db;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.4s ease-in-out, transform 0.2s ease-out; /* Apply transition */
}
.animated-btn:hover {
    background-color: #2ecc71; /* New background color on hover */
    transform: translateY(-5px) scale(1.05); /* Lift and grow slightly */
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
}`
        },
        {
            title: "CSS Animation Example",
            code: `/* HTML for context */
/* <div class="bouncing-ball"></div> */

/* CSS */
.bouncing-ball {
    width: 50px;
    height: 50px;
    background-color: #e74c3c; /* Red ball */
    border-radius: 50%;
    position: relative;
    animation-name: bounce; /* Name of the animation */
    animation-duration: 2s; /* 2 seconds per cycle */
    animation-timing-function: ease-in-out; /* Smooth start/end */
    animation-iteration-count: infinite; /* Loop forever */
    animation-direction: alternate; /* Play forwards then backwards */
}

@keyframes bounce {
    0% { transform: translateY(0); } /* Start at original position */
    50% { transform: translateY(-100px); } /* Bounce up */
    100% { transform: translateY(0); } /* Come back down */
}`
        }
    ],
    js: [
        {
            title: "Simple Alert Button",
            code: `// HTML: <button id="alertBtn">Show Alert</button>
document.getElementById('alertBtn').addEventListener('click', function() {
    // In a real application, replace 'alert' with a custom modal or message display.
    alert('Hello from JavaScript!');
});`
        },
        {
            title: "Change Element Text",
            code: `// HTML: <p id="myText">Initial Text</p>
const myTextElement = document.getElementById('myText');
if (myTextElement) {
    myTextElement.textContent = "Text changed by JavaScript!";
    myTextElement.style.color = "blue";
}`
        },
        {
            title: "Toggle Class on Click",
            code: `// HTML: <div id="myDiv" class="toggle-bg">Click me to change color</div>
// CSS: .toggle-bg { background-color: red; } .toggle-bg.active { background-color: blue; }
document.getElementById('myDiv').addEventListener('click', function() {
    this.classList.toggle('active');
});`
        },
        {
            title: "Basic Counter",
            code: `// HTML: <span id="countDisplay">0</span> <button id="incrementBtn">Increment</button>
let count = 0;
const countDisplay = document.getElementById('countDisplay');
const incrementBtn = document.getElementById('incrementBtn');

if (incrementBtn && countDisplay) {
    incrementBtn.addEventListener('click', function() {
        count++;
        countDisplay.textContent = count;
    });
}`
        },
        {
            title: "Form Input Value",
            code: `// HTML: <input type="text" id="nameInput" placeholder="Enter name"> <button id="submitName">Submit</button> <p id="outputName"></p>
document.getElementById('submitName').addEventListener('click', function() {
    const name = document.getElementById('nameInput').value;
    document.getElementById('outputName').textContent = 'Hello, ' + name + '!';
});`
        },
        {
            title: "Simple Image Slider",
            code: `// HTML: <div id="slider-container" style="text-align:center; margin-top:20px;"><img id="slider-img" src="https://placehold.co/400x200?text=Image+1" alt="Slider Image" style="max-width:100%; height:auto; display:block; margin:0 auto;"><button id="next-img" style="margin-top:10px;">Next Image</button></div>
const images = [
    "https://placehold.co/400x200?text=Image+1",
    "https://placehold.co/400x200/FF0000/FFFFFF?text=Image+2",
    "https://placehold.co/400x200/00FF00/000000?text=Image+3"
];
let currentImageIndex = 0;
const sliderImg = document.getElementById('slider-img');
const nextBtn = document.getElementById('next-img');

if (sliderImg && nextBtn) {
    sliderImg.src = images[currentImageIndex]; // Set initial image

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        sliderImg.src = images[currentImageIndex];
    });
}`
        },
        {
            title: "Accordion / Expand-Collapse",
            code: `// HTML:
// <div class="accordion-item" style="border:1px solid #ccc; margin-bottom:10px; border-radius:5px;">
//   <h3 class="accordion-header" style="background-color:#f0f0f0; padding:10px; cursor:pointer;">Title 1</h3>
//   <div class="accordion-content" style="padding:10px; display:none;"><p>Content for section 1.</p></div>
// </div>
// <div class="accordion-item" style="border:1px solid #ccc; margin-bottom:10px; border-radius:5px;">
//   <h3 class="accordion-header" style="background-color:#f0f0f0; padding:10px; cursor:pointer;">Title 2</h3>
//   <div class="accordion-content" style="padding:10px; display:none;"><p>Content for section 2.</p></div>
// </div>
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling; // Get the content div
        // Toggle the display style of the content div
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    });
});`
        },
        {
            title: "Fetch Data from API",
            code: `// HTML: <div id="data-output" style="border: 1px solid #ddd; padding: 15px; margin-top: 20px; border-radius: 8px;">Loading data...</div>
async function fetchRandomUser() {
    const outputDiv = document.getElementById('data-output');
    outputDiv.textContent = 'Fetching new user data...';

    try {
        const response = await fetch('https://randomuser.me/api/');
        if (!response.ok) {
            throw new Error(\`HTTP error! Status: \${response.status}\`);
        }
        const data = await response.json();
        const user = data.results[0];
        const fullName = \`\${user.name.first} \${user.name.last}\`;
        const email = user.email;
        const location = \`\${user.location.city}, \${user.location.country}\`;

        outputDiv.innerHTML = \`
            <h4>Random User Profile:</h4>
            <p><strong>Name:</strong> \${fullName}</p>
            <p><strong>Email:</strong> \${email}</p>
            <p><strong>Location:</strong> \${location}</p>
            <img src="\${user.picture.medium}" alt="User Profile Picture" style="border-radius: 50%; width: 80px; height: 80px; margin-top: 10px;">
        \`;
    } catch (error) {
        console.error('Error fetching data:', error);
        outputDiv.textContent = \`Failed to load data: \${error.message}\`;
        outputDiv.style.color = 'red';
    }
}
fetchRandomUser(); // Call on load, or add a button to trigger`
        }
    ]
};

// --- Core Sandbox Functions ---

/**
 * Updates the content of the live preview iframe by combining current HTML, CSS, and JS.
 */
function updatePreview() {
    const combinedCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Live Preview</title>
            <style>${cssCode}</style>
        </head>
        <body>
            ${htmlCode}
            <script>${jsCode}<\/script>
        </body>
        </html>
    `;
    // Set the srcdoc attribute of the iframe. This reloads the iframe content.
    if (livePreview) { // Check if livePreview element exists before setting srcdoc
        livePreview.srcdoc = combinedCode;
    }
}

/**
 * Switches the content of the code editor or displays the code library.
 * Also updates the active tab's styling and controls visibility of editor/library.
 * @param {string} type - The type of tab to switch to ('html', 'css', 'js', or 'library').
 * @param {string} [codeToLoad=''] - Optional: specific code string to load into the editor.
 */
function switchTab(type, codeToLoad = '') {
    if (!htmlEditor || !codeLibraryContent || !codeTabs) return; // Exit if sandbox elements aren't present

    // 1. Save current editor content if it's an editor tab and visible
    if (activeTabType === 'editor' && htmlEditor.style.display !== 'none') {
        if (activeEditorLang === 'html') {
            htmlCode = htmlEditor.value;
        } else if (activeEditorLang === 'css') {
            cssCode = htmlEditor.value;
        } else if (activeEditorLang === 'js') {
            jsCode = htmlEditor.value;
        }
    }

    // 2. Hide/Show editor and library content based on the new tab type
    if (type === 'library') {
        htmlEditor.style.display = 'none';
        codeLibraryContent.style.display = 'block';
        activeTabType = 'library';
    } else {
        htmlEditor.style.display = 'block';
        codeLibraryContent.style.display = 'none';
        activeTabType = 'editor';
        activeEditorLang = type; // Update active editor language

        // 3. Load content into the editor (either from storage or a provided snippet)
        if (codeToLoad) { // If a specific code snippet was passed (from "Try in Sandbox" button)
            htmlEditor.value = codeToLoad;
        } else { // Otherwise, load the code currently stored for that language, or default empty
            if (type === 'html') {
                htmlEditor.value = htmlCode;
            } else if (type === 'css') {
                htmlEditor.value = cssCode;
            } else if (type === 'js') {
                htmlEditor.value = jsCode;
            }
        }
    }

    // 4. Update active tab styling
    codeTabs.forEach(tab => {
        if (tab.dataset.lang === type) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // 5. Update preview (only if switching to an editor tab or if new code was loaded)
    if (activeTabType === 'editor' || codeToLoad) {
        updatePreview();
    }
}

/**
 * Generates and injects the Code Library content into the DOM.
 */
function generateCodeLibrary() {
    if (!codeLibraryContent) return; // Exit if codeLibraryContent element isn't present

    codeLibraryContent.innerHTML = `
        <p style="font-size: 1.1em; margin-bottom: 25px; color: #ccc;">
            Explore ready-to-use code snippets. Click a title to view the code, then click 'Copy' to paste it into your editor.
            Expand your projects faster!
        </p>
    `; // Clear previous content and add intro text

    for (const lang in codeLibrary) {
        const category = document.createElement('div');
        category.classList.add('library-category');
        category.innerHTML = `<h4>${lang.toUpperCase()} Snippets</h4>`;

        codeLibrary[lang].forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('library-item');
            itemDiv.innerHTML = `
                <div class="library-item-title">${item.title}</div>
                <div class="library-item-code">
                    <button class="copy-code-btn">Copy</button>
                    <span class="copy-message">Copied!</span>
                    <pre><code>${item.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>
            `;
            // Event listener to toggle code visibility
            itemDiv.querySelector('.library-item-title').addEventListener('click', function() {
                this.nextElementSibling.classList.toggle('show');
            });

            // Event listener to copy code to clipboard
            itemDiv.querySelector('.copy-code-btn').addEventListener('click', function() {
                // Select the code from the <pre><code> block
                const codeToCopy = this.closest('.library-item-code').querySelector('code').textContent;

                // Use document.execCommand('copy') as navigator.clipboard.writeText may not work in iframes
                const textArea = document.createElement('textarea');
                textArea.value = codeToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    const messageSpan = this.nextElementSibling; // Get the copy message span
                    messageSpan.style.opacity = 1;
                    setTimeout(() => messageSpan.style.opacity = 0, 1500); // Fade out after 1.5s
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
                document.body.removeChild(textArea);
            });

            category.appendChild(itemDiv);
        });
        codeLibraryContent.appendChild(category);
    }
}


// --- Carousel Logic for index.html ---

// Testimonial Carousel
let currentTestimonialSlide = 0;
let testimonialSlideInterval;
const testimonialTrack = document.getElementById('testimonial-carousel-track');
const testimonialDotsContainer = document.getElementById('testimonial-dots');
let testimonialSlides; // Will be set after DOMContentLoaded

function showTestimonialSlide(index) {
    if (!testimonialTrack || !testimonialSlides || testimonialSlides.length === 0) return;

    // Ensure index wraps around
    currentTestimonialSlide = (index + testimonialSlides.length) % testimonialSlides.length;

    const offset = -currentTestimonialSlide * 100;
    testimonialTrack.style.transform = `translateX(${offset}%)`;

    // Update dots
    const dots = testimonialDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if (i === currentTestimonialSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextTestimonialSlide() {
    showTestimonialSlide(currentTestimonialSlide + 1);
}

function startTestimonialCarousel() {
    // Clear any existing interval to prevent duplicates
    if (testimonialSlideInterval) clearInterval(testimonialSlideInterval);
    testimonialSlideInterval = setInterval(nextTestimonialSlide, 7000); // Change slide every 7 seconds
}

function resetTestimonialCarousel() {
    startTestimonialCarousel(); // Restart timer after manual selection
}


// How It Works Image Gallery Carousel
let currentImageSlide = 0;
let imageSlideInterval;
const imageCarouselTrack = document.getElementById('how-it-works-carousel-track');
const imageCarouselDotsContainer = document.getElementById('how-it-works-carousel-dots');
let imageSlides; // Will be set after DOMContentLoaded

function showImageSlide(index) {
    if (!imageCarouselTrack || !imageSlides || imageSlides.length === 0) return;

    // Ensure index wraps around
    currentImageSlide = (index + imageSlides.length) % imageSlides.length;

    const offset = -currentImageSlide * 100;
    imageCarouselTrack.style.transform = `translateX(${offset}%)`;

    // Update dots
    const dots = imageCarouselDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if (i === currentImageSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextImageSlide() {
    showImageSlide(currentImageSlide + 1);
}

function startImageCarousel() {
    // Clear any existing interval to prevent duplicates
    if (imageSlideInterval) clearInterval(imageSlideInterval);
    imageSlideInterval = setInterval(nextImageSlide, 5000); // Change image every 5 seconds
}

function resetImageCarousel() {
    startImageCarousel(); // Restart timer after manual selection
}


// --- Event Listeners and Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {

    // Initialize carousels ONLY IF elements exist (i.e., on index.html)
    // Testimonial Carousel Setup
    testimonialSlides = document.querySelectorAll('.testimonial-carousel-track .testimonial-slide');
    if (testimonialTrack && testimonialSlides && testimonialSlides.length > 0) {
        showTestimonialSlide(0); // Show first slide initially
        startTestimonialCarousel();

        testimonialDotsContainer.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.slide);
                showTestimonialSlide(slideIndex);
                resetTestimonialCarousel();
            });
        });
    }

    // How It Works Image Gallery Carousel Setup
    imageSlides = document.querySelectorAll('.image-gallery-carousel .carousel-image');
    if (imageCarouselTrack && imageSlides && imageSlides.length > 0) {
        showImageSlide(0); // Show first image initially
        startImageCarousel();

        imageCarouselDotsContainer.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.slide);
                showImageSlide(slideIndex);
                resetImageCarousel();
            });
        });
    }

    // Sandbox Initialization (only if sandbox elements exist)
    if (htmlEditor && livePreview && codeTabs && codeLibraryContent) {
        // Generate the code library content once on DOM load
        generateCodeLibrary();

        // Check for URL parameters for "Try in Sandbox" links
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang'); // e.g., 'html', 'css', 'js'
        const snippetNameParam = urlParams.get('snippet'); // e.g., 'html-boilerplate'

        if (langParam && snippetNameParam) {
            let codeToLoad = '';
            const snippetCategory = codeLibrary[langParam];

            if (snippetCategory) {
                // Find the snippet by matching its title, normalized to hyphen-case
                // Make sure the snippet titles in lesson pages (html-basics.html, etc.) match
                // the 'title' property in codeLibrary for consistent loading.
                const foundSnippet = snippetCategory.find(s =>
                    s.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === snippetNameParam.toLowerCase() ||
                    s.title.toLowerCase().includes(snippetNameParam.toLowerCase().replace(/-/g, ' ')) // More flexible matching
                );

                if (foundSnippet) {
                    codeToLoad = foundSnippet.code;
                }
            }

            if (codeToLoad) {
                switchTab(langParam, codeToLoad);
            } else {
                console.warn(`Could not find snippet "${snippetNameParam}" for language "${langParam}". Loading default HTML.`);
                // Fallback: load default HTML if snippet not found
                switchTab('html');
            }
        } else {
            // If no URL parameters, load default HTML code into the editor
            switchTab('html');
        }

        // Event Listener for Editor Tabs (HTML, CSS, JS, Library)
        codeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const lang = tab.dataset.lang;
                // When a tab is clicked, no snippet is passed, so we load from stored code
                // Also, ensure CSS and JS editors are empty if they weren't explicitly loaded from a snippet
                let defaultContent = '';
                if (lang === 'html') defaultContent = htmlCode;
                else if (lang === 'css') defaultContent = cssCode; // Should be empty by default now
                else if (lang === 'js') defaultContent = jsCode;   // Should be empty by default now
                switchTab(lang, defaultContent);
            });
        });

        // Event Listener for typing in the editor (only if editor is active)
        htmlEditor.addEventListener('input', () => {
            // Only save and update if the active tab is an editor, not the library
            if (activeTabType === 'editor') {
                if (activeEditorLang === 'html') {
                    htmlCode = htmlEditor.value;
                } else if (activeEditorLang === 'css') {
                    cssCode = htmlEditor.value;
                } else if (activeEditorLang === 'js') {
                    jsCode = htmlEditor.value;
                }
                updatePreview(); // Re-render the iframe with updated code
            }
        });
    }

    /* --- General Page-wide JavaScript (from previous scripts - simplified for this project) --- */

    // Smooth Scrolling for Navigation (simplified for all pages)
    document.querySelectorAll('.main-nav a[href^="#"], .main-nav a[href$="#community"], .main-nav a[href$="#build-service"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const currentPath = window.location.pathname.split('/').pop();
            const targetHref = this.getAttribute('href');
            const targetPath = targetHref.split('#')[0].split('/').pop(); // Get filename only
            const targetId = targetHref.split('#')[1];

            // Check if the link is an internal anchor on the current page,
            // or an anchor to another page's section (like tools-page.html#community)
            if (targetId && (currentPath === targetPath || (currentPath === '' && targetPath === 'index.html') || (currentPath === 'index.html' && targetPath === ''))) {
                e.preventDefault();
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Update URL hash without causing a full page reload or scroll to top for new hashes
                    history.pushState(null, null, '#' + targetId);
                }
            } else if (targetPath && targetId && currentPath !== targetPath) {
                // This handles cross-page anchors like "tools-page.html#community"
                // Prevent default navigation to allow manual control
                e.preventDefault();
                // Store the hash in sessionStorage before navigating
                sessionStorage.setItem('scrollToHash', targetId);
                // Perform the navigation
                window.location.href = targetHref;
            }
            // If it's a simple link to another HTML file (e.g., index.html -> tools-page.html without hash),
            // let the default browser behavior handle the navigation directly.
        });
    });

    // Handle cross-page anchor scrolling after navigation
    const scrollToHash = sessionStorage.getItem('scrollToHash');
    if (scrollToHash) {
        sessionStorage.removeItem('scrollToHash');
        const targetElement = document.getElementById(scrollToHash);
        if (targetElement) {
            // Use setTimeout to ensure DOM is fully rendered before scrolling
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 100); // Small delay
        }
    }


    // Implementing basic scroll reveal for content sections using the 'fade-in-up' class
    const contentSectionsToAnimate = document.querySelectorAll('.lesson-block, .lesson-navigation, .feature-card, .path-card, .tool-feature-card, .practice-item, .community-section, .step-card, .how-it-works-section .image-gallery-carousel, .tool-preview-area, .premium-feature-card, .pricing-card, .help-category, .known-issues-section');

    function checkRevealOnScroll() {
        contentSectionsToAnimate.forEach(el => {
            // Get the top position of the element relative to the viewport
            const elementTop = el.getBoundingClientRect().top;
            // Get the height of the browser window
            const windowHeight = window.innerHeight;

            // If the element is within 85% of the viewport from the top, add the animation class
            if (elementTop < windowHeight * 0.85) {
                el.classList.add('fade-in-up');
            }
        });
    }

    // Attach listeners for scroll and initial load to trigger animations
    window.addEventListener('scroll', checkRevealOnScroll);
    window.addEventListener('resize', checkRevealOnScroll); // Also check on resize
    // Initial check when DOM is ready - already done by DOMContentLoaded event
    checkRevealOnScroll();


    // Help Page Accordion Logic (centralized here)
    if (window.location.pathname.includes('help.html')) {
        document.querySelectorAll('.help-item h4').forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('.toggle-icon');

                // Toggle visibility of the content
                if (content.classList.contains('show')) {
                    content.classList.remove('show');
                    icon.classList.remove('rotated');
                } else {
                    // Close other open accordions if desired (optional)
                    // document.querySelectorAll('.help-item p.show').forEach(openContent => {
                    //     openContent.classList.remove('show');
                    //     openContent.previousElementSibling.querySelector('.toggle-icon').classList.remove('rotated');
                    // });
                    content.classList.add('show');
                    icon.classList.add('rotated');
                }
            });
        });
    }
});
