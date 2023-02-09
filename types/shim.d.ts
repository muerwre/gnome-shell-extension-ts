declare module "fill-pot-po" {
    declare function sync(props: {
        destDir: string;
        logResults: boolean;
        poSources: string[];
        potSources: string[];
        writeFiles: boolean;
    }): void;
}
