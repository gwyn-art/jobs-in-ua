import dotenv from 'dotenv'
import { updateWorkList } from './update_work_list.js'
import { buildSite } from './build_site.js'
dotenv.config()

const run = () => {
    const command = process.argv[2]

    if (!command) {
        throw new Error('Command is not provided.')
    }

    switch (command) {
        case 'update':
            updateWorkList()
            break;
        case 'build':
            buildSite()
            break;
        default:
            throw new Error(`Provided unkown command: ${command}`)
    }
}

run()
