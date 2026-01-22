document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItemsContainer = document.getElementById('menuItems');
    const footerLinks = document.querySelectorAll('.footer-links a[data-category]');
    
    // Данные меню
    const menuData = {
        donuts: [
        ],
        pizza: [
        ],
        drinks: [
        ]    
    };
    
    // Инициализация
    fetchGoogleSheetData();
    News_getter();
    // получение цен и новостей
    async function fetchGoogleSheetData() {
    try {
        const sheet_id = "1OOSgWA91opl6d-jngyKBSuJ7P0pTxd8Wk5z-_JyZavI"
        const api_key = "AIzaSyDuucqwu0PfduoNoXGgYPkMAAMi3X2uDVA"

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/Меню?key=${api_key}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Extract rows from the data
        const rows = data.values;
        for(i = 1; i < rows.length; i++){
            let curr_row = rows[i];
            menuData[curr_row[1]].push({
                id: parseInt(curr_row[0]) || curr_row[0],
                name: curr_row[2] || '',
                price: parseFloat(curr_row[4]) || 0,
                description: curr_row[3] || '',
                tag: curr_row[5] || ''
            });
        }
        initNav();
        initMenu();
    } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
    }
}

    // получение и отоброжение новостей
    async function News_getter() {
        const sheet_id = "1OOSgWA91opl6d-jngyKBSuJ7P0pTxd8Wk5z-_JyZavI"
        const api_key = "AIzaSyDuucqwu0PfduoNoXGgYPkMAAMi3X2uDVA"

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/Новости?key=${api_key}`;
        const response = await fetch(url);
        const data = await response.json();
        const rows = data.values;

        console.log(rows);
        let news_container = document.getElementById("news-container");
        
        if (rows.length){
        for(let i = 1; i < rows.length; i++){
            news_container.innerHTML += `<p>${rows[i][0]}</p>`
        }}
    }

    // Функции
    function initNav() {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Анимация бургер-меню
            const bars = document.querySelectorAll('.bar');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Закрываем меню на мобильных устройствах
                        if (window.innerWidth <= 768) {
                            navMenu.classList.remove('active');
                            bars[0].style.transform = 'none';
                            bars[1].style.opacity = '1';
                            bars[2].style.transform = 'none';
                        }
                        
                        // Прокрутка к элементу
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Обновляем активную ссылку
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }
                }
            });
        });
        
        // Обработка скролла для подсветки навигации
        window.addEventListener('scroll', highlightNavLinkOnScroll);
    }
    
    function highlightNavLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    function initMenu() {
        // Загружаем пончики по умолчанию
        renderMenuItems('donuts');
        
        // Обработчики для вкладок меню
        menuTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Обновляем активную вкладку
                menuTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Загружаем соответствующие товары
                const category = this.getAttribute('data-category');
                renderMenuItems(category);
            });
        });
        
        // Обработчики для ссылок в футере
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#menu') {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    
                    // Активируем соответствующую вкладку
                    menuTabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('data-category') === category) {
                            tab.classList.add('active');
                        }
                    });
                    
                    // Загружаем товары
                    renderMenuItems(category);
                    
                    // Прокрутка к меню
                    const menuSection = document.getElementById('menu');
                    window.scrollTo({
                        top: menuSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    function renderMenuItems(category) {
        const items = menuData[category] || [];
        
        if (items.length === 0) {
            menuItemsContainer.innerHTML = `
                <div class="menu-error">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px; color: var(--light-gray);"></i>
                    <h3 style="margin-bottom: 10px; color: var(--dark);">Меню временно недоступно</h3>
                    <p style="color: var(--gray);">Попробуйте обновить страницу или зайдите позже.</p>
                </div>
            `;
            return;
        }
        
        let menuHTML = '';
        
        items.forEach((item, index) => {
            menuHTML += `
                <div class="menu-item" style="animation-delay: ${index * 0.05}s">
                    <div class="image-container" style="width: 100%; height: 200px; overflow: hidden; border-radius: 12px;">
                        <img src="./images/${item.id}.jpg" class="item-image" alt="${item.name}" 
                             style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="menu-item-header">
                        <div>
                            <h3 class="menu-item-title">${item.name}</h3>
                            ${item.tag ? `<span class="menu-item-tag">${item.tag}</span>` : ''}
                        </div>
                        <div class="menu-item-price"><b>${item.price}</b> р</div>
                    </div>
                    <p class="menu-item-desc">${item.description}</p>
                </div>
            `;
        });
        
        menuItemsContainer.innerHTML = menuHTML;
    }
    
    // Плавное появление элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease ${entry.target.dataset.delay || '0s'} forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами меню
    document.querySelectorAll('.menu-item').forEach((item, index) => {
        item.dataset.delay = `${index * 0.05}s`;
        observer.observe(item);
    });
    
    // Наблюдаем за другими элементами
    document.querySelectorAll('.feature, .hero-icon').forEach((item, index) => {
        item.dataset.delay = `${index * 0.1}s`;
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        observer.observe(item);
    });
});

