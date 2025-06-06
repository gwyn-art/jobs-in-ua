

export const insertVacancy = async (sql, vacancy) => {
    const { company, location, title, description, url } = vacancy;
    await sql`
        INSERT INTO vacancies (company, location, title, description, url)
        VALUES (${company}, ${location}, ${title}, ${description}, ${url})
        ON CONFLICT (url) DO UPDATE
        SET company=${company}, location=${location}, title=${title}, description=${description}
    `;
}