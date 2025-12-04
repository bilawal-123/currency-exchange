// Type declarations for non-TS static imports
declare module "*.css" {
    const content: { [className: string]: string };
    export default content;
}


