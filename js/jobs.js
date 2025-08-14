// Job management functionality - Vercel Compatible Version
class JobManager {
    constructor() {
        this.jobs = [];
        this.isLoading = false;
        this.jobApplicationFormUrl = 'https://forms.gle/UA4834R8C5tLg7Fk6';
        this.init();
    }

    init() {
        console.log('JobManager initialized - checking for CSV data...');
        
        // Load jobs from CSV
        this.loadJobsFromCSV();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Ensure jobs are loaded within a reasonable time
        setTimeout(() => {
            if (!this.jobs || this.jobs.length === 0) {
                console.log('No jobs loaded from CSV, loading sample jobs...');
                this.loadSampleJobs();
            }
        }, 5000); // 5 second timeout
    }

    setupEventListeners() {
        // Add refresh button if it exists
        const refreshBtn = document.getElementById('refresh-jobs');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshJobs());
        }

        // Add search functionality if search input exists
        const searchInput = document.getElementById('job-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.filterJobs(e.target.value);
            }, 300));
        }

        // Add filter functionality if filter selects exist
        const filterSelects = document.querySelectorAll('.job-filter');
        filterSelects.forEach(select => {
            select.addEventListener('change', () => this.applyFilters());
        });

        // Add keyboard navigation for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Close all open modals
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.remove());
        document.body.style.overflow = 'auto';
    }

    // Set the OneDrive CSV URL
    setCSVUrl(url) {
        this.csvUrl = url;
        this.loadJobsFromCSV();
    }

    // Load jobs from CSV data - Vercel Compatible
    async loadJobsFromCSV() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();
        
        // Clear existing jobs to prevent duplicates
        this.jobs = [];
        
        console.log('Loading jobs...');
        
        try {
            // Production Solution 1: Google Sheets (works on Vercel)
            const googleSheetsUrl = this.getGoogleSheetsUrl();
            if (googleSheetsUrl) {
                const success = await this.fetchFromGoogleSheets(googleSheetsUrl);
                if (success) return;
            }
            
            // Production Solution 2: CORS Proxy (backup method for Vercel)
            const corsProxyUrl = this.getCorsProxyUrl();
            if (corsProxyUrl) {
                const success = await this.fetchFromCorsProxy(corsProxyUrl);
                if (success) return;
            }
            
            // Fallback: Manual CSV data (for development/testing)
            if (window.manualCSVData) {
                console.log('Using manual CSV data as fallback...');
                this.jobs = this.parseCSV(window.manualCSVData);
                console.log(`Successfully loaded ${this.jobs.length} jobs from manual CSV`);
                this.renderJobs();
                this.saveJobs();
                return;
            }
            
            console.log('All methods failed - using sample jobs');
            this.loadSampleJobs();
        } catch (error) {
            console.error('Error loading jobs:', error);
            this.showErrorMessage('Failed to load jobs. Please try again later.');
            this.loadSampleJobs();
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    async fetchFromGoogleSheets(url) {
        try {
            console.log('Fetching jobs from Google Sheets...');
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/csv',
                },
                // Vercel compatible timeout
                signal: AbortSignal.timeout(10000)
            });
            
            if (response.ok) {
                const csvText = await response.text();
                this.jobs = this.parseCSV(csvText);
                console.log(`Successfully loaded ${this.jobs.length} jobs from Google Sheets`);
                this.renderJobs();
                this.saveJobs();
                return true;
            }
        } catch (error) {
            console.log('Google Sheets failed:', error);
        }
        return false;
    }

    async fetchFromCorsProxy(url) {
        try {
            console.log('Fetching jobs via CORS proxy...');
            const response = await fetch(url, {
                method: 'GET',
                // Vercel compatible timeout
                signal: AbortSignal.timeout(15000)
            });
            
            if (response.ok) {
                const data = await response.json();
                const csvText = data.contents; // allorigins.win wraps content in 'contents' field
                this.jobs = this.parseCSV(csvText);
                console.log(`Successfully loaded ${this.jobs.length} jobs via CORS proxy`);
                this.renderJobs();
                this.saveJobs();
                return true;
            }
        } catch (error) {
            console.log('CORS proxy failed:', error);
        }
        return false;
    }

    // Get Google Sheets CSV URL (Vercel compatible)
    getGoogleSheetsUrl() {
        const sheetId = '1CfjA9s-zos0o_b_Q5ANgkebM3Y13PQQFMG0Y6Co0Jg0';
        if (sheetId && sheetId !== 'YOUR_GOOGLE_SHEET_ID_HERE') {
            return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        }
        return null;
    }

    // Get CORS proxy URL (Vercel compatible backup)
    getCorsProxyUrl() {
        const oneDriveUrl = 'https://1drv.ms/x/c/abec93b3650694e9/EfgietaHgrxDqrLm3Ro_2jEBOC0-f3ObNbt8_3RYXEYxWg?e=ifYFS1';
        return `https://api.allorigins.win/get?url=${encodeURIComponent(oneDriveUrl)}`;
    }

    // Parse CSV data into job objects with better error handling
    parseCSV(csvText) {
        if (!csvText || typeof csvText !== 'string') {
            console.error('Invalid CSV data provided');
            return [];
        }

        try {
            const lines = csvText.trim().split('\n');
            if (lines.length < 2) {
                console.warn('CSV has insufficient data');
                return [];
            }

            // Get headers (first line)
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const jobs = [];
            const seenJobs = new Set(); // Track seen jobs to prevent duplicates

            // Process each data row
            for (let i = 1; i < lines.length; i++) {
                try {
                    const values = this.parseCSVLine(lines[i]);
                    if (values.length !== headers.length) {
                        console.warn(`Row ${i + 1} has ${values.length} values, expected ${headers.length}`);
                        continue;
                    }

                    const job = {};
                    headers.forEach((header, index) => {
                        job[header.toLowerCase()] = values[index];
                    });

                    // Convert to expected format with validation
                    const formattedJob = {
                        id: jobs.length + 1,
                        title: job.title || 'Untitled Position',
                        location: job.location || 'Location not specified',
                        type: job.type || 'Full-time',
                        salary: job.salary || 'Salary not specified',
                        description: job.description || 'No description available',
                        requirements: job.requirements ? job.requirements.split(';').map(r => r.trim()).filter(r => r) : [],
                        datePosted: job.dateposted || new Date().toISOString()
                    };

                    // Create a unique key for this job to prevent duplicates
                    const jobKey = `${formattedJob.title}-${formattedJob.location}-${formattedJob.type}`;
                    
                    // Validate job data before adding and check for duplicates
                    if (formattedJob.title && 
                        formattedJob.title !== 'Untitled Position' && 
                        !seenJobs.has(jobKey)) {
                        jobs.push(formattedJob);
                        seenJobs.add(jobKey);
                    }
                } catch (rowError) {
                    console.warn(`Error processing row ${i + 1}:`, rowError);
                    continue;
                }
            }

            console.log(`Successfully parsed ${jobs.length} unique jobs from CSV`);
            return jobs;
        } catch (error) {
            console.error('Error parsing CSV:', error);
            return [];
        }
    }

    // Parse a single CSV line handling quotes and commas with better error handling
    parseCSVLine(line) {
        if (!line || typeof line !== 'string') return [];
        
        const result = [];
        let current = '';
        let inQuotes = false;

        try {
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            
            result.push(current.trim());
            return result;
        } catch (error) {
            console.error('Error parsing CSV line:', error);
            return [line]; // Return the original line as a single value
        }
    }

    // Manual refresh method
    refreshJobs() {
        if (this.isLoading) return;
        
        console.log('Manually refreshing jobs...');
        this.loadJobsFromCSV();
    }

    // Filter jobs based on search term
    filterJobs(searchTerm) {
        if (!searchTerm) {
            this.renderJobs();
            return;
        }

        const filteredJobs = this.jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.type.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.renderJobs(filteredJobs);
    }

    // Apply filters from filter selects
    applyFilters() {
        const locationFilter = document.getElementById('location-filter')?.value;
        const typeFilter = document.getElementById('type-filter')?.value;

        let filteredJobs = this.jobs;

        if (locationFilter && locationFilter !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.location === locationFilter);
        }

        if (typeFilter && typeFilter !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.type === typeFilter);
        }

        this.renderJobs(filteredJobs);
    }

    // Show loading state
    showLoadingState() {
        const jobsGrid = document.getElementById('jobs-grid');
        if (jobsGrid) {
            jobsGrid.innerHTML = `
                <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div class="spinner" style="margin: 0 auto 1rem;"></div>
                    <p>Loading job opportunities...</p>
                </div>
            `;
        }
    }

    // Hide loading state
    hideLoadingState() {
        // Loading state will be replaced when renderJobs is called
    }

    // Show error message
    showErrorMessage(message) {
        const jobsGrid = document.getElementById('jobs-grid');
        if (jobsGrid) {
            jobsGrid.innerHTML = `
                <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #ef4444;">
                    <p>⚠️ ${message}</p>
                    <button onclick="jobManager.refreshJobs()" class="btn btn-primary" style="margin-top: 1rem;">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    // Load sample jobs for demo/fallback
    loadSampleJobs() {
        this.jobs = [
            {
                id: 1,
                title: "Senior Software Developer",
                location: "Bangalore, India",
                type: "Full-time",
                salary: "₹12,00,000 - ₹18,00,000",
                description: "We are seeking an experienced software developer to join our dynamic team. The ideal candidate will have 5+ years of experience in web development, proficiency in JavaScript, React, and Node.js. You'll work on cutting-edge projects and collaborate with cross-functional teams.",
                requirements: ["5+ years web development experience", "JavaScript, React, Node.js", "Bachelor's degree in CS or related field"],
                datePosted: new Date().toISOString()
            },
            {
                id: 2,
                title: "Digital Marketing Specialist",
                location: "Mumbai, India",
                type: "Full-time",
                salary: "₹6,00,000 - ₹9,00,000",
                description: "Join our marketing team as a Digital Marketing Specialist! You'll be responsible for developing and implementing digital marketing strategies, managing social media campaigns, and analyzing performance metrics. Perfect for someone with 2-4 years of marketing experience.",
                requirements: ["2-4 years digital marketing experience", "Social media management", "Analytics tools proficiency"],
                datePosted: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        this.saveJobs();
        this.renderJobs();
    }

    loadJobs() {
        try {
            const savedJobs = localStorage.getItem('hireassist_jobs');
            return savedJobs ? JSON.parse(savedJobs) : [];
        } catch (error) {
            console.error('Error loading jobs from localStorage:', error);
            return [];
        }
    }

    saveJobs() {
        try {
            localStorage.setItem('hireassist_jobs', JSON.stringify(this.jobs));
        } catch (error) {
            console.error('Error saving jobs to localStorage:', error);
        }
    }

    getJob(jobId) {
        return this.jobs.find(job => job.id === parseInt(jobId));
    }

    renderJobs(jobsToRender = null) {
        const jobsGrid = document.getElementById('jobs-grid');
        const jobs = jobsToRender || this.jobs;

        if (jobsGrid) {
            if (!jobs || jobs.length === 0) {
                jobsGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <h3>No job openings available</h3>
                        <p>Please check back later for new opportunities.</p>
                        <button onclick="jobManager.refreshJobs()" class="btn btn-primary" style="margin-top: 1rem;">
                            Refresh Jobs
                        </button>
                    </div>
                `;
            } else {
                jobsGrid.innerHTML = jobs.map(job => `
                    <div class="job-card" data-job-id="${job.id}">
                        <div class="job-header">
                            <h3 class="job-title">${this.escapeHtml(job.title)}</h3>
                            <div class="job-meta">
                                <span>📍 ${this.escapeHtml(job.location)}</span>
                                <span>💼 ${this.escapeHtml(job.type)}</span>
                                ${job.salary ? `<span>💰 ${this.escapeHtml(job.salary)}</span>` : ''}
                            </div>
                        </div>
                        <div class="job-description">
                            ${this.escapeHtml(this.truncateText(job.description, 150))}
                        </div>
                        <div class="job-actions">
                            <a href="${this.jobApplicationFormUrl}" target="_blank" rel="noopener" class="btn-apply">Apply Now</a>
                            <button onclick="jobManager.showJobDetails(${job.id})" class="btn btn-secondary btn-small">View Details</button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    truncateText(text, maxLength) {
        if (!text || typeof text !== 'string') return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    showJobDetails(jobId) {
        const job = this.getJob(jobId);
        if (!job) {
            console.error('Job not found:', jobId);
            return;
        }

        // Store current focus for accessibility
        const currentFocus = document.activeElement;
        if (currentFocus) {
            document.body.dataset.previousFocus = currentFocus.id || 'body';
        }

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${this.escapeHtml(job.title)}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="job-meta">
                        <span>📍 ${this.escapeHtml(job.location)}</span>
                        <span>💼 ${this.escapeHtml(job.type)}</span>
                        ${job.salary ? `<span>💰 ${this.escapeHtml(job.salary)}</span>` : ''}
                        <span>📅 ${this.formatDate(job.datePosted)}</span>
                    </div>
                    <div class="job-description">
                        <h3>Job Description</h3>
                        <p>${this.escapeHtml(job.description)}</p>
                    </div>
                    ${job.requirements && job.requirements.length > 0 ? `
                        <div class="job-requirements">
                            <h3>Requirements</h3>
                            <ul>
                                ${job.requirements.map(req => `<li>${this.escapeHtml(req)}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <a href="${this.jobApplicationFormUrl}" target="_blank" rel="noopener" class="btn-apply">Apply Now</a>
                    <button onclick="this.closest('.modal').remove()" class="btn btn-secondary">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Focus management
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Date not specified';
            }
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date not specified';
        }
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize job manager
const jobManager = new JobManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JobManager;
}
