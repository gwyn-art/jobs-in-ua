import fs from 'fs'
import { SELECT_ALL } from '../neon/select_vacancy.js'
import { sqlConnect } from '../neon/index.js'

const __dirname = process.cwd();

const isTechJob = (title, description, company) => {
    const techKeywords = [
        // Programming languages
        'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 'typescript', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift', 'c++', 'c#', '.net',
        // Technologies & Frameworks
        'aws', 'azure', 'docker', 'kubernetes', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
        'api', 'rest', 'graphql', 'microservices', 'devops', 'ci/cd', 'git', 'github', 'gitlab',
        // Job roles
        'developer', 'programmer', 'engineer', 'software', 'frontend', 'backend', 'fullstack', 'full-stack',
        'devops', 'sysadmin', 'architect', 'tech lead', 'cto', 'data scientist', 'analyst',
        'qa', 'tester', 'automation', 'mobile', 'web', 'ui/ux', 'product manager',
        // Tech domains
        'ai', 'machine learning', 'blockchain', 'crypto', 'fintech', 'saas', 'cloud', 'cybersecurity',
        'big data', 'analytics', 'database', 'infrastructure', 'network', 'system'
    ];
    
    const techCompanies = [
        'google', 'microsoft', 'apple', 'meta', 'amazon', 'netflix', 'uber', 'airbnb',
        'stripe', 'gitlab', 'github', 'atlassian', 'slack', 'zoom', 'dropbox',
        'salesforce', 'oracle', 'adobe', 'nvidia', 'intel', 'amd'
    ];
    
    const text = `${title} ${description} ${company}`.toLowerCase();
    
    // Check for tech keywords
    const hasKeywords = techKeywords.some(keyword => text.includes(keyword));
    
    // Check for tech companies
    const isTechCompany = techCompanies.some(techCompany => 
        company.toLowerCase().includes(techCompany)
    );
    
    return hasKeywords || isTechCompany;
};

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
    const isTech = isTechJob(title, description || '', company);
    
    return `
        <div class="vacancy" data-company="${company}" data-title="${title}" data-description="${description || ''}" data-tech="${isTech}">
            <h2>${title}</h2>
            <h3>${company}</h3>
            ${description && description.trim() ? `<p>${description}</p>` : ''}
            <p>${location}</p>
            <a href="${url}" target="_blank" rel="noopener noreferrer">Open</a>
        </div>
    `
}
