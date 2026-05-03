/**
 * Bookstore module home/landing page.
 * Currently displays a simple welcome message.
 * Can be expanded with module overview, statistics, or quick actions.
 */
import FormBody from "@templates/form-body";

export default function BookstoreHome() {
  return (
    <FormBody title="Bookstore">
      <p className="body-text">
        You are in Bookstore Home!
      </p>
    </FormBody>
  );
}
