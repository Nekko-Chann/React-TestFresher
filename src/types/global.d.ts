export {};

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            role: string;
            avatar: string;
        }
    }

    interface IRegister {
        _id: string;
        fullName: string;
        email: string;
    }

    interface IUser {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
    }
}
