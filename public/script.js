const API_URL = 'http://localhost:3000/cards';

async function fetchCards() {
    const response = await fetch(API_URL);
    const cards = await response.json();
    const cardsList = document.getElementById('cards');
    cardsList.innerHTML = '';
    cards.forEach(card => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${card.course} - ${card.question}</h3>
            <p>${card.answer}</p>
            <p>Zorluk: ${card.difficulty}</p>
            <button onclick="deleteCard(${card.id})">Sil</button>
            <button onclick="editCard(${card.id})">Düzenle</button>
        `;
        cardsList.appendChild(li);
    });
    // Tema değiştirici
const themeToggle = document.createElement('button');
themeToggle.id = 'theme-toggle';
themeToggle.textContent = '🌙';

document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode')
        ? '☀️'
        : '🌙';
});


}

async function addCard(event) {
    event.preventDefault();
    const newCard = {
        course: document.getElementById('course').value,
        question: document.getElementById('question').value,
        answer: document.getElementById('answer').value,
        difficulty: document.getElementById('difficulty').value
    };
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard)
    });
    fetchCards();
    event.target.reset();
}

async function deleteCard(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchCards();
}

async function editCard(id) {
    const question = prompt('Yeni soru:');
    const answer = prompt('Yeni cevap:');
    const course = prompt('Yeni ders:');
    const difficulty = prompt('Zorluk:');
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, course, difficulty })
    });
    fetchCards();
}

document.getElementById('card-form').addEventListener('submit', addCard);
document.addEventListener('DOMContentLoaded', fetchCards);
