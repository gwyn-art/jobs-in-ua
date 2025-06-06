import { parser } from "../parser/index.js";

export const crawl = async (sourceList) => {
    return Promise.all(sourceList.map(async (source) => {
        const { company, url, type } = source;

        const content = await fetch(url).then((res) => {
            if (type === 'text') {
                return res.text();
            }

            return res.json();
        });

        const vacancies = parser(company, content, url, type);

        return vacancies;
    })).then((vacancies) => vacancies.flat())
}
