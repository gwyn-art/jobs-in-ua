import { neon } from "@neondatabase/serverless";

export const sqlConnect = () => {
    const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
    console.log(PGHOST, PGDATABASE, PGUSER, PGPASSWORD)
    return neon(
        `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
    );
}
