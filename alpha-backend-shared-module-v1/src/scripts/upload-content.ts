import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { config as dotenvConfig } from 'dotenv';
import { DatabaseModule } from '../database';
import { Habit, Lesson, Theme } from '../database/entities';
import { IDatabaseConfig } from '../database/interfaces/IDatabaseConfig.interface';
import { In } from 'typeorm';
import { lessonService } from '../database/services';

// Load environment variables from .env
dotenvConfig();

const dbConfig: IDatabaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function initializeDatabase() {
    try {
        await DatabaseModule.initialize(dbConfig)
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

async function uploadLessonFromCSV(csvFilePath: string) {
    const lessons = [];

    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
            const lesson = new Lesson();

            lesson.lessonCode = parseInt(row.lessonCode, 10);
            lesson.status = row.status || 'ACTIVE';
            lesson.isPublished = row.isPublished === 'true';
            lesson.duration = parseFloat(row.duration);
            lesson.points = parseFloat(row.points);

            lesson.lessonTags = row.lessonTags
                .split(',')
                .map((tagEntry: string) => {
                    const [tag, terms] = tagEntry.split(':');
                    return { [tag]: terms.split(';') };
                });

            lesson.internalNotes = row.internalNotes || null;
            lesson.coverImage = row.coverImage || null;
            lesson.name = row.name;
            lesson.description = row.description || null;

            const screenData = [];
            let scIndex = 1;
            while (row[`sc_${scIndex}_type`]) {
                screenData.push({
                    type: row[`sc_${scIndex}_type`],
                    media: row[`sc_${scIndex}_media`],
                    order: parseInt(row[`sc_${scIndex}_order`]),
                    content: row[`sc_${scIndex}_content`],
                    subTitle: row[`sc_${scIndex}_subTitle`],
                });
                scIndex++;
            }

            lesson.screenData = screenData;

            const quizData = [];
            let qzIndex = 1;
            while (row[`qz_${qzIndex}_question`]) {
                const options = [];
                let optIndex = 1;
                while (row[`qz_${qzIndex}_ans_opt_${optIndex}`]) {
                    options.push({
                        id: optIndex,
                        option: row[`qz_${qzIndex}_ans_opt_${optIndex}`],
                        isCorrect: row[`qz_${qzIndex}_ans_opt_${optIndex}_isCorrect`] === 'true',
                    });
                    optIndex++;
                }

                quizData.push({
                    id: qzIndex,
                    question: row[`qz_${qzIndex}_question`],
                    answer: options.find((opt) => opt.isCorrect).option,
                    userInstructions: row[`qz_${qzIndex}_userInstructions`],
                    quizName: row[`qz_${qzIndex}_quizName`],
                    type: row[`qz_${qzIndex}_type`],
                    min: parseInt(row[`qz_${qzIndex}_min`]),
                    max: parseInt(row[`qz_${qzIndex}_max`]),
                    options: options,
                });

                qzIndex++;
            }

            lesson.quizData = quizData;

            const freeTextQuiz = [];
            let fqIndex = 1;
            while (row[`fq_${fqIndex}_question`]) {
                freeTextQuiz.push({
                    id: fqIndex,
                    question: row[`fq_${fqIndex}_question`],
                    answer: row[`fq_${fqIndex}_answer`],
                    userInstructions: row[`fq_${fqIndex}_userInstructions`],
                    quizName: row[`fq_${fqIndex}_quizName`],
                    type: row[`fq_${fqIndex}_type`],
                });
                fqIndex++;
            }

            lesson.freeTextQuiz = freeTextQuiz;

            lessons.push(lesson);
        })
        .on('end', async () => {
            try {
                await lessonService.bulkUpdateLesson(lessons);
                console.log('Lessons have been successfully uploaded.');
            } catch (error) {
                console.error('Error saving lessons to the database:', error);
            }
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
        });
}

async function uploadThemeFromCSV(csvFilePath: string) {
    const themes = [];
    const habits = [];

    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
            const theme = new Theme();
            theme.themeCode = parseInt(row.themeCode, 10);
            theme.internalNotes = row.internalNotes || null;
            theme.name = row.name;
            theme.image = row.image || null;
            theme.description = row.description || null;
            theme.status = row.status || 'ACTIVE';
            theme.isPublished = row.isPublished === 'true';

            themes.push(theme);  // Add the theme to the array

            // Store habit information without themeId for now
            let habitIdx = 1;
            while (row[`hb_${habitIdx}_name`]) {
                habits.push({
                    name: row[`hb_${habitIdx}_name`],
                    timeAllocation: row[`hb_${habitIdx}_timeAllocation`],
                    pointAllocation: row[`hb_${habitIdx}_pointAllocation`],
                    instruction: row[`hb_${habitIdx}_instruction`],
                    order: row[`hb_${habitIdx}_order`],
                    description: row[`hb_${habitIdx}_description`],
                    themeTempId: themes.length - 1 // Temporarily store the index of the theme in the array
                });
                habitIdx++;
            }
        })
        .on('end', async () => {
            try {
                // Step 1: Save all themes first
                const savedThemes = await DatabaseModule.getRepository(Theme).save(themes);

                // Step 2: Now associate each habit with the correct themeId
                habits.forEach((habit, index) => {
                    const correspondingTheme = savedThemes[habit.themeTempId];
                    habit.themeId = correspondingTheme.id;  // Assign the correct themeId to the habit
                    delete habit.themeTempId;  // Remove the temporary index reference
                });

                // Step 3: Save all habits
                await DatabaseModule.getRepository(Habit).save(habits);

                console.log('Themes and their habits have been successfully uploaded.');
            } catch (error) {
                console.error('Error saving themes or habits to the database:', error);
            }
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
        });
}

// Main function to orchestrate the upload
async function main() {
    const csvFilePath = path.resolve(__dirname, '../../temp-storage/theme.csv');

    try {
        await initializeDatabase()
            .then(async () => {
                await uploadThemeFromCSV(csvFilePath);
                console.log('Upload complete.');
            });

    } catch (error) {
        console.error('Failed to upload lessons:', error);
    }
}

main();
