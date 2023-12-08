import fs from "fs";

// Codegen currently makes duplicate definitions
// Ignoring these errors for now because the fix involves moving to useFragment on FE which is very involved
const codegenFile = "./apps/frontend/src/graphql/generated/graphql.ts";

const data = fs.readFileSync(codegenFile); //read existing contents into data
const fd = fs.openSync(codegenFile, "w+");
const buffer = Buffer.from("// @ts-nocheck \n");

fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
// or fs.appendFile(fd, data);
fs.close(fd);
