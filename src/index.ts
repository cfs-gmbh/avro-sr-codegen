import { avroToTypeScript, RecordType } from 'avro-typescript';
import axios from 'axios';
import * as fs from 'fs';
import * as util from 'util';

type Config = SchemaRegistryConnectionConfig & {
  outputPath?: string;
};

type SchemaRegistryConnectionConfig = {
  url: string;
  headers?: Record<string, string>;
};

export async function generateSchema({ url, headers, outputPath }: Config) {
  const { data: subjects } = await axios.get<string[]>(`${url}/subjects`, {
    headers,
  });

  const tsTypes = (
    await Promise.all<string>(
      subjects
        .map(
          async (subject: string) =>
            (
              await axios.get<{ id: number }>(
                `${url}/subjects/${subject}/versions/latest`,
                { headers }
              )
            ).data.id
        )
        .map(
          async (id: Promise<number>) =>
            (
              await axios.get<{ schema: string }>(
                `${url}/schemas/ids/${await id}`,
                { headers }
              )
            ).data.schema
        )
    )
  )
    .map(schemaString => JSON.parse(schemaString) as RecordType)
    .map(schema => avroToTypeScript(schema))
    .map(tsSchema => tsSchema.split('\n\n'))
    .flat()
    .sort((a, b) => a.split(' ')[2].localeCompare(b.split(' ')[2]))
    .join('\n');

  if (outputPath) {
    const writeFilePromise = util.promisify(fs.writeFile);
    return writeFilePromise(outputPath, tsTypes);
  } else {
    return tsTypes;
  }
}
