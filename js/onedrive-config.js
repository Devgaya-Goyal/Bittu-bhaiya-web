// OneDrive CSV Configuration
// Instructions for setting up OneDrive CSV integration

class OneDriveConfig {
    constructor() {
        // This will be set once you provide your OneDrive CSV link
        this.csvUrl = '';
        
        // Expected CSV columns (case-insensitive)
        this.expectedColumns = [
            'Title',        // Job title
            'Location',     // Job location
            'Type',         // Full-time/Part-time/Remote
            'Salary',       // Salary range
            'Description',  // Job description
            'Requirements', // Semicolon-separated requirements
            'DatePosted'    // Date in YYYY-MM-DD format
        ];
    }

    // Set the OneDrive CSV URL
    setCsvUrl(url) {
        this.csvUrl = url;
        if (window.jobManager) {
            window.jobManager.setCSVUrl(url);
        }
        console.log('OneDrive CSV URL updated:', url);
    }

    // Get sample CSV format
    getSampleCSVFormat() {
        return `Title,Location,Type,Salary,Description,Requirements,DatePosted
"Senior Software Developer","San Francisco, CA","Full-time","$90,000 - $130,000","We are seeking an experienced software developer...","5+ years web development experience;JavaScript, React, Node.js;Bachelor's degree in CS","2024-08-14"
"Digital Marketing Specialist","New York, NY","Full-time","$55,000 - $75,000","Join our marketing team as a Digital Marketing Specialist...","2-4 years digital marketing experience;Social media management;Analytics tools proficiency","2024-08-13"`;
    }

    // Instructions for creating OneDrive CSV
    getInstructions() {
        return {
            step1: "Create a new Excel file in your OneDrive",
            step2: "Add the following columns: Title, Location, Type, Salary, Description, Requirements, DatePosted",
            step3: "Fill in your job data (use semicolons to separate multiple requirements)",
            step4: "Save the file as CSV format",
            step5: "Right-click the CSV file in OneDrive and select 'Share'",
            step6: "Set permissions to 'Anyone with the link can view'",
            step7: "Copy the sharing link",
            step8: "Convert the sharing link to direct download link (see convertShareLink method)",
            step9: "Use the converted link with setCsvUrl() method"
        };
    }

    // Convert OneDrive share link to direct download link
    convertShareLink(shareLink) {
        // OneDrive share links look like:
        // https://1drv.ms/x/s!ABC123.../filename.csv
        // We need to convert to direct download format:
        // https://api.onedrive.com/v1.0/shares/s!ABC123.../root/content
        
        if (shareLink.includes('1drv.ms')) {
            // Extract the share token from the URL
            const shareToken = shareLink.split('/').pop();
            return `https://api.onedrive.com/v1.0/shares/${shareToken}/root/content`;
        }
        
        // If it's already a direct link, return as is
        return shareLink;
    }
}

// Initialize OneDrive configuration
const oneDriveConfig = new OneDriveConfig();

// Make it globally available
window.oneDriveConfig = oneDriveConfig;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OneDriveConfig;
}
