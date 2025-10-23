import fs from 'fs';
import { MockTestBundle } from './hskmocktestbundle.types';

type uploadThingJson = {
  name: string;
  key: string;
  customId?: string;
  url: string;
  size: number;
  uploadedAt: string;
};

if (!process.argv[2]) {
  throw new Error('Missing .json File');
}

if (!process.argv[3]) {
  throw new Error('Missing Output file name');
}

const jsonFile = process.argv[2];
const outputFilename = process.argv[3];

const data: uploadThingJson[] = require(`./${jsonFile}`);

const mockTestBundle: MockTestBundle[] = data
  .map((item) => {
    //mock-test-HSK1-H11330.zip
    //TO
    //HSK1-H11330
    const title = item.name.split('-').splice(2, 2).join('-').split('.')[0];

    return {
      title,
      filename: item.name,
      url: item.url,
    };
  })
  .sort((a, b) => {
    //HSK1-H11330
    //TO
    //11330
    const titleA = parseInt(a.title.split('-').splice(1, 1)[0].slice(1));
    const titleB = parseInt(b.title.split('-').splice(1, 1)[0].slice(1));

    return titleA - titleB;
  });

const jsonString = JSON.stringify(mockTestBundle, null, 2);

fs.writeFile(outputFilename, jsonString, (error) => {
  if (error) {
    console.error('Error writing file:', error);
  }
});
