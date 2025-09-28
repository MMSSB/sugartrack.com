
// // doctors.js - Search and filter functionality for doctors directory

// // Sample doctors data - you can expand this with more doctors
// const doctorsData = [
//     {
//         id: 1,
//         name: "Dr. Ahmed Mohamed",
//         specialty: "Endocrinologist",
//         country: "Egypt",
//         flag: "images/egy.png",
//         website: "https://www.vezeeta.com/en/doctor/diabetes-and-endocrinology/",
//         image: "images/doctors/veseeta.jpeg",
//         description: "Specialized in diabetes management and endocrine disorders."
//     },
//     {
//         id: 2,
//         name: "Dr. Sarah Johnson",
//         specialty: "Diabetes Specialist",
//         country: "Saudi Arabia",
//         flag: "images/sa.png",
//         website: "https://www.vezeeta.com/en/doctor/diabetes-and-endocrinology/",
//         image: "images/doctors/veseeta.jpeg",
//         description: "Expert in type 1 and type 2 diabetes treatment."
//     },
//     {
//         id: 3,
//         name: "Dr. Hassan Ali",
//         specialty: "Endocrinologist",
//         country: "Lebanon",
//         flag: "images/Lebanon.jpeg",
//         website: "https://www.vezeeta.com/en/doctor/diabetes-and-endocrinology/",
//         image: "images/doctors/veseeta.jpeg",
//         description: "Specialized in pediatric endocrinology and diabetes."
//     },
//     {
//         id: 4,
//         name: "Dr. Omar Khalid",
//         specialty: "Diabetes Educator",
//         country: "Jordan",
//         flag: "images/Jordan.png",
//         website: "https://www.vezeeta.com/en/doctor/diabetes-and-endocrinology/",
//         image: "images/doctors/veseeta.jpeg",
//         description: "Focuses on patient education and lifestyle management."
//     },
//     {
//         id: 5,
//         name: "Dr. Fatima Abubakar",
//         specialty: "Endocrinologist",
//         country: "Nigeria",
//         flag: "images/Nigeria.png",
//         website: "https://www.vezeeta.com/en/doctor/diabetes-and-endocrinology/",
//         image: "images/doctors/veseeta.jpeg",
//         description: "Specialized in diabetes complications management."
//     },
//     {
//         id: 6,
//         name: "Dr. James Mwangi",
//         specialty: "Diabetes Specialist",
//         country: "Kenya",
//         flag: "images/Kenya.png",
//         website: "https://www.vezeeta.com/en/doctor/diabetes-and-endocrinology/",
//         image: "images/doctors/veseeta.jpeg",
//         description: "Expert in insulin therapy and continuous glucose monitoring."
//     },
//     {
//         id: 7,
//         name: "Dr. Pierre Dubois",
//         specialty: "Endocrinologist",
//         country: "France",
//         flag: "images/france.png",
//         website: "https://www.doctolib.fr/",
//         image: "images/doctors/Doctolib.png",
//         description: "Specialized in diabetes research and innovative treatments."
//     },
//     {
//         id: 8,
//         name: "Dr. Elena Rodriguez",
//         specialty: "Diabetes Educator",
//         country: "Spain",
//         flag: "images/spain.png",
//         website: "https://clinido.com/en/online_search/Diabetes-and-Endocrinology",
//         image: "images/doctors/cliniDo.svg",
//         description: "Focuses on nutritional therapy for diabetes patients."
//     }
// ];

// // Available countries with flag images
// const countries = [
//     { code: "all", name: "All Countries", flag: "images/globe.png" },
//     { code: "egypt", name: "Egypt", flag: "images/egy.png" },
//     { code: "saudi", name: "Saudi Arabia", flag: "images/sa.png" },
//     { code: "lebanon", name: "Lebanon", flag: "images/Lebanon.jpeg" },
//     { code: "jordan", name: "Jordan", flag: "images/Jordan.png" },
//     { code: "nigeria", name: "Nigeria", flag: "images/Nigeria.png" },
//     { code: "kenya", name: "Kenya", flag: "images/Kenya.png" },
//     { code: "france", name: "France", flag: "images/france.png" },
//     { code: "spain", name: "Spain", flag: "images/spain.png" }
// ];

// // Initialize the doctors directory
// document.addEventListener('DOMContentLoaded', function() {
//     initializeDoctorsDirectory();
// });

// function initializeDoctorsDirectory() {
//     populateCountryFilter();
//     displayDoctors(doctorsData);
//     setupSearchAndFilter();
// }

// // Populate the country filter dropdown
// function populateCountryFilter() {
//     const countryFilter = document.getElementById('countryFilter');
    
//     // Clear existing options except the first one
//     while (countryFilter.options.length > 1) {
//         countryFilter.remove(1);
//     }
    
//     // Add countries to the filter
//     countries.forEach(country => {
//         if (country.code !== "all") {
//             const option = document.createElement('option');
//             option.value = country.code;
//             option.textContent = country.name;
//             countryFilter.appendChild(option);
//         }
//     });
// }

// // Display doctors in the results container
// function displayDoctors(doctors) {
//     const resultsContainer = document.getElementById('doctorsResults');
    
//     if (doctors.length === 0) {
//         resultsContainer.innerHTML = `
//             <div class="no-results">
//                 <i class="fas fa-search"></i>
//                 <h3>No doctors found</h3>
//                 <p>Try adjusting your search criteria</p>
//             </div>
//         `;
//         return;
//     }
    
//     resultsContainer.innerHTML = doctors.map(doctor => `
//         <div class="doctor-card">
//             <div class="doctor-header">
//                 <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
//                 <div class="doctor-basic-info">
//                     <h3 class="doctor-name">${doctor.name}</h3>
//                     <p class="doctor-specialty">${doctor.specialty}</p>
//                     <div class="doctor-country">
//                         <img src="${doctor.flag}" alt="${doctor.country}" class="country-flag">
//                         <span>${doctor.country}</span>
//                     </div>
//                 </div>
//             </div>
//             <div class="doctor-description">
//                 <p>${doctor.description}</p>
//             </div>
//             <div class="doctor-actions">
//                 <a href="${doctor.website}" target="_blank" class="doctor-website-btn">
//                     <i class="fas fa-globe"></i> Visit Website
//                 </a>
//             </div>
//         </div>
//     `).join('');
// }

// // Set up search and filter functionality
// function setupSearchAndFilter() {
//     const searchInput = document.getElementById('doctorSearch');
//     const countryFilter = document.getElementById('countryFilter');
    
//     searchInput.addEventListener('input', filterDoctors);
//     countryFilter.addEventListener('change', filterDoctors);
// }

// // Filter doctors based on search and country criteria
// function filterDoctors() {
//     const searchTerm = document.getElementById('doctorSearch').value.toLowerCase();
//     const countryValue = document.getElementById('countryFilter').value;
    
//     let filteredDoctors = doctorsData;
    
//     // Filter by search term
//     if (searchTerm) {
//         filteredDoctors = filteredDoctors.filter(doctor => 
//             doctor.name.toLowerCase().includes(searchTerm) || 
//             doctor.specialty.toLowerCase().includes(searchTerm) ||
//             doctor.description.toLowerCase().includes(searchTerm)
//         );
//     }
    
//     // Filter by country
//     if (countryValue !== 'all') {
//         const selectedCountry = countries.find(c => c.code === countryValue);
//         if (selectedCountry) {
//             filteredDoctors = filteredDoctors.filter(doctor => 
//                 doctor.country.toLowerCase() === selectedCountry.name.toLowerCase()
//             );
//         }
//     }
    
//     displayDoctors(filteredDoctors);
// }

// // Function to add a new doctor (for future expansion)
// function addNewDoctor(doctorData) {
//     // Generate a unique ID
//     const newId = doctorsData.length > 0 ? Math.max(...doctorsData.map(d => d.id)) + 1 : 1;
    
//     // Add the new doctor
//     const newDoctor = {
//         id: newId,
//         ...doctorData
//     };
    
//     doctorsData.push(newDoctor);
    
//     // Check if we need to add a new country
//     const countryExists = countries.some(c => 
//         c.name.toLowerCase() === newDoctor.country.toLowerCase()
//     );
    
//     if (!countryExists) {
//         countries.push({
//             code: newDoctor.country.toLowerCase().replace(/\s+/g, '_'),
//             name: newDoctor.country,
//             flag: "images/globe.png" // Default flag, can be updated later
//         });
        
//         // Update the country filter
//         populateCountryFilter();
//     }
    
//     // Refresh the display
//     filterDoctors();
    
//     return newDoctor;
// }

// // Example of how to add a new doctor (for demonstration)
// // addNewDoctor({
// //     name: "Dr. New Doctor",
// //     specialty: "Specialty",
// //     country: "New Country",
// //     flag: "images/globe.png",
// //     website: "https://example.com",
// //     image: "images/doctors/default.jpg",
// //     description: "Description of the new doctor."
// // });























// // websites.js - Search and filter functionality for medical websites directory

// // Sample medical websites data
// const websitesData = [
//     {
//         id: 1,
//         name: "Vezeeta",
//         category: "Doctor Booking Platform",
//         countries: ["Egypt", "Saudi Arabia", "Lebanon", "Jordan"],
//         flags: ["images/egy.png", "images/sa.png", "images/Lebanon.jpeg", "images/Jordan.png"],
//         website: "https://www.vezeeta.com/en/",
//         logo: "images/doctors/veseeta.jpeg",
//         description: "Leading online doctor booking platform in the Middle East. Find and book appointments with verified doctors."
//     },
//     {
//         id: 2,
//         name: "Doctolib",
//         category: "Medical Appointment Platform",
//         countries: ["France", "Germany", "Italy"],
//         flags: ["images/france.png", "images/germany.png", "images/italy.png"],
//         website: "https://www.doctolib.fr/",
//         logo: "images/doctors/Doctolib.png",
//         description: "Europe's leading medical appointment booking platform. Manage your healthcare appointments online."
//     },
//     {
//         id: 3,
//         name: "CliniDo",
//         category: "Healthcare Platform",
//         countries: ["Spain", "Mexico", "Colombia"],
//         flags: ["images/spain.png", "images/mexico.png", "images/colombia.png"],
//         website: "https://clinido.com/en/",
//         logo: "images/doctors/cliniDo.svg",
//         description: "Comprehensive healthcare platform offering online consultations and appointment booking."
//     },
//     {
//         id: 4,
//         name: "Healthgrades",
//         category: "Doctor Reviews & Booking",
//         countries: ["United States"],
//         flags: ["images/usa.png"],
//         website: "https://www.healthgrades.com/",
//         logo: "images/doctors/healthgrades.png",
//         description: "America's leading resource for finding and choosing the right doctor, hospital, and care."
//     },
//     {
//         id: 5,
//         name: "Practo",
//         category: "Healthcare Platform",
//         countries: ["India", "Singapore", "Philippines"],
//         flags: ["images/india.png", "images/singapore.png", "images/philippines.png"],
//         website: "https://www.practo.com/",
//         logo: "images/doctors/practo.png",
//         description: "Asia's leading healthcare platform connecting patients with healthcare providers."
//     },
//     {
//         id: 6,
//         name: "Alodokter",
//         category: "Medical Information Platform",
//         countries: ["Indonesia"],
//         flags: ["images/indonesia.png"],
//         website: "https://www.alodokter.com/",
//         logo: "images/doctors/alodokter.png",
//         description: "Indonesia's most trusted health platform providing medical information and doctor consultations."
//     },
//     {
//         id: 7,
//         name: "KenyaDoctors",
//         category: "Medical Directory",
//         countries: ["Kenya"],
//         flags: ["images/Kenya.png"],
//         website: "https://www.kenyadoctors.com/",
//         logo: "images/doctors/kenyadoctors.png",
//         description: "Comprehensive medical directory for finding healthcare professionals in Kenya."
//     },
//     {
//         id: 8,
//         name: "NigeriaHealth",
//         category: "Healthcare Platform",
//         countries: ["Nigeria"],
//         flags: ["images/Nigeria.png"],
//         website: "https://www.nigeriahealth.com/",
//         logo: "images/doctors/nigeriahealth.png",
//         description: "Nigeria's premier healthcare platform connecting patients with medical professionals."
//     }
// ];

// // Available countries with flag images
// const countries = [
//     { code: "all", name: "All Countries", flag: "images/globe.png" },
//     { code: "egypt", name: "Egypt", flag: "images/egy.png" },
//     { code: "saudi", name: "Saudi Arabia", flag: "images/sa.png" },
//     { code: "lebanon", name: "Lebanon", flag: "images/Lebanon.jpeg" },
//     { code: "jordan", name: "Jordan", flag: "images/Jordan.png" },
//     { code: "nigeria", name: "Nigeria", flag: "images/Nigeria.png" },
//     { code: "kenya", name: "Kenya", flag: "images/Kenya.png" },
//     { code: "france", name: "France", flag: "images/france.png" },
//     { code: "spain", name: "Spain", flag: "images/spain.png" },
//     { code: "usa", name: "United States", flag: "images/usa.png" },
//     { code: "india", name: "India", flag: "images/india.png" },
//     { code: "indonesia", name: "Indonesia", flag: "images/indonesia.png" },
//     { code: "germany", name: "Germany", flag: "images/germany.png" }
// ];

// // Available categories
// const categories = [
//     "All Categories",
//     "Doctor Booking Platform",
//     "Medical Appointment Platform", 
//     "Healthcare Platform",
//     "Doctor Reviews & Booking",
//     "Medical Information Platform",
//     "Medical Directory"
// ];

// // Initialize the websites directory
// document.addEventListener('DOMContentLoaded', function() {
//     initializeWebsitesDirectory();
// });

// function initializeWebsitesDirectory() {
//     populateCountryFilter();
//     populateCategoryFilter();
//     displayWebsites(websitesData);
//     setupSearchAndFilter();
// }

// // Populate the country filter dropdown
// function populateCountryFilter() {
//     const countryFilter = document.getElementById('countryFilter');
    
//     // Clear existing options except the first one
//     while (countryFilter.options.length > 1) {
//         countryFilter.remove(1);
//     }
    
//     // Add countries to the filter
//     countries.forEach(country => {
//         if (country.code !== "all") {
//             const option = document.createElement('option');
//             option.value = country.code;
//             option.textContent = country.name;
//             countryFilter.appendChild(option);
//         }
//     });
// }

// // Populate the category filter dropdown
// function populateCategoryFilter() {
//     const categoryFilter = document.getElementById('categoryFilter');
    
//     categories.forEach(category => {
//         const option = document.createElement('option');
//         option.value = category === "All Categories" ? "all" : category;
//         option.textContent = category;
//         categoryFilter.appendChild(option);
//     });
// }

// // Display websites in the results container
// function displayWebsites(websites) {
//     const resultsContainer = document.getElementById('websitesResults');
    
//     if (websites.length === 0) {
//         resultsContainer.innerHTML = `
//             <div class="no-results">
//                 <i class="fas fa-search"></i>
//                 <h3>No websites found</h3>
//                 <p>Try adjusting your search criteria</p>
//             </div>
//         `;
//         return;
//     }
    
//     resultsContainer.innerHTML = websites.map(website => `
//         <div class="website-card">
//             <div class="website-header">
//                 <img src="${website.logo}" alt="${website.name}" class="website-logo">
//                 <div class="website-basic-info">
//                     <h3 class="website-name">${website.name}</h3>
//                     <p class="website-category">${website.category}</p>
//                     <div class="website-countries">
//                         ${website.countries.slice(0, 3).map((country, index) => `
//                             <div class="country-item">
//                                 <img src="${website.flags[index]}" alt="${country}" class="country-flag">
//                                 <span>${country}</span>
//                             </div>
//                         `).join('')}
//                         ${website.countries.length > 3 ? `<span class="more-countries">+${website.countries.length - 3} more</span>` : ''}
//                     </div>
//                 </div>
//             </div>
//             <div class="website-description">
//                 <p>${website.description}</p>
//             </div>
//             <div class="website-actions">
//                 <a href="${website.website}" target="_blank" class="website-visit-btn">
//                     <i class="fas fa-external-link-alt"></i> Visit Website
//                 </a>
//             </div>
//         </div>
//     `).join('');
// }

// // Set up search and filter functionality
// function setupSearchAndFilter() {
//     const searchInput = document.getElementById('websiteSearch');
//     const countryFilter = document.getElementById('countryFilter');
//     const categoryFilter = document.getElementById('categoryFilter');
    
//     searchInput.addEventListener('input', filterWebsites);
//     countryFilter.addEventListener('change', filterWebsites);
//     categoryFilter.addEventListener('change', filterWebsites);
// }

// // Filter websites based on search and filter criteria
// function filterWebsites() {
//     const searchTerm = document.getElementById('websiteSearch').value.toLowerCase();
//     const countryValue = document.getElementById('countryFilter').value;
//     const categoryValue = document.getElementById('categoryFilter').value;
    
//     let filteredWebsites = websitesData;
    
//     // Filter by search term (website name)
//     if (searchTerm) {
//         filteredWebsites = filteredWebsites.filter(website => 
//             website.name.toLowerCase().includes(searchTerm) || 
//             website.category.toLowerCase().includes(searchTerm) ||
//             website.description.toLowerCase().includes(searchTerm)
//         );
//     }
    
//     // Filter by country
//     if (countryValue !== 'all') {
//         const selectedCountry = countries.find(c => c.code === countryValue);
//         if (selectedCountry) {
//             filteredWebsites = filteredWebsites.filter(website => 
//                 website.countries.some(country => 
//                     country.toLowerCase() === selectedCountry.name.toLowerCase()
//                 )
//             );
//         }
//     }
    
//     // Filter by category
//     if (categoryValue !== 'all') {
//         filteredWebsites = filteredWebsites.filter(website => 
//             website.category === categoryValue
//         );
//     }
    
//     displayWebsites(filteredWebsites);
// }

// // Function to add a new website (for future expansion)
// function addNewWebsite(websiteData) {
//     // Generate a unique ID
//     const newId = websitesData.length > 0 ? Math.max(...websitesData.map(w => w.id)) + 1 : 1;
    
//     // Add the new website
//     const newWebsite = {
//         id: newId,
//         ...websiteData
//     };
    
//     websitesData.push(newWebsite);
    
//     // Check if we need to add new countries
//     websiteData.countries.forEach(country => {
//         const countryExists = countries.some(c => 
//             c.name.toLowerCase() === country.toLowerCase()
//         );
        
//         if (!countryExists) {
//             countries.push({
//                 code: country.toLowerCase().replace(/\s+/g, '_'),
//                 name: country,
//                 flag: "images/globe.png" // Default flag, can be updated later
//             });
//         }
//     });
    
//     // Update filters
//     populateCountryFilter();
    
//     // Check if we need to add new category
//     if (!categories.includes(websiteData.category)) {
//         categories.push(websiteData.category);
//         populateCategoryFilter();
//     }
    
//     // Refresh the display
//     filterWebsites();
    
//     return newWebsite;
// }



























// websites.js - Search and filter functionality for medical websites directory

// Sample medical websites data
const websitesData = [
    {
        id: 1,
        name: "Vezeeta",
        category: "",
        // category: "Doctor Booking Platform",
        countries: ["Egypt", "Saudi Arabia", "Lebanon", "Jordan"],
        flags: ["images/countrys/egy.png", "images/countrys/sa.png", "images/countrys/Lebanon.jpeg", "images/countrys/Jordan.png"],
        website: "https://www.vezeeta.com/en/doctor/diabetes-and-endocrinology/",
        logo: "images/doctors/veseeta.jpeg",
        description: ""
        // description: "Leading online doctor booking platform in the Middle East. Find and book appointments with verified doctors."
    },
    {
        id: 2,
        name: "Doctolib",
        category: "",
        // category: "Medical Appointment Platform",
        countries: ["France", "Germany", "Italy"],
        flags: ["images/countrys/france.png", "images/countrys/germany.png", "images/countrys/italy.png"],
        website: "https://www.doctolib.fr/",
        logo: "images/doctors/Doctolib.png",
        description: ""
        // description: "Europe's leading medical appointment booking platform. Manage your healthcare appointments online."
    },
    {
        id: 3,
        name: "CliniDo",
        category: "",
        // category: "Healthcare Platform",
        // countries: ["Spain", "Mexico", "Colombia"],
        // flags: ["images/countrys/spain.png", "images/countrys/mexico.png", "images/countrys/colombia.png"],
        countries: ["Egypt"],
        flags: ["images/countrys/egy.png",],
        website: "https://clinido.com/en/online_search/Diabetes-and-Endocrinology",
        logo: "images/doctors/cliniDo.svg",
        description: ""
        // description: "Comprehensive healthcare platform offering online consultations and appointment booking."
    },
    {
        id: 4,
        name: "Ekshef",
        category: "",
        // category: "Healthcare Platform",
        // countries: ["Spain", "Mexico", "Colombia"],
        // flags: ["images/countrys/spain.png", "images/countrys/mexico.png", "images/countrys/colombia.png"],
        countries: ["Egypt"],
        flags: ["images/countrys/egy.png",],
        website: "https://ekshef.com/%D8%AF%D9%83%D8%AA%D9%88%D8%B1/%D8%B3%D9%83%D8%B1-%D9%88%D8%BA%D8%AF%D8%AF-%D8%B5%D9%85%D8%A7%D8%A1/%D9%85%D8%B5%D8%B1",
        logo: "images/doctors/ekshef.png",
        description: ""
        // description: "Comprehensive healthcare platform offering online consultations and appointment booking."
    },
    // {
    //     id: 4,
    //     name: "Healthgrades",
    //     category: "",
    //     // category: "Doctor Reviews & Booking",
    //     countries: ["United States"],
    //     flags: ["images/usa.png"],
    //     website: "https://www.healthgrades.com/",
    //     logo: "images/doctors/healthgrades.png",
    //     description: "America's leading resource for finding and choosing the right doctor, hospital, and care."
    // },
    {
        id: 5,
        name: "Practo",
        category: "",
        // category: "Healthcare Platform",
        countries: ["India", "Singapore", "Saudi Arabia", "Philippines", "Mexico"],
        flags: ["images/countrys/india.png", "images/countrys/singapore.png", "images/countrys/sa.png", "images/countrys/philippines.png", "images/countrys/mexico.png"],
        website: "https://www.practo.com/",
        logo: "images/doctors/practo.webp",
        description: ""
        // description: "Asia's leading healthcare platform connecting patients with healthcare providers."
    },
        {
        id: 6,
        name: "altibbi",
        category: "",
        // category: "Healthcare Platform",
        // countries: ["Spain", "Mexico", "Colombia"],
        // flags: ["images/countrys/spain.png", "images/countrys/mexico.png", "images/countrys/colombia.png"],
        countries: ["Egypt"],
        flags: ["images/countrys/egy.png",],
        website: "https://altibbi.com/",
        logo: "images/doctors/altibbi.svg",
        description: ""
        // description: "Comprehensive healthcare platform offering online consultations and appointment booking."
    }
    // {
    //     id: 6,
    //     name: "Alodokter",
    //     category: "",
    //     // category: "Medical Information Platform",
    //     countries: ["Indonesia"],
    //     flags: ["images/indonesia.png"],
    //     website: "https://www.alodokter.com/",
    //     logo: "images/doctors/alodokter.png",
    //     description: "Indonesia's most trusted health platform providing medical information and doctor consultations."
    // },
    // {
    //     id: 7,
    //     name: "KenyaDoctors",
    //     category: "",
    //     // category: "Medical Directory",
    //     countries: ["Kenya"],
    //     flags: ["images/Kenya.png"],
    //     website: "https://www.kenyadoctors.com/",
    //     logo: "images/doctors/kenyadoctors.png",
    //     description: "Comprehensive medical directory for finding healthcare professionals in Kenya."
    // },
    // {
    //     id: 8,
    //     name: "NigeriaHealth",
    //     category: "",
    //     // category: "Healthcare Platform",
    //     countries: ["Nigeria"],
    //     flags: ["images/Nigeria.png"],
    //     website: "https://www.nigeriahealth.com/",
    //     logo: "images/doctors/nigeriahealth.png",
    //     description: "Nigeria's premier healthcare platform connecting patients with medical professionals."
    // }
];

// Available countries with flag images
const countries = [
    { code: "all", name: "All Countries", flag: "images/countrys/globe.png" },
    { code: "egypt", name: "Egypt", flag: "images/countrys/egy.png" },
    { code: "saudi", name: "Saudi Arabia", flag: "images/countrys/sa.png" },
    { code: "lebanon", name: "Lebanon", flag: "images/countrys/Lebanon.jpeg" },
    { code: "jordan", name: "Jordan", flag: "images/countrys/Jordan.png" },
    { code: "nigeria", name: "Nigeria", flag: "images/countrys/Nigeria.png" },
    { code: "kenya", name: "Kenya", flag: "images/countrys/Kenya.png" },
    { code: "france", name: "France", flag: "images/countrys/france.png" },
    { code: "spain", name: "Spain", flag: "images/countrys/spain.png" },
    { code: "usa", name: "United States", flag: "images/countrys/usa.png" },
    { code: "india", name: "India", flag: "images/countrys/india.png" },
    { code: "indonesia", name: "Indonesia", flag: "images/countrys/indonesia.png" },
    { code: "germany", name: "Germany", flag: "images/countrys/germany.png" }
];

// Available categories - COMMENTED OUT
/*
const categories = [
    "All Categories",
    "Doctor Booking Platform",
    "Medical Appointment Platform", 
    "Healthcare Platform",
    "Doctor Reviews & Booking",
    "Medical Information Platform",
    "Medical Directory"
];
*/

// Initialize the websites directory
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsitesDirectory();
});

function initializeWebsitesDirectory() {
    populateCountryFilter();
    // populateCategoryFilter(); // COMMENTED OUT - Category filter disabled
    displayWebsites(websitesData);
    setupSearchAndFilter();
}

// Populate the country filter dropdown
function populateCountryFilter() {
    const countryFilter = document.getElementById('countryFilter');
    
    // Clear existing options except the first one
    while (countryFilter.options.length > 1) {
        countryFilter.remove(1);
    }
    
    // Add countries to the filter
    countries.forEach(country => {
        if (country.code !== "all") {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countryFilter.appendChild(option);
        }
    });
}

// Populate the category filter dropdown - COMMENTED OUT
/*
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category === "All Categories" ? "all" : category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}
*/

// Display websites in the results container
function displayWebsites(websites) {
    const resultsContainer = document.getElementById('websitesResults');
    
    if (websites.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No websites found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = websites.map(website => `
        <div class="website-card">
            <div class="website-header">
                <img src="${website.logo}" alt="${website.name}" class="website-logo">
                <div class="website-basic-info">
                    <h3 class="website-name">${website.name}</h3>
                    <p class="website-category">${website.category}</p>
                    <div class="website-countries">
                        ${website.countries.slice(0, 50).map((country, index) => `
                            <div class="country-item">
                                <img src="${website.flags[index]}" alt="${country}" class="country-flag">
                                <span>${country}</span>
                            </div>
                        `).join('')}
                        ${website.countries.length > 50 ? `<span class="more-countries">+${website.countries.length - 50} more</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="website-description">
                <p>${website.description}</p>
            </div>
            <div class="website-actions">
                <a href="${website.website}" target="_blank" class="website-visit-btn">
                    <i class="fas fa-external-link-alt"></i> Visit Website
                </a>
            </div>
        </div>
    `).join('');
}

// Set up search and filter functionality
function setupSearchAndFilter() {
    const searchInput = document.getElementById('websiteSearch');
    const countryFilter = document.getElementById('countryFilter');
    // const categoryFilter = document.getElementById('categoryFilter'); // COMMENTED OUT
    
    searchInput.addEventListener('input', filterWebsites);
    countryFilter.addEventListener('change', filterWebsites);
    // categoryFilter.addEventListener('change', filterWebsites); // COMMENTED OUT
}

// Filter websites based on search and filter criteria
function filterWebsites() {
    const searchTerm = document.getElementById('websiteSearch').value.toLowerCase();
    const countryValue = document.getElementById('countryFilter').value;
    // const categoryValue = document.getElementById('categoryFilter').value; // COMMENTED OUT
    
    let filteredWebsites = websitesData;
    
    // Filter by search term (website name)
    if (searchTerm) {
        filteredWebsites = filteredWebsites.filter(website => 
            website.name.toLowerCase().includes(searchTerm) || 
            website.category.toLowerCase().includes(searchTerm) ||
            website.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by country
    if (countryValue !== 'all') {
        const selectedCountry = countries.find(c => c.code === countryValue);
        if (selectedCountry) {
            filteredWebsites = filteredWebsites.filter(website => 
                website.countries.some(country => 
                    country.toLowerCase() === selectedCountry.name.toLowerCase()
                )
            );
        }
    }
    
    // Filter by category - COMMENTED OUT
    /*
    if (categoryValue !== 'all') {
        filteredWebsites = filteredWebsites.filter(website => 
            website.category === categoryValue
        );
    }
    */
    
    displayWebsites(filteredWebsites);
}

// Function to add a new website (for future expansion)
function addNewWebsite(websiteData) {
    // Generate a unique ID
    const newId = websitesData.length > 0 ? Math.max(...websitesData.map(w => w.id)) + 1 : 1;
    
    // Add the new website
    const newWebsite = {
        id: newId,
        ...websiteData
    };
    
    websitesData.push(newWebsite);
    
    // Check if we need to add new countries
    websiteData.countries.forEach(country => {
        const countryExists = countries.some(c => 
            c.name.toLowerCase() === country.toLowerCase()
        );
        
        if (!countryExists) {
            countries.push({
                code: country.toLowerCase().replace(/\s+/g, '_'),
                name: country,
                flag: "images/globe.png" // Default flag, can be updated later
            });
        }
    });
    
    // Update filters
    populateCountryFilter();
    
    // Check if we need to add new category
    if (!categories.includes(websiteData.category)) {
        categories.push(websiteData.category);
        populateCategoryFilter();
    }
    
    // Refresh the display
    filterWebsites();
    
    return newWebsite;
}