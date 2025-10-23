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

const jsonFile = process.argv[2];
const bookName = process.argv[3];

const data: uploadThingJson[] = require(`./${jsonFile}`);

//Attempt to extract lessons
const dataNames = data.map((item) => item.name);

const splitedNames = dataNames.map((fileName) => fileName.split('-')[2]);

const lessonDuplicatedNumbers = splitedNames.map((lessonNames) =>
  lessonNames.substring(0, 2)
);

const filterLessonNumbers = [...new Set(lessonDuplicatedNumbers)];

const book: Book = createBook(
  bookName,
  filterLessonNumbers
    .map((lesson) =>
      createLesson(
        `${bookName} - Lesson ${lesson}`,
        data
          .map((uploadThingItem) => {
            //hsk5B-textbook-1901.mp3
            const audiotrack = uploadThingItem.name.split('-')[2].split('.')[0];

            return createAudioTrack(
              `Lesson - ${audiotrack}`,
              uploadThingItem.name,
              uploadThingItem.url
            );
          })
          .filter((audiotrack) => {
            const audiotrackNumber = audiotrack.title
              .split('-')[1]
              .trim()
              .substring(0, 2);

            return audiotrackNumber.includes(lesson);
          })
          .sort((a, b) => {
            const audiotrackA = parseInt(a.title.split('-')[1].trim());
            const audiotrackB = parseInt(b.title.split('-')[1].trim());

            return audiotrackA - audiotrackB;
          })
      )
    )
    .reverse()
);

const jsonString = JSON.stringify(book, null, 2);

fs.writeFile('output.json', jsonString, (error) => {
  if (error) {
    console.error('Error writing file: ', error);
  } else {
    console.log('Succes on writing file');
  }
});
