


export function createResourceName(identifier: string): string {
    return `${identifier}-lambda`;
}

export function createLogGroupName(identifier: string): string {
    return `/todo-app/lambda/${createResourceName(identifier)}-log-group`;
}