export const contactKeys = {
    all: ['contacts'] as const,
    list: () => [...contactKeys.all, 'list'] as const,
    detail: (id: number) => [...contactKeys.all, 'detail', id] as const,
};

export const leadKeys = {
    all: ['leads'] as const,
    list: () => [...leadKeys.all, 'list'] as const,
    detail: (id: number) => [...leadKeys.all, 'detail', id] as const,
};

export const opportunityKeys = {
    all: ['opportunities'] as const,
    list: () => [...opportunityKeys.all, 'list'] as const,
    stages: () => [...opportunityKeys.all, 'stages'] as const,
    detail: (id: number) => [...opportunityKeys.all, 'detail', id] as const,
};

export const activityKeys = {
    all: ['activities'] as const,
    list: () => [...activityKeys.all, 'list'] as const,
    detail: (id: number) => [...activityKeys.all, 'detail', id] as const,
};





export const userKeys = {
    all: ['users'] as const,
    list: () => [...userKeys.all, 'list'] as const,
    detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};

export const roleKeys = {
    all: ['roles'] as const,
    list: () => [...roleKeys.all, 'list'] as const,
    detail: (id: number) => [...roleKeys.all, 'detail', id] as const,
};

export const permissionKeys = {
    all: ['permissions'] as const,
    list: () => [...permissionKeys.all, 'list'] as const,
    detail: (id: number) => [...permissionKeys.all, 'detail', id] as const,
};
