import type { CodegenConfig } from '@graphql-codegen/cli';

// DateTime and Time are pass-through scalars on the server, serialized as
// ISO-8601 strings.
const scalars = {
    DateTime: 'string',
    Time: 'string',
};

const config: CodegenConfig = {
    // Read the SDL directly -- no running server required.
    schema: '../server/schema/*.graphql',
    documents: ['src/graphql/**/*.graphql'],
    generates: {
        // Split across two files on purpose: typescript-operations re-declares
        // every enum its operations touch, which collides with the typescript
        // plugin if both land in one file. Separate files keep each
        // self-contained -- a couple of enum unions appear in both, which is
        // redundant but harmless.
        //
        // Schema types: every type/enum/input in the SDL, whether or not an
        // operation uses it.
        'src/generated/schema-types.ts': {
            plugins: ['typescript'],
            config: { scalars, enumsAsTypes: true },
        },
        // Operation types plus the typed documents to pass to useQuery.
        'src/generated/graphql.ts': {
            plugins: ['typescript-operations', 'typed-document-node'],
            config: {
                scalars,
                enumsAsTypes: true,
                avoidOptionals: { field: true },
            },
        },
    },
};

export default config;
