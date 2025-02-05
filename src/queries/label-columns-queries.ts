import { gql, TypedDocumentNode } from "@apollo/client/core";
import { GetLabels, GetLabelsVariables, GetLabels_repository_labels_nodes } from "./schema/GetLabels";
import { GetProjectColumns } from "./schema/GetProjectColumns";
import { client } from "../graphql-client";
import { noNullish } from "../util/util";

export { getLabels, GetProjectColumns };

const GetLabelsQuery: TypedDocumentNode<GetLabels, GetLabelsVariables> = gql`
query GetLabels($endCursor: String) {
  repository(name: "language", owner: "OfficialPawBot") {
    id
    labels(first: 100, after: $endCursor) {
      nodes {
        id
        name
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;

async function getLabels() {
    const labels: GetLabels_repository_labels_nodes[] = [];
    let endCursor: string | undefined | null;
    while (true) {
        const result = await client.query({
            query: GetLabelsQuery,
            fetchPolicy: "no-cache",
            variables: { endCursor },
        });
        const someLabels = result.data.repository?.labels;
        labels.push(...noNullish(someLabels?.nodes));
        if (!someLabels?.pageInfo.hasNextPage) return labels;
        endCursor = someLabels.pageInfo.endCursor;
    }
}

const GetProjectColumns: TypedDocumentNode<GetProjectColumns, never> = gql`
query GetProjectColumns {
  repository(name:"language", owner:"OfficialPawBot") {
    id
    project(number: 1) {
      id
      columns(first: 30) {
        nodes {
          id
          name
        }
      }
    }
  }
}`;
