declare module "*.png" {
    const value: any;
    export = value;
 }

 declare module "parse-torrent-name" {
    export interface Tv {
        season: number,
        episode: number,
        resolution: string,
        quality: string,
        codec: string,
        group: string,
        title: string
    }
    
    export interface Movie {
        year: number,
        resolution: string,
        quality: string,
        codec: string,
        group: string,
        title: string
    }

    function ptn(input: string): Tv | Movie;

    export default ptn;
}