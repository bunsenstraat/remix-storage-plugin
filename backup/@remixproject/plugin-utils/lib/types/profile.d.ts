import { MethodKey, Api, ApiMap, EventKey } from './api';
/** Describe a plugin */
export interface Profile<T extends Api = any> {
    name: string;
    displayName?: string;
    methods?: MethodKey<T>[];
    permission?: boolean;
    hash?: string;
    description?: string;
    documentation?: string;
    version?: string;
}
export interface LocationProfile {
    location: string;
}
export interface ExternalProfile {
    url: string;
}
export interface HostProfile extends Profile {
    methods: ('addView' | 'removeView' | 'focus' | string)[];
}
export interface LibraryProfile<T extends Api = any> extends Profile<T> {
    events?: EventKey<T>[];
    notifications?: {
        [name: string]: string[];
    };
}
/** A map of profile */
export declare type ProfileMap<T extends ApiMap> = Partial<{
    [name in keyof T]: Profile<T[name]>;
}>;
/** Extract the API of a profile */
export declare type ApiFromProfile<T> = T extends Profile<infer I> ? I : never;
/** Create an ApiMap from a Profile Map */
export declare type ApiMapFromProfileMap<T extends ProfileMap<any>> = {
    [name in keyof T]: ApiFromProfile<T[name]>;
};
/** Transform an ApiMap into a profile map */
export declare type ProfileMapFromApiMap<T extends ApiMap> = Readonly<{
    [name in keyof T]: Profile<T[name]>;
}>;