import fs from 'fs'
import { SELECT_ALL } from '../neon/select_vacancy.js'
import { sqlConnect } from '../neon/index.js'

const __dirname = process.cwd();

export const buildSite = async () => {
    const sql = sqlConnect();
    const vacancies = await SELECT_ALL(sql);

    const html = `
        ${vacancies.map(renderVacancy).join('')}
    `

    // Generate unique company list for filter dropdown
    const companies = [...new Set(vacancies.map(v => v.company))].sort();
    const companyOptions = companies.map(company => 
        `<option value="${company}">${company}</option>`
    ).join('');

    const template = fs.readFileSync(`${__dirname}/src/templates/index.html`, 'utf-8');
    const result = template
        .replace('{{vacancies}}', html)
        .replace('{{companies}}', companyOptions);

    if (!fs.existsSync(`${__dirname}/public`)) {
        fs.mkdirSync(`${__dirname}/public`);
    }

    fs.writeFileSync(`${__dirname}/public/index.html`, result);
}

const renderVacancy = (vacancy) => {
    const { company, location, title, description, url } = vacancy;
    return `
        <div class="vacancy" data-company="${company}" data-title="${title}" data-description="${description || ''}">
            <h2>${title}</h2>
            <h3>${company}</h3>
            ${description && description.trim() ? `<p>${description}</p>` : ''}
            <p>${location}</p>
            <a href="${url}" target="_blank" rel="noopener noreferrer">Open</a>
        </div>
    `
}
