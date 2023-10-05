
export interface IPaginateResponse<T>{
    data: {
        content: T, 
        totalCount: number,
    },
    message: string,
    statusCode: number

}