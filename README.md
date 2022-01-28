# avro schema registry typescript codegen

Typescript types from avro schema registry

## why

Defining your message types in an avro schema can be very useful, since it gives you a central definition of your event-driven api. To fully benefit from your avro types in typescript, it is necessary to generate typescript types from it. There are tools like `avro-typescript` that can do that for you. This library/cli is just a small wrapper around `avro-typescript` that allows you to fetch the full schema from an avro schema registry (e.g. confluent or redpanda), convert it to typescript types and write write them to a file so you can use them in your code.

## usage

You can ether use this package via its cli or as a library in your code.

### cli

`avro-sr-codegen get [--output] url`
If you supply an output.ts file, your files will be written to this file. If not, to STDOUT.

### library

```
import { generateSchema } from 'avro-sr-codegen'

generateSchema({ 'http://localhost:8081', 'kafkaTypes.ts' })
```

If no output path is provided, generate schema returns the schema as string.

Authorization headers can be added to the request via the `headers` parameter.
