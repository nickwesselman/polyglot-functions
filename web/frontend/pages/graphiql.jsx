import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import { useAuthenticatedFetch } from "../hooks";

import 'graphiql/graphiql.css';

export default function GraphiqlPage() {
    const authenticatedFetch = useAuthenticatedFetch();

    const fetcher = createGraphiQLFetcher({
        url: '/api/graphiql',
        fetch: authenticatedFetch
    });

    const css = `
        #app {
            height: 100%;
        }
        #app > div {
            height: 100%;
        }
    `;

    return <>
        <style>{css}</style>
        <GraphiQL fetcher={fetcher} />
    </>;
}