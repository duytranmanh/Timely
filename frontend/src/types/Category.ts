export type Category = {
    id: number,
    name: string,
    is_default: boolean,
    description?: string,
    color: string,
    user?: number | null
}