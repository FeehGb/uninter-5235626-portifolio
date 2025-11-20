/* ----- Utilities ----- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ----- Elementos do DOM ----- */
const navToggle = $('#nav-toggle');
const primaryNav = $('#primary-nav');
const themeToggle = $('#theme-toggle');
const contactForm = $('#contact-form');
const modal = $('#modal');
const modalClose = $('#modal-close');
const modalOk = $('#modal-ok');
const yearSpan = $('#year');

/* Atualiza ano do rodapé */
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* ----- Meny para formato mobile ----- */
navToggle.addEventListener('click', () => {
    const opened = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    if (opened) primaryNav.querySelector('a')?.focus();
});

/* Fecha nav ao clicar em link */
$$('#primary-nav a').forEach(a =>
    a.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    })
);

/* ----- Tema: claro/escuro ----- */
const THEME_KEY = 'portfolio_theme';
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    themeToggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

/* ----- Validação do formulário ----- */
function isValidEmail(email) {
    // Regex simples e suficientemente robusta para validação básica de formulário
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, message) {
    const el = $(`#${id}`);
    if (el) el.textContent = message;
}

function clearErrors() {
    showError('error-name', '');
    showError('error-email', '');
    showError('error-message', '');
}

contactForm.addEventListener('submit', (ev) => {
    /* Validação simples do formulário de contato */
    ev.preventDefault();
    clearErrors();

    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    let valid = true;
    if (!name) { showError('error-name', 'Por favor insira seu nome.'); valid = false; }
    if (!email) { showError('error-email', 'Por favor insira seu e-mail.'); valid = false; }
    else if (!isValidEmail(email)) { showError('error-email', 'Formato de e-mail inválido.'); valid = false; }
    if (!message) { showError('error-message', 'Por favor escreva uma mensagem.'); valid = false; }

    if (!valid) {
        const firstError = document.querySelector('.error:not(:empty)');
        if (firstError) firstError.previousElementSibling?.focus();
        return;
    }

    openModal();
    contactForm.reset();
});

/* ----- Controle do comportamento do Modal----- */
function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    modalOk.focus();
}

function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    // Retorna foco para o botão enviar do formulário
    $('#contact-form button[type="submit"]').focus();
}

modalClose.addEventListener('click', closeModal);
modalOk.addEventListener('click', closeModal);

// fecha modal com ESC
document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

/* Fecha menu se clicar fora, quando mobile */
document.addEventListener('click', (ev) => {
    if (!primaryNav.classList.contains('open')) return;
    const isClickInside = primaryNav.contains(ev.target) || navToggle.contains(ev.target);
    if (!isClickInside) {
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

