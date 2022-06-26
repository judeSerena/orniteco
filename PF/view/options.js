import { setTheme } from '../controller/settings.js'
import { applyTheme } from './applyTheme.js';

// Set theme from form selection
const form = document.getElementsByTagName('form')[0];
const themeOption = form.querySelector('select[name="theme"]');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    setTheme(themeOption.value);
    applyTheme(themeOption.value)
});