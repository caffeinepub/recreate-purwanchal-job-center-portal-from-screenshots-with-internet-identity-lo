import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Application {
    id: bigint;
    status: ApplicationStatus;
    resume?: ExternalBlob;
    appliedAt: Time;
    user: Principal;
    jobId: bigint;
    coverLetter: string;
}
export type Time = bigint;
export interface JobVacancy {
    id: bigint;
    title: string;
    postedAt: Time;
    description: string;
    salaryRange: string;
    requirements: Array<string>;
}
export interface SearchableUserProfile {
    principal: Principal;
    email: string;
    lastName: string;
    firstName: string;
}
export interface Post {
    id: bigint;
    title: string;
    content: string;
    createdAt: Time;
    author: Principal;
    image?: ExternalBlob;
}
export interface Message {
    id: bigint;
    content: string;
    sender: Principal;
    sentAt: Time;
    receiver: Principal;
}
export interface UserProfile {
    resume?: ExternalBlob;
    email: string;
    lastName: string;
    firstName: string;
}
export enum ApplicationStatus {
    pending = "pending",
    rejected = "rejected",
    reviewed = "reviewed",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyForJob(jobId: bigint, coverLetter: string, resume: ExternalBlob | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authorizedUserSearch(_adminPassword: string, searchTerm: string | null): Promise<Array<SearchableUserProfile>>;
    createJobVacancy(vacancy: JobVacancy, _adminPassword: string): Promise<bigint>;
    createPost(title: string, content: string, image: ExternalBlob | null, _adminPassword: string): Promise<bigint>;
    deleteJobVacancy(jobId: bigint, _adminPassword: string): Promise<void>;
    deletePost(postId: bigint, _adminPassword: string): Promise<void>;
    getAllApplications(): Promise<Array<Application>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInbox(): Promise<Array<Message>>;
    getJobVacancies(): Promise<Array<JobVacancy>>;
    getJobVacancy(jobId: bigint): Promise<JobVacancy>;
    getMyApplications(): Promise<Array<Application>>;
    getPosts(): Promise<Array<Post>>;
    getSentMessages(): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchJobVacancies(searchTerm: string | null): Promise<Array<JobVacancy>>;
    sendMessage(receiver: Principal, content: string): Promise<bigint>;
    updateApplicationStatus(appId: bigint, status: ApplicationStatus): Promise<void>;
    updateJobVacancy(jobId: bigint, vacancy: JobVacancy, _adminPassword: string): Promise<void>;
    updatePost(postId: bigint, title: string, content: string, image: ExternalBlob | null, _adminPassword: string): Promise<void>;
}
