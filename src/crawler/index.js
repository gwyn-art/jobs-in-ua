import { sourceList } from "./source_list.js";
import { crawl } from "./crawler.js";

export const crawlVacancies = () => crawl(sourceList);
