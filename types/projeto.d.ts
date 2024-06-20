declare namespace Projeto {
    type emptyMachine = {
        id?: string;
        code?: string;
        name: string;
        image?: string;
        category?: string;
        status?: string;
        [key: string]: string | string[] | number | boolean | undefined;
    };
}