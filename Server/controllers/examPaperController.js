const ExamPaper = require("./../models/examPaperModel.js");
const factory = require("./../controllers/CRUDfactoryController.js");
const catchAsync = require("./../utils/catchAsync.js");
const Question = require("./../models/questionModel.js");
const Class = require("./../models/classModel.js");
const AppError = require("./../utils/appError.js");
const validator = require("validator");
const { promisify } = require("util");
const mongooseDynamic = require("mongoose-dynamic-schemas");
const addField = (questionType) => {
  if (questionType === "Multiple Choice Question{Single Correct}")
    return "totalMCQSingleCorrect";
  if (questionType === "Multiple Choice Question{Multi Correct}")
    return "totalMCQMultiCorrect";
  if (questionType === "Fill In The Blanks") return "totalFillUps";
  if (questionType === "One Word") return "totalOneWord";
  if (questionType === "Short Answer") return "totalShortAnswer";
  if (questionType === "Long Answer") return "totalLongAnswer";
  if (questionType === "Matching") return "totalMatching";
  if (questionType === "True/False") return "totalTrueFalse";
};

exports.setTeacherId_OrganizationId_ClassId = catchAsync(
  async (req, res, next) => {
    if (req.params.classId) {
      const myClass = await Class.findById(req.params.classId);
      if (!myClass) {
        return next(
          new AppError(
            "You are not allowed to add question in this class!",
            404
          )
        );
      } else {
        if (myClass.teacher != req.user.id) {
          return next(
            new AppError("You are not allowed to add paper for this class", 404)
          );
        }
      }
    }
    req.body.organization = req.user.organization;
    req.body.class = req.params.classId;
    req.body.teacher = req.user.id;
    req.body.questions = [];

    // Get ALl QUestions for specific teacher
    const allQuestionsInDatabase = await Question.find({
      organization: req.user.organization,
      class: req.params.classId,
      teacher: req.user.id,
    });

    // console.log(`All Questions in database ${allQuestionsInDatabase}`);

    // Check if questions present in database is greater than or equalto number of questions required!
    if (allQuestionsInDatabase.length < req.body.totalQuestions) {
      return next(
        new AppError(
          `You have only ${allQuestionsInDatabase.length} questions available in the database...`,
          404
        )
      );
    }
    console.log(allQuestionsInDatabase.length);
    // Types of questions present in database
    const allQuestionTypes = allQuestionsInDatabase.map(
      (question) => question.questionType
    );

    console.log(`All QuestionTypes in database ${allQuestionTypes}`);

    // Total Number of Questions of Each Type
    const eachQuestionTyprWithFrequencyInDataBase = {};
    allQuestionTypes.forEach((e) =>
      eachQuestionTyprWithFrequencyInDataBase[e]
        ? eachQuestionTyprWithFrequencyInDataBase[e]++
        : (eachQuestionTyprWithFrequencyInDataBase[e] = 1)
    );

    console.log(eachQuestionTyprWithFrequencyInDataBase);

    // // Sum of all questions{of any type} required!
    let sumOfQuestionsOfAllTypes = 0;
    let totalMarks = 0;
    for (const [key, value] of Object.entries(
      eachQuestionTyprWithFrequencyInDataBase
    )) {
      const fieldOfSpecificQuestionType = addField(key) + "";
      if (fieldOfSpecificQuestionType === "totalMCQSingleCorrect") {
        if (value < req.body.totalMCQSingleCorrect) {
          return next(new AppError(`${key} present in database is ${value}`));
        } else {
          sumOfQuestionsOfAllTypes += req.body.totalMCQSingleCorrect;
          // console.log(`Not in Add Random Questions`);
          // addRandomQuestions(key, req.body.totalMCQSingleCorrect);
          const questionsOfSpecificType = await Question.find({
            questionType: key,
          });
          for (let i = 0; i < req.body.totalMCQSingleCorrect; ) {
            const random = Math.floor(
              Math.random() * questionsOfSpecificType.length
            );
            if (
              req.body.questions.indexOf(questionsOfSpecificType[random]._id) >=
              0
            ) {
              continue;
            } else {
              req.body.questions.push(questionsOfSpecificType[random]._id);
            }
            i++;
          }
        }
      }
      if (fieldOfSpecificQuestionType === "totalShortAnswer") {
        if (value < req.body.totalShortAnswer) {
          return next(new AppError(`${key} present in database is ${value}`));
        } else {
          sumOfQuestionsOfAllTypes += req.body.totalShortAnswer;
          // addRandomQuestions(key, req.body.totalShortAnswer);
          const questionsOfSpecificType = await Question.find({
            questionType: key,
          });
          for (let i = 0; i < req.body.totalShortAnswer; ) {
            const random = Math.floor(
              Math.random() * questionsOfSpecificType.length
            );
            if (
              req.body.questions.indexOf(questionsOfSpecificType[random]._id) >=
              0
            ) {
              continue;
            } else {
              req.body.questions.push(questionsOfSpecificType[random]._id);
            }
            i++;
          }
        }
      }
      if (fieldOfSpecificQuestionType === "totalOneWord") {
        if (value < req.body.totalOneWord) {
          return next(new AppError(`${key} present in database is ${value}`));
        } else {
          sumOfQuestionsOfAllTypes += req.body.totalOneWord;
          // addRandomQuestions(key, req.body.totalOneWord);
          const questionsOfSpecificType = await Question.find({
            questionType: key,
          });
          for (let i = 0; i < req.body.totalOneWord; ) {
            const random = Math.floor(
              Math.random() * questionsOfSpecificType.length
            );
            if (
              req.body.questions.indexOf(questionsOfSpecificType[random]._id) >=
              0
            ) {
              continue;
            } else {
              req.body.questions.push(questionsOfSpecificType[random]._id);
            }
            i++;
          }
        }
      }
      if (fieldOfSpecificQuestionType === "totalMCQMultiCorrect") {
        if (value < req.body.totalMCQMultiCorrect) {
          return next(new AppError(`${key} present in database is ${value}`));
        } else {
          sumOfQuestionsOfAllTypes += req.body.totalMCQMultiCorrect;
          // addRandomQuestions(key, req.body.totalMCQMultiCorrect);
          const questionsOfSpecificType = await Question.find({
            questionType: key,
          });
          for (let i = 0; i < req.body.totalMCQMultiCorrect; ) {
            const random = Math.floor(
              Math.random() * questionsOfSpecificType.length
            );
            if (
              req.body.questions.indexOf(questionsOfSpecificType[random]._id) >=
              0
            ) {
              continue;
            } else {
              req.body.questions.push(questionsOfSpecificType[random]._id);
            }
            i++;
          }
        }
      }
      if (fieldOfSpecificQuestionType === "totalFillUps") {
        if (value < req.body.totalFillUps) {
          return next(new AppError(`${key} present in database is ${value}`));
        } else {
          sumOfQuestionsOfAllTypes += req.body.totalFillUps;
          // addRandomQuestions(key, req.body.totalFillUps);
          const questionsOfSpecificType = await Question.find({
            questionType: key,
          });
          for (let i = 0; i < req.body.totalFillUps; ) {
            const random = Math.floor(
              Math.random() * questionsOfSpecificType.length
            );
            if (
              req.body.questions.indexOf(questionsOfSpecificType[random]._id) >=
              0
            ) {
              continue;
            } else {
              req.body.questions.push(questionsOfSpecificType[random]._id);
            }
            i++;
          }
        }
      }
      if (fieldOfSpecificQuestionType === "totalLongAnswer") {
        if (value < req.body.totalLongAnswer) {
          return next(new AppError(`${key} present in database is ${value}`));
        } else {
          sumOfQuestionsOfAllTypes += req.body.totalLongAnswer;
          // addRandomQuestions(key, req.body.totalLongAnswer);
          const questionsOfSpecificType = await Question.find({
            questionType: key,
          });
          for (let i = 0; i < req.body.totalLongAnswer; ) {
            const random = Math.floor(
              Math.random() * questionsOfSpecificType.length
            );
            if (
              req.body.questions.indexOf(questionsOfSpecificType[random]._id) >=
              0
            ) {
              continue;
            } else {
              req.body.questions.push(questionsOfSpecificType[random]._id);
            }
            i++;
          }
        }
      }
      if (fieldOfSpecificQuestionType === "totalMatching") {
        if (value < req.body.totalMatching) {
          return next(new AppError(`${key} present in database is ${value}`));
        } else {
          sumOfQuestionsOfAllTypes += req.body.totalMatching;
          // addRandomQuestions(key, req.body.totalMatching);
          const questionsOfSpecificType = await Question.find({
            questionType: key,
          });
          for (let i = 0; i < req.body.totalMatching; ) {
            const random = Math.floor(
              Math.random() * questionsOfSpecificType.length
            );
            if (
              req.body.questions.indexOf(questionsOfSpecificType[random]._id) >=
              0
            ) {
              continue;
            } else {
              req.body.questions.push(questionsOfSpecificType[random]._id);
            }
            i++;
          }
        }
      }
      if (fieldOfSpecificQuestionType === "totalTrueFalse") {
        if (value < req.body.totalTrueFalse) {
          return next(new AppError(`${key} present in database is ${value}`));
        } else {
          sumOfQuestionsOfAllTypes += req.body.totalTrueFalse;
          // addRandomQuestions(key, req.body.totalTrueFalse);
          const questionsOfSpecificType = await Question.find({
            questionType: key,
          });
          for (let i = 0; i < req.body.totalTrueFalse; ) {
            const random = Math.floor(
              Math.random() * questionsOfSpecificType.length
            );
            if (
              req.body.questions.indexOf(questionsOfSpecificType[random]._id) >=
              0
            ) {
              continue;
            } else {
              req.body.questions.push(questionsOfSpecificType[random]._id);
            }
            i++;
          }
        }
      }
      // console.log(`EachIterate ${sumOfQuestionsOfAllTypes} `);
    }
    // console.log(`SumOfAllSpecific ${sumOfQuestionsOfAllTypes}`);

    if (sumOfQuestionsOfAllTypes > req.body.totalQuestions) {
      // console.log(sumOfQuestionsOfAllTypes, req.body.totalQuestions);
      return next(
        new AppError(
          `sum of all specific type of questions ${sumOfQuestionsOfAllTypes} is greater than total questions ${req.body.totalQuestions} `,
          401
        )
      );
    }

    if (sumOfQuestionsOfAllTypes < req.body.totalQuestions) {
      // console.log(sumOfQuestionsOfAllTypes, req.body.totalQuestions);
      return next(
        new AppError(
          "sum of all specific type of questions is less than total questions ",
          401
        )
      );
    }

    next();
  }
);
exports.deleteExamPaper = factory.deleteOne(ExamPaper);
exports.updateExamPaper = factory.updateOne(ExamPaper);
exports.createExamPaper = factory.createOne(ExamPaper);
exports.getExamPaper = factory.getOne(ExamPaper);
exports.getAllExamPapers = factory.getAll(ExamPaper);
