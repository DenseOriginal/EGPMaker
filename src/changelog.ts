export const version: number = 1;

// Any changelog item contains a new features,
// And an optional fixed features
// Both features and fixes are string stored in array
// So that they can be read as individual string
export interface IChangelogItem {
    new?: string[],
    fixed?: string[],
    version: number
}

export const changelog: IChangelogItem[] = [
    {
        version: 1,
        new: ['Everything']
    }
]