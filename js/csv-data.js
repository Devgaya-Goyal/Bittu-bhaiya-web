// IMMEDIATE WORKING SOLUTION - Your OneDrive CSV Data
// Copy your CSV content from OneDrive and paste it here to bypass CORS issues

const csvData = `Title,Location,Type,Salary,Description,Requirements,DatePosted
"Senior Software Developer","Bangalore, India","Full-time","₹12,00,000 - ₹18,00,000","We are seeking an experienced software developer to join our dynamic team. The ideal candidate will have 5+ years of experience in web development, proficiency in JavaScript, React, and Node.js.","5+ years web development experience;JavaScript, React, Node.js;Bachelor's degree in CS or related field","2024-08-14"
"Digital Marketing Specialist","Mumbai, India","Full-time","₹6,00,000 - ₹9,00,000","Join our marketing team as a Digital Marketing Specialist! You'll be responsible for developing and implementing digital marketing strategies, managing social media campaigns, and analyzing performance metrics.","2-4 years digital marketing experience;Social media management;Analytics tools proficiency","2024-08-13"
"Product Manager","Remote","Remote","₹15,00,000 - ₹22,00,000","We're looking for a strategic Product Manager to drive product vision and execution. You'll work closely with engineering, design, and marketing teams to deliver exceptional user experiences.","3+ years product management experience;Agile methodology knowledge;Strong analytical skills","2024-08-12"
"UX/UI Designer","Pune, India","Full-time","₹8,00,000 - ₹12,00,000","Creative UX/UI Designer wanted to create intuitive and visually appealing user interfaces. You'll be responsible for user research, wireframing, prototyping, and collaborating with development teams.","3+ years UX/UI design experience;Figma, Sketch proficiency;Strong portfolio","2024-08-11"
"Data Analyst","Hyderabad, India","Full-time","₹7,00,000 - ₹10,00,000","Join our analytics team as a Data Analyst! You'll be responsible for collecting, processing, and analyzing large datasets to provide actionable insights.","2+ years data analysis experience;SQL, Python proficiency;Data visualization skills","2024-08-10"`;

// Make it globally available
window.manualCSVData = csvData;

console.log('CSV data loaded successfully! Jobs will load from this data.');
