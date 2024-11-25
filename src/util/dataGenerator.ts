import { format } from 'date-fns';

function generateRandomDate(year:any, month:any) {
  const date = new Date(year, month, 1);
  date.setDate(Math.floor(Math.random() * 31) + 1);
  return date;
}

function modifyDates(baseEntry:any) {
  const modifyTime = (date: any, hours: any, minutes:any) => {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const randomDate = generateRandomDate(2024, 9); // October is month 9 (0-indexed)

  return {
    ...baseEntry,
    date: randomDate,
    timeInAM: modifyTime(randomDate, 8, 0),
    timeOutAM: modifyTime(randomDate, 11, 0),
    timeInPM: modifyTime(randomDate, 13, 0),
    timeOutPM: modifyTime(randomDate, 18, 0),
    createdAt: randomDate,
    updatedAt: randomDate
  };
}

function generateEntries(count:any) {
  const baseEntry = {
    user: "66def75c5296eb3c2b6691ad",
    company: "671b68eeb016b96dc2ee21b3",
    timeInImgAM: "https://firebasestorage.googleapis.com/v0/b/facerecognition-dc4e7.appspot.com/o/images%2Fprofile%2F66def75c5296eb3c2b6691ad_daryll%20alvarez_APPROVED%20(0.4)_2?alt=media&token=3edd6ecd-547b-4977-b1a1-c2a68edc7489",
    timeOutImgAM: "https://firebasestorage.googleapis.com/v0/b/facerecognition-dc4e7.appspot.com/o/images%2Fprofile%2F66def75c5296eb3c2b6691ad_daryll%20alvarez_APPROVED%20(0.39)_2?alt=media&token=4aed26fb-26d2-4466-8d27-05ee5f41a58d",
    timeInImgPM: "https://firebasestorage.googleapis.com/v0/b/facerecognition-dc4e7.appspot.com/o/images%2Fprofile%2F66def75c5296eb3c2b6691ad_daryll%20alvarez_APPROVED%20(0.43)_2?alt=media&token=0650b670-5720-4f5d-a995-046b92389094",
    timeOutImgPM: "https://firebasestorage.googleapis.com/v0/b/facerecognition-dc4e7.appspot.com/o/images%2Fprofile%2F66def75c5296eb3c2b6691ad_daryll%20alvarez_APPROVED%20(0.39)_2?alt=media&token=5a23c1b6-e43c-4d63-919b-13831612a385"
  };

  return Array.from({ length: count }, () => modifyDates(baseEntry));
}

// Example of how to use this data with Mongoose
import mongoose from 'mongoose';
import userAttendanceSchema from '../models/userAttendanceSchema';

export function run(){

// Generate 10 entries (you can change this number)
const numberOfEntries = 65;
const generatedData = generateEntries(numberOfEntries);

// Format dates for display (optional, remove if not needed)
const formattedData = generatedData.map(entry => ({
  ...entry,
  date: format(entry.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  timeInAM: format(entry.timeInAM, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  timeOutAM: format(entry.timeOutAM, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  timeInPM: format(entry.timeInPM, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  timeOutPM: format(entry.timeOutPM, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  createdAt: format(entry.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  updatedAt: format(entry.updatedAt, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
}));
console.log(JSON.stringify(formattedData))
  // Insert the generated data
  userAttendanceSchema.insertMany(generatedData)
    .then(() => console.log('Data inserted successfully'))
    .catch(err => console.error('Error inserting data:', err));
  
}