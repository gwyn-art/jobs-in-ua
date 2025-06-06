import { parse } from "node-html-parser";

/**
 * @param {HTMLElement} root 
 */
const LUN = (root, rootUrl) => {
    const anchors = [...root.getElementsByTagName('a')]

    const vacancies = anchors.filter((a) => a.getAttribute('href').includes('/vacancies/'));

    return vacancies.map((a) => {
        const content = a.children[0];

        const location = content.children[0].textContent;
        const title = content.children[1].children[0].textContent;
        const description = content.children[1].children[1].textContent;
        const url = a.getAttribute('href');

        return {
            location,
            title,
            description,
            url: rootUrl + url
        }
    })
}

const LYFT = (root) => {
    const { jobs } = root;

    const kyivJobs = jobs.filter((job) => job.location.name === 'Kyiv, Ukraine');

    return kyivJobs.map((job) => {
        const { title, location, absolute_url } = job;

        return {
            location: location.name,
            title,
            description: null,
            url: absolute_url
        }
    })
}


const parsers = {
    LUN,
    LYFT
}

/**
 * 
 * @param {string} company 
 * @param {string} content 
 * @param {string} rootUrl 
 * @param {'text' | 'json'} type 
 */
export const parser = (company, content, rootUrl, type) => {
    const root = type === 'text' ? parse(content) : content;

    const parser = parsers[company];

    if (!parser) {
        throw new Error(`Parser for ${company} not found`);
    }

    return parser(root, rootUrl).map(v => ({ ...v, company, url: v.url }));
}
