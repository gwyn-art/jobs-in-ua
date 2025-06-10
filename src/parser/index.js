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

const GRAMMARLY = (root) => {
    const jobs = [];
    
    if (root.departments && Array.isArray(root.departments)) {
        for (const department of root.departments) {
            if (department.jobs && Array.isArray(department.jobs) && department.jobs.length > 0) {
                for (const job of department.jobs) {
                    const parsedJob = {
                        location: formatGrammarlyLocation(job.location),
                        title: job.title || 'Unknown Position',
                        description: formatGrammarlyDescription(job),
                        url: job.absolute_url || ''
                    };

                    const locationCmpr = parsedJob.location.toLowerCase();
                    if (!parsedJob.title || (!locationCmpr.includes('kyiv') && !locationCmpr.includes('ukraine'))) {
                        continue;
                    }

                    jobs.push(parsedJob);
                }
            }
        }
    }

    return jobs;
}

const formatGrammarlyLocation = (locationData) => {
    if (!locationData) return 'Remote';

    if (typeof locationData === 'string') {
        return locationData;
    }

    if (locationData.name) {
        const location = locationData.name;
        const isHybrid = locationData.hybrid || false;
        return isHybrid ? `${location} (Hybrid)` : location;
    }

    return 'Remote';
};

const formatGrammarlyDescription = (job) => {
    const parts = [];

    if (job.metadata?.department) {
        parts.push(`Department: ${job.metadata.department}`);
    }

    if (job.metadata?.job_level) {
        parts.push(`Level: ${job.metadata.job_level}`);
    }

    if (job.first_published) {
        const publishDate = new Date(job.first_published).toLocaleDateString();
        parts.push(`Posted: ${publishDate}`);
    }

    return parts.length > 0 ? parts.join(' | ') : null;
};


const parsers = {
    LUN,
    LYFT,
    GRAMMARLY
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
