const API_KEY = "906af1cc135044dc89a4a4eae0e64001"; // Replace with your NewsAPI key
const BASE_URL = "https://newsapi.org/v2/top-headlines";
let currentPage = 1;
let currentCategory = "general";

// DOM Elements
const newsContainer = document.getElementById("news-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const categoryButtons = document.querySelectorAll(".category-btn");
const themeToggle = document.getElementById("theme-toggle");

// Fetch News
async function fetchNews(page = 1, category = "general") {
  const url = `${BASE_URL}?country=us&category=${category}&pageSize=10&page=${page}&apiKey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayNews(data.articles);
    updatePagination(data.totalResults);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

// Display News
function displayNews(articles) {
  newsContainer.innerHTML = "";
  articles.forEach((article) => {
    // Skip the article if any critical data is missing
    if (!article.title || !article.description || !article.url) {
      return;
    }

    const card = `
            <div class="bg-[#F1F3F5] dark:bg-[#252525] p-6 rounded-lg shadow-md border border-[#DEE2E6] dark:border-[#373737] transition-colors duration-300">
                <img src="${
                  article.urlToImage || "https://via.placeholder.com/300"
                }" alt="${
      article.title
    }" class="w-full h-48 object-cover rounded-lg mb-4">
                <h2 class="text-xl font-bold mb-2 text-[#212529] dark:text-[#EAEAEA]">${
                  article.title
                }</h2>
                <p class="text-[#495057] dark:text-[#B0B3B8] mb-4">${
                  article.description
                }</p>
                <a href="${
                  article.url
                }" target="_blank" class="text-[#007BFF] dark:text-[#00A8E8] hover:underline">Read More</a>
            </div>
        `;
    newsContainer.innerHTML += card;
  });
}

// Update Pagination
function updatePagination(totalResults) {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage * 10 >= totalResults;
}

// Event Listeners
prevBtn.addEventListener("click", () => {
  currentPage--;
  fetchNews(currentPage, currentCategory);
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchNews(currentPage, currentCategory);
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;
    currentPage = 1;
    fetchNews(currentPage, currentCategory);
  });
});

// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");

  // Function to apply the theme
  function applyTheme() {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", isDarkMode);
    themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });

  // Apply the correct theme on page load
  applyTheme();
});

// Redirect to Home Page on Logo Click
function loadNews() {
  currentPage = 1;
  currentCategory = "general";
  fetchNews();
}

// Load Initial News
fetchNews();
