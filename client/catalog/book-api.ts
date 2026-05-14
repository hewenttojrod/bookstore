/**
 * Bookstore API endpoint constants and helper functions.
 * Provides type-safe access to the Bookstore backend REST API.
 */

import { fetchWithRetry } from "@/utils/api-fetch";
import { parseJsonResponse } from "@/utils/api-json";

/**
 * REST API endpoints for book operations.
 * - BOOK_LIST_ENDPOINT: GET list of books (pagination)
 * - BOOK_ENTRY_ENDPOINT: POST (create), PATCH (update), DELETE (delete single)
 * - BOOK_GENRES_ENDPOINT: GET list of available genre options
 */
export const BOOK_LIST_ENDPOINT = "/api/bookstore/book_list/";
export const BOOK_ENTRY_ENDPOINT = "/api/bookstore/book/";
export const BOOK_GENRES_ENDPOINT = "/api/bookstore/book/book_genres/";

/**
 * Genre option type for select fields.
 * @property value - Genre code/identifier (e.g., "fiction", "non-fiction")
 * @property label - Display name for the genre
 */
export type BookGenreOption = {
	value: string;
	label: string;
};

/**
 * Fetches available genre options from the backend.
 * Used to populate select fields in add/edit forms.
 * 
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise<BookGenreOption[]> - Array of genre options
 * @throws Error if fetch fails or response is non-2xx
 */
export async function fetchBookGenreOptions(signal?: AbortSignal): Promise<BookGenreOption[]> {
	const response = await fetchWithRetry(BOOK_GENRES_ENDPOINT, { signal });
	return parseJsonResponse<BookGenreOption[]>(response);
}

/**
 * Deletes a single book by ID via DELETE request.
 * 
 * @param bookId - The book_id of the record to delete
 * @param signal - Optional AbortSignal for request cancellation
 * @throws Error if delete fails or response is non-2xx (except 204 No Content)
 */
export async function deleteBookById(bookId: number, signal?: AbortSignal): Promise<void> {
	const url = new URL(BOOK_ENTRY_ENDPOINT, window.location.origin);
	url.searchParams.set("id", String(bookId));

	const response = await fetchWithRetry(url.toString(), {
		method: "DELETE",
		signal,
	});

	if (!response.ok) {
		throw new Error(`Failed to delete book: ${response.status} ${response.statusText}`);
	}
}
