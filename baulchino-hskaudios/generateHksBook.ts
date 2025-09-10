import {
  Book,
  createBook,
  createLesson,
  createAudioTrack,
} from './hskaudio.types';

import fs from 'fs';

type uploadThingJson = {
  name: string;
  key: string;
  customId?: string;
  url: string;
  size: number;
  uploadedAt: string;
};

//mandatory params
//file.json nameofbook
if (!process.argv[2]) {
  throw new Error('Missing .json file as second argument');
}

if (!process.argv[3]) {
  throw new Error('Missing name of book as third argument');
}

console.log('this is a script');

console.log(process.argv[2]);

const jsonFile = process.argv[2];
const bookName = process.argv[3];

const data: uploadThingJson[] = require(`./${jsonFile}`);

console.log('Parsed data');
console.log(data[0].name);

//Attempt to extract lessons
const dataNames = data.map((item) => item.name);

const splitedNames = dataNames.map((fileName) => fileName.split('-')[2]);

const lessonDuplicatedNumbers = splitedNames.map((lessonNames) =>
  lessonNames.substring(0, 2)
);

const filterLessonNumbers = [...new Set(lessonDuplicatedNumbers)];

console.log('Trying to get the lesson names');
console.log(dataNames);

const book: Book = createBook(
  bookName,
  filterLessonNumbers.map((lesson) =>
    createLesson(
      `${bookName} - ${lesson}`,
      data.map((uploadThingItem) =>
        createAudioTrack(
          `Lesson - ${uploadThingItem.name.split('-')[2]}`,
          uploadThingItem.name,
          uploadThingItem.url
        )
      )
    )
  )
);

const jsonString = JSON.stringify(book, null, 2);

fs.writeFile('output.json', jsonString, (error) => {
  if (error) {
    console.error('Error writing file: ', error);
  } else {
    console.log('Succes on writing file');
  }
});
