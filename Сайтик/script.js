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
        const reviews = [
            {
                id: 1,
                teacherId: 1,
                discipline: "Математика",
                rating: 4.3,
                comment: "Отличный преподаватель, хорошо объясняет сложные темы. Всегда готов помочь после занятий.",
                date: "2025-07-10"
            },
            {
                id: 2,
                teacherId: 2,
                discipline: "Литература",
                rating: 5,
                comment: "Очень интересные лекции, всегда справедлива к студентам. Знает предмет на отлично!",
                date: "2025-7-10"
            },
            {
                id: 3,
                teacherId: 3,
                discipline: "История",
                rating: 3.7,
                comment: "Интересно рассказывает, но оценки иногда занижает без причин.",
                date: "2025-7-10"
            },
            {
                id: 4,
                teacherId: 4,
                discipline: "Программирование",
                rating: 4.8,
                comment: "Современный подход к обучению, актуальные знания. Рекомендую!",
                date: "2025-7-10"
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
    const reviews = getReviews().filter(r => r.teacherId === teacherId);
    
    if (reviews.length === 0) return null;
    
    let totalRating = 0;
    
    reviews.forEach(review => {
        totalRating += review.rating;
    });
    
    return {
        rating: parseFloat((totalRating / reviews.length).toFixed(1)),
        count: reviews.length
    };
}

// Отобразить список преподавателей
function renderTeachers() {
    const filterTeacher = document.getElementById('filterTeacher').value;
    
    const teachersList = document.getElementById('teachersList');
    teachersList.innerHTML = '';
    
    const filteredTeachers = teachers.filter(teacher => {
        // Фильтр по преподавателю
        if (filterTeacher && teacher.id !== parseInt(filterTeacher)) return false;
        return true;
    });
    
    if (filteredTeachers.length === 0) {
        teachersList.innerHTML = '<div class="no-reviews">Преподаватели не найдены</div>';
        return;
    }
    
    filteredTeachers.forEach(teacher => {
        const ratings = calculateTeacherRating(teacher.id);
        const reviews = getReviews().filter(r => r.teacherId === teacher.id);
        
        const teacherEl = document.createElement('div');
        teacherEl.className = 'teacher-card';
        teacherEl.innerHTML = `
            <div class="teacher-header">
                <div>
                    <div class="teacher-name">${teacher.name}</div>
                    <div class="teacher-discipline">${teacher.disciplines.join(', ')}</div>
                </div>
                <div class="avg-rating">${ratings ? ratings.rating : '-'}</div>
            </div>
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
    const reviews = getReviews().filter(r => r.teacherId === teacherId);
    
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
                <div class="avg-rating">${reviews.length > 0 ? calculateTeacherRating(teacherId).rating : '-'}</div>
            </div>
        </div>
    `;
    
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
                    <div class="review-rating">
                        <span>Общая оценка:</span>
                        <span class="review-rating-value">${review.rating}</span>
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

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initData();
    initRatingStars();
    renderTeachers();
    
    // Обработка формы отзыва
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const teacherId = parseInt(document.getElementById('teacher').value);
        const discipline = document.getElementById('discipline').value;
        const rating = parseInt(document.getElementById('overallRating').value);
        const comment = document.getElementById('comment').value;
        
        // Проверка рейтинга
        if (rating === 0) {
            showToast("Пожалуйста, оцените преподавателя!", "error");
            return;
        }
        
        const reviews = getReviews();
        const newReview = {
            id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
            teacherId: teacherId,
            discipline: discipline,
            rating: rating,
            comment: comment,
            date: new Date().toISOString().split('T')[0]
        };
        
        reviews.push(newReview);
        saveReviews(reviews);
        
        // Сброс формы
        this.reset();
        document.querySelectorAll('.star').forEach(star => {
            star.textContent = '☆';
            star.classList.remove('active');
        });
        
        document.getElementById('overallRating').value = 0;
        
        showToast("Отзыв успешно отправлен! Спасибо за ваш вклад.", "success");
        renderTeachers();
    });
    
    // Фильтры
    document.getElementById('filterTeacher').addEventListener('change', renderTeachers);
});