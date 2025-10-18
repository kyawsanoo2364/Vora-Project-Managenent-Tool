export const fetchGraphQL = async (
  query: string,
  variables: Record<string, any> = {},
  options?: RequestInit,
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("GraphQL Error Response:", errorText);
    throw new Error("Failed to fetch Graphql");
  }
  const result = await res.json();

  if (result.errors) {
    console.log("GraphQL Response:", result); // debug full body
    throw new Error(
      result.errors?.[0]?.message ||
        `GraphQL request failed: ${res.statusText}`,
    );
  }

  return result.data;
};
