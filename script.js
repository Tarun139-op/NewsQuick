
const API_KEY = "906af1cc135044dc89a4a4eae0e64001"; 
const BASE_URL = "https://newsapi.org/v2/top-headlines";
let currentPage = 1;
let currentCategory = "general";

const newsContainer = document.getElementById("news-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const categoryButtons = document.querySelectorAll(".category-btn");
const themeToggle = document.getElementById("theme-toggle");

// Fetch News
async function fetchNews(page = 1, category = "general") {
  const url = `${BASE_URL}?country=us&category=${category}&pageSize=9&page=${page}&apiKey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

// Display News
function displayNews(articles) {
  newsContainer.innerHTML = "";
  articles.forEach((article) => {
    if (!article.title || !article.description || !article.url) return;

    const newsCard = document.createElement("div");
    newsCard.classList.add("news-card");

    newsCard.innerHTML = `
            <img src="${
              article.urlToImage || "https://via.placeholder.com/300"
            }" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;

    newsContainer.appendChild(newsCard);
  });
}

// Handle Category Change
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;
    currentPage = 1;
    fetchNews(currentPage, currentCategory);
  });
});

// Pagination
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews(currentPage, currentCategory);
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchNews(currentPage, currentCategory);
});

// Dark Mode
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.innerText = "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggle.innerText = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.innerText = "🌙 Dark Mode";
  }
});

fetchNews();
