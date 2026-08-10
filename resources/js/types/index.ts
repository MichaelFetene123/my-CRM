import { type InertiaConfig } from '@inertiajs/core';

export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './models';

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & InertiaConfig['sharedPageProps'];
