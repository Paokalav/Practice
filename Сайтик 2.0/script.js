//Функция, если нужно включить стирание данных после обновления страницы
localStorage.clear();
// Данные приложения
const teachers = [
    { id: 1, name: "Иванов А.П.", disciplines: ["Математика", "Физика"] },
    { id: 2, name: "Петрова М.И.", disciplines: ["Литература", "Русский язык"] },
    { id: 3, name: "Сидоров В.С.", disciplines: ["История", "Обществознание"] },
    { id: 4, name: "Кузнецова О.Д.", disciplines: ["Информатика", "Программирование"] }
];

// Инициализация данных в localStorage
function initData() {
    if (!localStorage.getItem('reviews')) {
        // Примеры отзывов для демонстрации
        const reviews = [
            {
                id: 1,
                teacherId: 1,
                discipline: "Математика",
                ratings: { clarity: 5, fairness: 4, engagement: 4 },
                comment: "Отличный преподаватель, хорошо объясняет сложные темы. Всегда готов помочь после занятий.",
                date: "2025-07-10",
                status: "approved"
            },
            {
                id: 2,
                teacherId: 2,
                discipline: "Литература",
                ratings: { clarity: 5, fairness: 5, engagement: 5 },
                comment: "Очень интересные лекции, всегда справедлива к студентам. Знает предмет на отлично!",
                date: "2025-7-10",
                status: "approved"
            },
            {
                id: 3,
                teacherId: 3,
                discipline: "История",
                ratings: { clarity: 4, fairness: 3, engagement: 4 },
                comment: "Интересно рассказывает, но оценки иногда занижает без причин.",
                date: "2025-7-10",
                status: "approved"
            },
            {
                id: 4,
                teacherId: 4,
                discipline: "Программирование",
                ratings: { clarity: 5, fairness: 4, engagement: 5 },
                comment: "Современный подход к обучению, актуальные знания. Рекомендую!",
                date: "2025-7-10",
                status: "pending"
            }
        ];
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }
}

// Получить отзывы
function getReviews() {
    return JSON.parse(localStorage.getItem('reviews')) || [];
}

// Сохранить отзывы
function saveReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

// Показать toast сообщение
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3500);
}

// Инициализация звезд рейтинга
function initRatingStars() {
    document.querySelectorAll('.stars').forEach(stars => {
        stars.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                const container = this.parentElement;
                const inputId = container.id.replace('Stars', 'Rating');
                const input = document.getElementById(inputId);
                
                // Обновляем визуальное отображение звезд
                container.querySelectorAll('.star').forEach((s, i) => {
                    s.textContent = i < value ? '★' : '☆';
                    s.classList.toggle('active', i < value);
                });
                
                // Обновляем скрытое поле
                input.value = value;
            });
        });
    });
}

// Рассчитать средний рейтинг для преподавателя
function calculateTeacherRating(teacherId) {
    const reviews = getReviews().filter(r => 
        r.teacherId === teacherId && r.status === "approved"
    );
    
    if (reviews.length === 0) return null;
    
    const total = {
        clarity: 0,
        fairness: 0,
        engagement: 0,
        overall: 0
    };
    
    reviews.forEach(review => {
        total.clarity += review.ratings.clarity;
        total.fairness += review.ratings.fairness;
        total.engagement += review.ratings.engagement;
    });
    
    return {
        clarity: parseFloat((total.clarity / reviews.length).toFixed(1)),
        fairness: parseFloat((total.fairness / reviews.length).toFixed(1)),
        engagement: parseFloat((total.engagement / reviews.length).toFixed(1)),
        overall: parseFloat((
            (total.clarity + total.fairness + total.engagement) / 
            (reviews.length * 3)
        ).toFixed(1)),
        count: reviews.length
    };
}

// Отобразить список преподавателей
function renderTeachers() {
    const filterTeacher = document.getElementById('filterTeacher').value;
    const filterDiscipline = document.getElementById('filterDiscipline').value.toLowerCase();
    
    const teachersList = document.getElementById('teachersList');
    teachersList.innerHTML = '';
    
    const filteredTeachers = teachers.filter(teacher => {
        // Фильтр по преподавателю
        if (filterTeacher && teacher.id !== parseInt(filterTeacher)) return false;
        
        // Фильтр по дисциплине
        if (filterDiscipline) {
            const matches = teacher.disciplines.filter(d => 
                d.toLowerCase().includes(filterDiscipline)
            );
            return matches.length > 0;
        }
        
        return true;
    });
    
    if (filteredTeachers.length === 0) {
        teachersList.innerHTML = '<div class="no-reviews">Преподаватели не найдены</div>';
        return;
    }
    
    filteredTeachers.forEach(teacher => {
        const ratings = calculateTeacherRating(teacher.id);
        const reviews = getReviews().filter(r => 
            r.teacherId === teacher.id && r.status === "approved"
        );
        
        const teacherEl = document.createElement('div');
        teacherEl.className = 'teacher-card';
        teacherEl.innerHTML = `
            <div class="teacher-header">
                <div>
                    <div class="teacher-name">${teacher.name}</div>
                    <div class="teacher-discipline">${teacher.disciplines.join(', ')}</div>
                </div>
                <div class="avg-rating">${ratings ? ratings.overall : '-'}</div>
            </div>
            ${ratings ? `
            <div class="rating-details">
                <div class="rating-detail">
                    <div class="detail-value">${ratings.clarity}</div>
                    <div class="detail-label">Объяснение</div>
                </div>
                <div class="rating-detail">
                    <div class="detail-value">${ratings.fairness}</div>
                    <div class="detail-label">Справедливость</div>
                </div>
                <div class="rating-detail">
                    <div class="detail-value">${ratings.engagement}</div>
                    <div class="detail-label">Интерес</div>
                </div>
            </div>
            ` : '<div class="no-reviews">Нет оценок</div>'}
            <div class="review-count" title="Количество отзывов">${reviews.length}</div>
        `;
        
        // Добавляем обработчик для просмотра отзывов
        teacherEl.addEventListener('click', () => {
            showTeacherReviews(teacher.id);
        });
        
        teachersList.appendChild(teacherEl);
    });
}

// Показать отзывы преподавателя
function showTeacherReviews(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    const reviews = getReviews().filter(r => 
        r.teacherId === teacherId && r.status === "approved"
    );
    
    const teachersList = document.getElementById('teachersList');
    teachersList.innerHTML = '';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '← Назад к списку преподавателей';
    backBtn.addEventListener('click', () => {
        renderTeachers();
    });
    
    let content = `
        <div class="teacher-card">
            <div class="teacher-header">
                <div>
                    <div class="teacher-name">${teacher.name}</div>
                    <div class="teacher-discipline">${teacher.disciplines.join(', ')}</div>
                </div>
                <div class="avg-rating">${reviews.length > 0 ? calculateTeacherRating(teacherId).overall : '-'}</div>
            </div>
    `;
    
    if (reviews.length > 0) {
        content += `
            <div class="rating-details">
                <div class="rating-detail">
                    <div class="detail-value">${calculateTeacherRating(teacherId).clarity}</div>
                    <div class="detail-label">Объяснение</div>
                </div>
                <div class="rating-detail">
                    <div class="detail-value">${calculateTeacherRating(teacherId).fairness}</div>
                    <div class="detail-label">Справедливость</div>
                </div>
                <div class="rating-detail">
                    <div class="detail-value">${calculateTeacherRating(teacherId).engagement}</div>
                    <div class="detail-label">Интерес</div>
                </div>
            </div>
        `;
    }
    
    content += `</div>`;
    
    content += `
        <div class="teacher-reviews" style="display: block;">
            <h3>Отзывы студентов (${reviews.length})</h3>
    `;
    
    if (reviews.length === 0) {
        content += '<div class="no-reviews">Нет отзывов для этого преподавателя</div>';
    } else {
        reviews.forEach(review => {
            content += `
                <div class="review-item">
                    <div class="review-header">
                        <div>
                            <div class="review-discipline">${review.discipline}</div>
                        </div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-ratings">
                        <div class="review-rating">
                            <span>Объясняет:</span>
                            <span class="review-rating-value">${review.ratings.clarity}</span>
                        </div>
                        <div class="review-rating">
                            <span>Справедлив:</span>
                            <span class="review-rating-value">${review.ratings.fairness}</span>
                        </div>
                        <div class="review-rating">
                            <span>Интересно:</span>
                            <span class="review-rating-value">${review.ratings.engagement}</span>
                        </div>
                    </div>
                    <div class="review-comment">${review.comment || 'Без комментария'}</div>
                </div>
            `;
        });
    }
    
    content += '</div>';
    
    teachersList.innerHTML = content;
    teachersList.appendChild(backBtn);
}

// Отобразить отзывы для модерации
function renderModerationReviews() {
    const adminContent = document.getElementById('adminContent');
    const reviews = getReviews().filter(r => r.status === "pending");
    
    if (reviews.length === 0) {
        adminContent.innerHTML = `
            <div class="login-form">
                <h2>Отзывов на модерации нет</h2>
            </div>
        `;
        return;
    }
    
    let content = '<div class="reviews-list">';
    
    reviews.forEach(review => {
        const teacher = teachers.find(t => t.id === review.teacherId);
        
        content += `
            <div class="review-item">
                <div class="review-header">
                    <div>
                        <div class="review-teacher">${teacher.name}</div>
                        <div class="review-discipline">${review.discipline}</div>
                    </div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-ratings">
                    <div class="review-rating">
                        <span>Объясняет:</span>
                        <span class="review-rating-value">${review.ratings.clarity}</span>
                    </div>
                    <div class="review-rating">
                        <span>Справедлив:</span>
                        <span class="review-rating-value">${review.ratings.fairness}</span>
                    </div>
                    <div class="review-rating">
                        <span>Интересно:</span>
                        <span class="review-rating-value">${review.ratings.engagement}</span>
                    </div>
                </div>
                <div class="review-comment">${review.comment || 'Без комментария'}</div>
                <div class="review-actions">
                    <button class="btn btn-approve" data-id="${review.id}">Одобрить</button>
                    <button class="btn btn-reject" data-id="${review.id}">Отклонить</button>
                </div>
            </div>
        `;
    });
    
    content += '</div>';
    adminContent.innerHTML = content;
    
    // Добавляем обработчики для кнопок
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', function() {
            moderateReview(parseInt(this.dataset.id), "approved");
        });
    });
    
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', function() {
            moderateReview(parseInt(this.dataset.id), "rejected");
        });
    });
}

// Модерация отзыва
function moderateReview(reviewId, status) {
    const reviews = getReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].status = status;
        saveReviews(reviews);
        renderModerationReviews();
        renderTeachers();
        showToast(`Отзыв успешно ${status === "approved" ? "одобрен" : "отклонен"}!`, "success");
    }
}

// Вход администратора
function adminLogin() {
    const username = prompt("Введите логин администратора:");
    // Если пользователь нажал "Отмена" (возвращается null)
    if (username === null) {
        return; // Просто выходим из функции без действий
    }
    const password = prompt("Введите пароль:");
        // Если пользователь нажал "Отмена" при вводе пароля
    if (password === null) {
        return; // Просто выходим из функции
    }

    
    // Предопределенные учетные данные
    if (username === "admin" && password === "admin123") {
        document.getElementById('adminPanel').style.display = 'flex';
        renderModerationReviews();
    } else {
        showToast("Неверные учетные данные!", "error");
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initData();
    initRatingStars();
    renderTeachers();
    
    // Показываем дисциплины преподавателя при выборе
    document.getElementById('teacher').addEventListener('change', function() {
        const teacherId = parseInt(this.value);
        const infoDiv = document.getElementById('teacherDisciplines');
        const listSpan = document.getElementById('disciplinesList');
        
        if (teacherId) {
            const teacher = teachers.find(t => t.id === teacherId);
            listSpan.textContent = teacher.disciplines.join(', ');
            infoDiv.style.display = 'block';
        } else {
            infoDiv.style.display = 'none';
        }
    });
    
    // Обработка формы отзыва
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const teacherId = parseInt(document.getElementById('teacher').value);
        const discipline = document.getElementById('discipline').value;
        const clarity = parseInt(document.getElementById('clarityRating').value);
        const fairness = parseInt(document.getElementById('fairnessRating').value);
        const engagement = parseInt(document.getElementById('engagementRating').value);
        const comment = document.getElementById('comment').value;
        
        // Проверка рейтингов
        if (clarity === 0 || fairness === 0 || engagement === 0) {
            showToast("Пожалуйста, оцените все критерии!", "error");
            return;
        }
        
        // Находим выбранного преподавателя
        const teacher = teachers.find(t => t.id === teacherId);
        
        // Проверяем, ведет ли преподаватель эту дисциплину
        const normalizedInput = discipline.trim().toLowerCase();
        const teacherDisciplines = teacher.disciplines.map(d => d.toLowerCase());
        
        if (!teacherDisciplines.includes(normalizedInput)) {
            showToast(`Ошибка! ${teacher.name} не ведет "${discipline}".\nВедет: ${teacher.disciplines.join(', ')}`, "error");
            return;
        }
        
        const reviews = getReviews();
        const newReview = {
            id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
            teacherId: teacherId,
            discipline: discipline,
            ratings: {
                clarity: clarity,
                fairness: fairness,
                engagement: engagement
            },
            comment: comment,
            date: new Date().toISOString().split('T')[0],
            status: "pending"
        };
        
        reviews.push(newReview);
        saveReviews(reviews);
        
        // Сброс формы
        this.reset();
        document.querySelectorAll('.star').forEach(star => {
            star.textContent = '☆';
            star.classList.remove('active');
        });
        
        document.getElementById('clarityRating').value = 0;
        document.getElementById('fairnessRating').value = 0;
        document.getElementById('engagementRating').value = 0;
        
        // Скрываем информацию о дисциплинах
        document.getElementById('teacherDisciplines').style.display = 'none';
        
        showToast("Отзыв отправлен на модерацию! Спасибо за ваш вклад.", "success");
        renderTeachers();
    });
    
    // Фильтры
    document.getElementById('filterTeacher').addEventListener('change', renderTeachers);
    document.getElementById('filterDiscipline').addEventListener('input', renderTeachers);
    
    // Админ-панель
    document.getElementById('adminBtn').addEventListener('click', adminLogin);
    document.getElementById('closeAdmin').addEventListener('click', function() {
        document.getElementById('adminPanel').style.display = 'none';
    });
});