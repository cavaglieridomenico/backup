import { UserInputError } from "@vtex/api"

export function paginationArgsToHeaders( page: number, pageSize: number) {
    if (page < 1) {
        throw new UserInputError('Smallest page value is 1')
    }
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return `resources=${startIndex}-${endIndex}`
    
}