export interface GetImageWithFileNameRequest {
    path: string;
    fileName: string;
}

export interface PostFileUploadsRequest {
    files: Blob;
}

export type PostFileUploadsResponse = string[];

export type GetImageWithFileNameResponse = Blob;
