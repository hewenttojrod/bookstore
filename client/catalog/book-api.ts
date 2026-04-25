import { fetchWithRetry } from "@/utils/api-fetch";

export const BOOK_LIST_ENDPOINT = "/api/bookstore/book_list/";
export const BOOK_ENTRY_ENDPOINT = "/api/bookstore/book/";
export const BOOK_GENRES_ENDPOINT = "/api/bookstore/book/book_genres/";

export type BookGenreOption = {
	value: string;
	label: string;
};

export async function fetchBookGenreOptions(signal?: AbortSignal): Promise<BookGenreOption[]> {
	const response = await fetchWithRetry(BOOK_GENRES_ENDPOINT, { signal });
	if (!response.ok) {
		throw new Error(`Failed to load genres: ${response.status} ${response.statusText}`);
	}

	const payload = (await response.json()) as BookGenreOption[];
	return payload;
}

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
