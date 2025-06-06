import { crawlVacancies } from "../crawler/index.js";
import { sqlConnect } from '../neon/index.js'
import { insertVacancy } from '../neon/insert_vacancy.js'

export const updateWorkList = async () => {
    const vacancies = await crawlVacancies()

    const sql = sqlConnect();
    
    const isDryRun = process.argv.includes('--dry-run');
    
    if (isDryRun) {
        console.log(vacancies);
        return;
    }
    
    await Promise.all(vacancies.map(vacancy => insertVacancy(sql, vacancy)))
}
